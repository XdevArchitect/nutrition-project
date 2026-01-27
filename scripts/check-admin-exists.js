const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAdminExists() {
  try {
    // Tìm user admin theo username
    const adminUser = await prisma.user.findUnique({
      where: { username: 'admin' },
    });

    if (adminUser) {
      console.log('Admin user found:');
      console.log(`ID: ${adminUser.id}`);
      console.log(`Email: ${adminUser.email}`);
      console.log(`Username: ${adminUser.username}`);
      console.log(`Name: ${adminUser.name}`);
      console.log(`Role: ${adminUser.role}`);
      console.log(`Password (hashed): ${adminUser.password}`);
    } else {
      console.log('Admin user not found');
    }

    // Kiểm tra tất cả users với role ADMIN
    const adminUsers = await prisma.user.findMany({
      where: { role: 'ADMIN' },
    });

    console.log(`\nTotal admin users: ${adminUsers.length}`);
    adminUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.username}) - ${user.email}`);
    });
  } catch (error) {
    console.error('Error checking admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdminExists();