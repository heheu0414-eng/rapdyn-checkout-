/**
 * Gerenciador seguro de variáveis de ambiente.
 * Garante que a aplicação não quebre se variáveis estiverem ausentes no build.
 */

export const env = {
  DATABASE_URL: process.env.DATABASE_URL || "",
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || "",
  STRIPE_PRICE_QUINZENAL: process.env.STRIPE_PRICE_QUINZENAL || "",
  STRIPE_PRICE_MENSAL: process.env.STRIPE_PRICE_MENSAL || "",
  STRIPE_PRICE_ANUAL: process.env.STRIPE_PRICE_ANUAL || "",
  STRIPE_PRICE_VITALICIO: process.env.STRIPE_PRICE_VITALICIO || "",
  RAPDYN_API_URL: process.env.RAPDYN_API_URL || "https://api.rapdyn.io",
  WEBHOOK_SECRET: process.env.WEBHOOK_SECRET || "dev_secret",
  CRON_SECRET: process.env.CRON_SECRET || "",
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || "admin@teste.com",
  NODE_ENV: process.env.NODE_ENV || "development",
};

export const isProduction = env.NODE_ENV === "production";

/**
 * Validação básica para garantir que as variáveis críticas existam em runtime.
 * Retorna true se estiver tudo OK.
 */
export function validateEnv() {
  const critical = [
    "DATABASE_URL",
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  ];
  
  const missing = critical.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`❌ VARIÁVEIS DE AMBIENTE CRÍTICAS AUSENTES: ${missing.join(", ")}`);
    return false;
  }
  
  return true;
}
