import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getStripe } from '@/lib/stripe';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ success: false, error: 'Missing stripe-signature' }, { status: 400 });
  }

  let event;

  try {
    const stripe = getStripe();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.error('❌ STRIPE_WEBHOOK_SECRET is not defined');
      return NextResponse.json({ success: false, error: 'Webhook secret not configured' }, { status: 500 });
    }

    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (err: any) {
    console.error(`❌ Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ success: false, error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  const session = event.data.object as any;

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        // Ativar assinatura e marcar transação como paga
        const transactionId = session.metadata?.transactionId;
        const userId = session.metadata?.userId;
        const planId = session.metadata?.planId;

        if (transactionId && userId) {
          await prisma.$transaction([
            prisma.transaction.update({
              where: { id: transactionId },
              data: { status: 'PAID' }
            }),
            prisma.subscription.upsert({
              where: { id: `sub_${userId}` },
              update: {
                planId,
                status: 'ACTIVE',
                stripeId: session.subscription?.toString(),
                nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              },
              create: {
                id: `sub_${userId}`,
                userId,
                planId,
                status: 'ACTIVE',
                stripeId: session.subscription?.toString(),
                nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              }
            }),
            prisma.log.create({
              data: {
                userId,
                level: 'INFO',
                message: 'Pagamento Stripe Confirmado - Assinatura Ativada',
                payload: JSON.stringify({ 
                  transactionId, 
                  subscriptionId: session.subscription,
                  customerId: session.customer 
                })
              }
            })
          ]);
        }
        break;

      case 'invoice.paid':
        if (session.subscription) {
          await prisma.subscription.update({
            where: { stripeId: session.subscription.toString() },
            data: { 
              status: 'ACTIVE',
              nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            }
          }).catch(() => {});
        }
        break;

      case 'customer.subscription.deleted':
        if (session.id) {
          await prisma.subscription.update({
            where: { stripeId: session.id.toString() },
            data: { status: 'CANCELED' }
          }).catch(() => {});
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ success: true, received: true });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    await prisma.log.create({
      data: {
        level: 'ERROR',
        message: `Erro ao processar webhook Stripe: ${event?.type}`,
        payload: JSON.stringify({ error: error.message, eventType: event?.type })
      }
    }).catch(() => {});
    
    return NextResponse.json({ success: false, error: 'Webhook handler failed' }, { status: 500 });
  }
}
