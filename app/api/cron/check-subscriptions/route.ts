import { NextResponse } from 'next/server';
import { checkSubscriptions } from '@/lib/actions/subscriptions';
import { env } from '@/lib/env';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const expectedSecret = env.CRON_SECRET;

    if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const expiredCount = await checkSubscriptions();
    
    return NextResponse.json({
      success: true,
      data: {
        expiredCount,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('[CRON CHECK-SUBS ERROR]:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Falha ao verificar assinaturas' 
    }, { status: 500 });
  }
}
