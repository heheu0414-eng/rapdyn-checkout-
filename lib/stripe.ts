import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export const stripe = stripeSecretKey 
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2026-04-22.dahlia' as any, 
      typescript: true,
    })
  : null as any;

// Helper para garantir que o stripe está disponível apenas quando necessário
export const getStripe = () => {
  if (!stripe) {
    throw new Error('STRIPE_SECRET_KEY is not defined');
  }
  return stripe;
};
