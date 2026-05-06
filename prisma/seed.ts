import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // 1. Criar Planos Padrão
  const plans = [
    { id: 'quinzenal', name: 'Plano Quinzenal', price: 49.90, interval: 'fortnightly' },
    { id: 'mensal', name: 'Plano Mensal', price: 89.90, interval: 'monthly' },
    { id: 'vitalicio', name: 'Plano Vitalício', price: 299.00, interval: 'lifetime' },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { id: plan.id },
      update: {},
      create: plan,
    });
  }
  console.log('✔ Planos criados/verificados.');

  // 2. Criar Perfil Admin (Nota: O ID deve bater com o ID do Supabase Auth se possível)
  // Como estamos em teste, vamos criar um perfil com um ID genérico se ele não existir
  // Mas o ideal é que ele seja criado via fluxo de login. 
  // Para garantir que o /admin não quebre por falta de Profile:
  
  const adminEmail = 'admin@teste.com';
  
  // 3. Criar Configurações Iniciais
  await prisma.adminConfig.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      clientId: 'dummy_client_id',
      clientSecret: 'dummy_client_secret',
      password: 'admin_password_123',
    },
  });
  console.log('✔ Configurações iniciais prontas.');

  // Buscamos se já existe
  const existingAdmin = await prisma.profile.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    console.log('⚠ Perfil admin não encontrado. Ele será criado automaticamente no primeiro login ou você pode criar via Supabase Auth.');
  }

  console.log('✅ Seed finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
