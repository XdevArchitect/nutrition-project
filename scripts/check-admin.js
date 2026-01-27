const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Kiểm tra user admin
  const adminUser = await prisma.user.findUnique({
    where: { email: 'admin@example.com' },
  });

  console.log('Admin user:', adminUser);
  
  if (adminUser) {
    console.log('✅ Admin user found in database');
    console.log('ID:', adminUser.id);
    console.log('Name:', adminUser.name);
    console.log('Role:', adminUser.role);
  } else {
    console.log('❌ Admin user not found in database');
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });