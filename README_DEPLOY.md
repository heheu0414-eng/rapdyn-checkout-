# Guia de Deploy Vercel - Rapdyn Checkout

O projeto está 100% otimizado e testado para deploy automático na Vercel.

## 🚀 Passos para Deploy

1. **Subir para o GitHub**:
   ```bash
   git add .
   git commit -m "chore: preparação final para deploy vercel"
   git push origin main
   ```

2. **Importar na Vercel**:
   - Vá em [vercel.com/new](https://vercel.com/new)
   - Selecione seu repositório.
   - O Framework será detectado automaticamente como **Next.js**.

3. **Configurar Variáveis de Ambiente**:
   No painel da Vercel, adicione as seguintes variáveis (essenciais):

   | Variável | Valor Exemplo / Origem |
   | :--- | :--- |
   | `DATABASE_URL` | Sua URL do Postgres (Supabase) |
   | `NEXT_PUBLIC_SUPABASE_URL` | URL do seu projeto Supabase |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon Key do Supabase |
   | `STRIPE_SECRET_KEY` | Sua Secret Key do Stripe |
   | `STRIPE_WEBHOOK_SECRET` | Secret do Webhook (obtenha no CLI ou Dashboard Stripe) |
   | `RAPDYN_API_URL` | `https://api.rapdyn.io` |
   | `WEBHOOK_SECRET` | Seu token de segurança para webhooks Rapdyn |
   | `CRON_SECRET` | Token para proteger as rotas de Cron |
   | `ADMIN_EMAIL` | `admin@teste.com` (ou seu email de admin) |

4. **Build & Deploy**:
   - Clique em **Deploy**.
   - O comando de build `npm run build` executará automaticamente o `prisma generate`.

## 🛠️ Manutenção Pós-Deploy

- **Webhooks**: Após o deploy, atualize as URLs de Webhook no painel do Stripe e Rapdyn para apontar para o seu domínio da Vercel (ex: `https://seu-app.vercel.app/api/webhooks/stripe`).
- **Cron Jobs**: Ative os Cron Jobs no painel da Vercel apontando para `/api/cron/billing` e `/api/cron/check-subscriptions`.

---
Sistema estabilizado e auditado por **Antigravity**.
