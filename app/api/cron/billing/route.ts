import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { env } from '@/lib/env';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const expectedSecret = env.CRON_SECRET;

    if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🔄 Cron Billing: Iniciando processamento...');

    const now = new Date();
    
    // Executa em bloco para garantir atomicidade no log
    const expiredCount = await prisma.$transaction(async (tx) => {
      const expired = await tx.subscription.updateMany({
        where: {
          nextBillingDate: { lt: now },
          status: 'ACTIVE'
        },
        data: {
          status: 'PAST_DUE'
        }
      });

      if (expired.count > 0) {
        await tx.log.create({
          data: {
            userId: null,
            level: 'INFO',
            message: `Cron: ${expired.count} assinaturas marcadas como PAST_DUE`
          }
        });
      }

      return expired.count;
    });

    return NextResponse.json({ 
      success: true, 
      data: { expiredCount } 
    });

  } catch (error: any) {
    console.error('[CRON BILLING ERROR]:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Falha interna no processamento do cron' 
    }, { status: 500 });
  }
}
