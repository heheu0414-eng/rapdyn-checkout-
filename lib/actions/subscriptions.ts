'use server';

import { db } from '@/lib/db';
import { getProfile } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function createSubscription(planId: string) {
  try {
    const profile = await getProfile();
    if (!profile) return { success: false, error: 'Não autenticado' };

    // Calcular próxima data de cobrança
    const plan = await db.plan.findUnique({ where: { id: planId } });
    if (!plan) return { success: false, error: 'Plano não encontrado' };

    const nextBillingDate = new Date();
    if (plan.interval === 'fortnightly') nextBillingDate.setDate(nextBillingDate.getDate() + 15);
    if (plan.interval === 'monthly') nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
    if (plan.interval === 'yearly') nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
    if (plan.interval === 'lifetime') nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 100);

    const subscription = await db.subscription.create({
      data: {
        userId: profile.userId,
        planId: plan.id,
        status: 'ACTIVE',
        startDate: new Date(),
        nextBillingDate: plan.interval === 'lifetime' ? null : nextBillingDate,
      }
    });

    revalidatePath('/admin');
    revalidatePath('/dashboard');
    return { success: true, data: subscription };
  } catch (error: any) {
    console.error('[ACTION CREATE_SUB ERROR]:', error);
    return { success: false, error: 'Falha ao criar assinatura' };
  }
}

export async function cancelSubscription(id: string) {
  try {
    const profile = await getProfile();
    if (!profile) return { success: false, error: 'Não autenticado' };

    const subscription = await db.subscription.update({
      where: { id, userId: profile.userId },
      data: {
        status: 'CANCELED',
      }
    });

    revalidatePath('/admin');
    revalidatePath('/dashboard');
    return { success: true, data: subscription };
  } catch (error: any) {
    console.error('[ACTION CANCEL_SUB ERROR]:', error);
    return { success: false, error: 'Falha ao cancelar assinatura' };
  }
}

export async function checkSubscriptions() {
  try {
    const now = new Date();
    const expired = await db.subscription.updateMany({
      where: {
        status: 'ACTIVE',
        nextBillingDate: { lt: now }
      },
      data: {
        status: 'PAST_DUE'
      }
    });
    return expired.count;
  } catch (error) {
    console.error('[ACTION CHECK_SUBS ERROR]:', error);
    return 0;
  }
}
