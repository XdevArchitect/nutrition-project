const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // Hash password
    const saltRounds = 10;
    const plainPassword = 'admin123@';
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    // Tạo hoặc cập nhật user admin
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {
        password: hashedPassword,
        role: 'ADMIN',
        name: 'Admin User',
        username: 'admin',
      },
      create: {
        email: 'admin@example.com',
        password: hashedPassword,
        name: 'Admin User',
        username: 'admin',
        role: 'ADMIN',
      },
    });

    console.log('Admin user created/updated successfully:');
    console.log(`Email: ${adminUser.email}`);
    console.log(`Username: ${adminUser.username}`);
    console.log(`Name: ${adminUser.name}`);
    console.log(`Role: ${adminUser.role}`);
    console.log('Password has been hashed and stored securely');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();