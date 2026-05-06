'use server';

import { db } from '@/lib/db';
import { validateAdmin } from '@/lib/permissions';
import { revalidatePath } from 'next/cache';

export async function getPlans() {
  try {
    return await db.plan.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error('[ACTION GET_PLANS ERROR]:', error);
    return [];
  }
}

export async function createPlan(data: { id: string; name: string; price: number; interval: string }) {
  try {
    await validateAdmin();

    const plan = await db.plan.create({
      data: {
        id: data.id,
        name: data.name,
        price: data.price,
        interval: data.interval,
      }
    });

    revalidatePath('/admin/plans');
    return { success: true, data: plan };
  } catch (error: any) {
    console.error('[ACTION CREATE_PLAN ERROR]:', error);
    return { success: false, error: error.message || 'Falha ao criar plano' };
  }
}

export async function updatePlan(id: string, data: { name: string; price: number; interval: string }) {
  try {
    await validateAdmin();

    const plan = await db.plan.update({
      where: { id },
      data: {
        name: data.name,
        price: data.price,
        interval: data.interval,
      }
    });

    revalidatePath('/admin/plans');
    return { success: true, data: plan };
  } catch (error: any) {
    console.error('[ACTION UPDATE_PLAN ERROR]:', error);
    return { success: false, error: error.message || 'Falha ao atualizar plano' };
  }
}

export async function deletePlan(id: string) {
  try {
    await validateAdmin();

    await db.plan.delete({
      where: { id }
    });

    revalidatePath('/admin/plans');
    return { success: true };
  } catch (error: any) {
    console.error('[ACTION DELETE_PLAN ERROR]:', error);
    return { success: false, error: error.message || 'Falha ao excluir plano' };
  }
}
