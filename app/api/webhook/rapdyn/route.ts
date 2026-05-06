import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { env } from '@/lib/env';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const payload = await req.json().catch(() => ({}));

    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');
    const authHeader = req.headers.get('authorization') || req.headers.get('x-webhook-token');

    const config = await prisma.adminConfig.findFirst();
    const expectedToken = config?.webhookSecret || env.WEBHOOK_SECRET;

    const isProduction = env.NODE_ENV === 'production';
    const providedToken = token || authHeader;
    
    if (!providedToken || providedToken !== expectedToken) {
      if (isProduction) {
        await prisma.log.create({
          data: {
            level: 'ERROR',
            message: 'Webhook Rapdyn: Token inválido em PROD',
            payload: JSON.stringify({ query: token })
          }
        }).catch(() => {});
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      } else {
        console.warn('⚠️ [DEV] Webhook Rapdyn sem token válido');
      }
    }

    const transactionId = payload.reference_id || payload.id;
    const status = payload.status; 

    if (!transactionId) {
      return NextResponse.json({ success: false, error: 'Transaction ID missing' }, { status: 400 });
    }

    const transaction = await prisma.transaction.findFirst({
      where: {
        OR: [
          { id: transactionId },
          { rapdynTxId: transactionId }
        ]
      }
    });

    if (!transaction) {
      return NextResponse.json({ success: false, error: 'Transaction not found' }, { status: 404 });
    }

    await updateStatus(transaction.id, status);

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('[WEBHOOK RAPDYN ERROR]:', error);
    return NextResponse.json({ success: false, error: 'Internal Error' }, { status: 500 });
  }
}

async function updateStatus(id: string, webhookStatus: string) {
  let mappedStatus = 'PENDING';
  const statusLower = webhookStatus?.toLowerCase() || '';

  if (['paid', 'approved', 'pago', 'aprovado', 'settled', 'success'].includes(statusLower)) {
    mappedStatus = 'PAID';
  } else if (['failed', 'refused', 'recusado', 'canceled', 'cancelado', 'error'].includes(statusLower)) {
    mappedStatus = 'FAILED';
  }

  await prisma.transaction.update({
    where: { id },
    data: { status: mappedStatus }
  });
}
