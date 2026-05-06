'use server';

import { db } from '@/lib/db';
import { getProfile } from '@/lib/auth';

export async function getDashboardStats() {
  const profile = await getProfile();
  
  if (!profile || profile.role !== 'ADMIN') {
    return {
      totalRevenue: 0,
      mrr: 0,
      activeSubsCount: 0,
      avgTicket: 0,
      conversionRate: 0,
      salesByDay: [],
      funnel: { views: 0, paid: 0 }
    };
  }

  const userId = profile.userId;

  // 1. Receita Total (Global)
  const revenueData = await db.transaction.aggregate({
    where: { status: 'PAID' },
    _sum: { amount: true }
  });
  const totalRevenue = Number(revenueData._sum.amount || 0);

  // 2. MRR (Global)
  const activeSubs = await db.subscription.findMany({
    where: { status: 'ACTIVE' },
    include: { plan: true }
  });

  const mrr = activeSubs.reduce((acc, sub) => {
    const price = Number(sub.plan.price);
    const interval = sub.plan.interval;
    if (interval === 'monthly') return acc + price;
    if (interval === 'fortnightly') return acc + (price * 2);
    if (interval === 'yearly') return acc + (price / 12);
    return acc;
  }, 0);

  // 3. Assinaturas Ativas
  const activeSubsCount = activeSubs.length;

  // 4. Ticket Médio
  const paidCount = await db.transaction.count({
    where: { status: 'PAID' }
  });
  const avgTicket = paidCount > 0 ? totalRevenue / paidCount : 0;

  // 5. Churn Rate (Cancelamentos nos últimos 30 dias)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const canceledCount = await db.subscription.count({
    where: { status: 'CANCELED', updatedAt: { gte: thirtyDaysAgo } }
  });
  const churnRate = activeSubsCount > 0 ? (canceledCount / activeSubsCount) * 100 : 0;

  // 6. LTV (Lifetime Value)
  const ltv = churnRate > 0 ? (avgTicket / (churnRate / 100)) : avgTicket;

  // 7. Funil e Conversão
  const funnelViews = await db.funnelEvent.count({ where: { step: 'view_checkout' } });
  const funnelPaid = await db.funnelEvent.count({ where: { step: 'paid' } });
  const conversionRate = funnelViews > 0 ? (funnelPaid / funnelViews) * 100 : 0;

  // 8. Gráfico de Vendas (Últimos 7 dias)
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const salesByDay = await Promise.all(last7Days.map(async (date) => {
    const count = await db.transaction.count({
      where: { 
        status: 'PAID',
        createdAt: {
          gte: new Date(date),
          lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000)
        }
      }
    });
    return { 
      date: new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }), 
      count 
    };
  }));

  return {
    totalRevenue,
    mrr,
    activeSubsCount,
    avgTicket,
    conversionRate,
    churnRate,
    ltv,
    salesByDay,
    funnel: { views: funnelViews, paid: funnelPaid }
  };
}
