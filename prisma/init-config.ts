import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('⚙ Inicializando configurações...');

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

  console.log('✅ Configurações iniciais prontas!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
