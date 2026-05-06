import { env } from './env';

export const PLAN_MAP = {
  quinzenal: {
    name: 'Plano Quinzenal',
    price: 49.90,
    interval: 'fortnightly',
    stripePriceId: env.STRIPE_PRICE_QUINZENAL
  },
  mensal: {
    name: 'Plano Mensal',
    price: 89.90,
    interval: 'monthly',
    stripePriceId: env.STRIPE_PRICE_MENSAL
  },
  anual: {
    name: 'Plano Anual',
    price: 699.00,
    interval: 'yearly',
    stripePriceId: env.STRIPE_PRICE_ANUAL
  },
  vitalicio: {
    name: 'Plano Vitalício',
    price: 1299.00,
    interval: 'lifetime',
    stripePriceId: env.STRIPE_PRICE_VITALICIO
  }
} as const;

export type PlanKey = keyof typeof PLAN_MAP;
