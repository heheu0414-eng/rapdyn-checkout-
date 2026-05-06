# 🚀 Checklist de Deploy Final - Rapdyn Checkout

Siga estes passos na ordem exata para colocar seu sistema online em menos de 5 minutos.

---

### 1. Enviar para o GitHub (Terminal)
Abra o terminal na pasta do projeto e execute estes 3 comandos:
```bash
git add .
git commit -m "deploy production ready"
git push
```
*Isso envia todo o código corrigido para o seu repositório no GitHub.*

---

### 2. Importar na Vercel
1. Acesse **[vercel.com](https://vercel.com)** e faça login.
2. Clique no botão **"Add New"** e depois em **"Project"**.
3. Encontre o repositório **rapdyn-checkout** e clique em **"Import"**.

---

### 3. Configurações do Projeto
Verifique se os campos estão assim (geralmente a Vercel preenche automático):
- **Framework Preset:** Next.js
- **Root Directory:** `./`
- **Build Command:** `npm run build`
- **Install Command:** `npm install`

---

### 4. Variáveis de Ambiente (CRÍTICO)
No campo **"Environment Variables"**, adicione cada uma destas (copie o nome e cole o valor do seu arquivo `.env` local):

1. `DATABASE_URL` (Sua URL do banco Supabase)
2. `NEXT_PUBLIC_SUPABASE_URL` (URL do projeto Supabase)
3. `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Chave Anon do Supabase)
4. `STRIPE_SECRET_KEY` (Sua Secret Key do Stripe)
5. `STRIPE_WEBHOOK_SECRET` (Sua Secret do Webhook Stripe)
6. `RAPDYN_API_URL` (Valor: `https://api.rapdyn.io`)
7. `WEBHOOK_SECRET` (Sua Secret do Webhook Rapdyn)
8. `CRON_SECRET` (Um token qualquer para proteger seus agendamentos)
9. `ADMIN_EMAIL` (Email que terá acesso ao painel admin)

---

### 5. Finalizar
Clique no botão **"Deploy"** lá embaixo.
Aguarde a barra de progresso. Quando terminar, você receberá um link como:
`https://rapdyn-checkout.vercel.app` 🎉

---
**Seu sistema agora está 100% online e pronto para uso!**
