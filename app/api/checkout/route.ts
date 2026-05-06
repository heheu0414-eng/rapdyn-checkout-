import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { PLAN_MAP, PlanKey } from '@/lib/constants';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const idempotencyKey = req.headers.get('idempotency-key');

  try {
    const body = await req.json().catch(() => ({}));
    const { planId, name, email, cpf, phone, method } = body;

    // 1. Validação de Entrada
    if (!planId || !email || !method) {
      return NextResponse.json({ 
        success: false, 
        error: 'Dados obrigatórios ausentes (planId, email, method)' 
      }, { status: 400 });
    }

    const plan = PLAN_MAP[planId as PlanKey];
    if (!plan) {
      return NextResponse.json({ 
        success: false, 
        error: 'Plano inválido ou inexistente' 
      }, { status: 400 });
    }

    // 2. Garantir Sessão Real do Usuário (Supabase)
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    // Se não estiver logado, podemos permitir guest checkout OU exigir login.
    // Conforme pedido, vamos priorizar a sessão real.
    const targetUserId = authUser?.id || `guest_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // 3. Processamento Atômico
    const result = await prisma.$transaction(async (tx) => {
      // 3.1 Perfil Robusto
      // Se autenticado, tentamos buscar pelo userId primeiro
      let profile;
      if (authUser) {
        profile = await tx.profile.upsert({
          where: { userId: authUser.id },
          update: { email: email.toLowerCase() },
          create: {
            userId: authUser.id,
            email: email.toLowerCase(),
            role: 'USER'
          }
        });
      } else {
        // Se guest, buscamos pelo e-mail
        profile = await tx.profile.upsert({
          where: { email: email.toLowerCase() },
          update: {}, // Não altera nada se já existe
          create: {
            userId: targetUserId,
            email: email.toLowerCase(),
            role: 'USER',
          }
        });
      }

      // 3.2 Idempotência
      if (idempotencyKey) {
        const existingLog = await tx.log.findFirst({
          where: { 
            userId: profile.userId, 
            message: { contains: idempotencyKey } 
          }
        });
        if (existingLog) throw new Error('DUPLICATE_REQUEST');
      }

      // 3.3 Transação (Amount SEMPRE do Backend)
      const transaction = await tx.transaction.create({
        data: {
          userId: profile.userId,
          planId,
          amount: plan.price,
          paymentMethod: method,
          status: 'PENDING',
        }
      });

      return { profile, transaction };
    }, { timeout: 10000 }); // Timeout de 10s para evitar deadlocks

    // 4. Gateway Integration (Com Isolamento de Falha)
    try {
      const config = await prisma.adminConfig.findFirst();
      const response = await fetch('https://api.rapdyn.io/v1/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'client-id': config?.clientId || '',
          'client-secret': config?.clientSecret || '',
        },
        body: JSON.stringify({
          customer: { name, email: email.toLowerCase(), document: cpf, phone },
          payment: { method, amount: Math.round(Number(plan.price) * 100) },
          reference_id: result.transaction.id
        })
      });

      if (response.ok) {
        const data = await response.json();
        const finalTx = await prisma.transaction.update({
          where: { id: result.transaction.id },
          data: {
            rapdynTxId: data.id?.toString(),
            qrCode: data.pix?.qr_code || data.qr_code,
            qrCodeCopyPaste: data.pix?.copy_paste || data.copy_paste,
          }
        });
        return NextResponse.json({ success: true, data: finalTx });
      } else {
        const errorData = await response.json().catch(() => ({}));
        await prisma.transaction.update({
          where: { id: result.transaction.id },
          data: { status: 'FAILED' }
        });
        return NextResponse.json({ 
          success: false, 
          error: 'Erro no processamento do pagamento', 
          details: errorData 
        }, { status: response.status });
      }
    } catch (gatewayError: any) {
      console.error('[GATEWAY FAIL]:', gatewayError);
      return NextResponse.json({ 
        success: false, 
        error: 'Serviço de pagamento temporariamente indisponível' 
      }, { status: 503 });
    }

  } catch (error: any) {
    if (error.message === 'DUPLICATE_REQUEST') {
      return NextResponse.json({ success: false, error: 'Requisição duplicada' }, { status: 409 });
    }
    
    console.error('[CRITICAL CHECKOUT ERROR]:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Erro interno no processamento do checkout' 
    }, { status: 500 });
  }
}
