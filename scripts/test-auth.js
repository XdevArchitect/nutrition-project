const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function testAuth() {
  try {
    // Tìm user admin
    const user = await prisma.user.findUnique({
      where: { username: "admin" },
    });

    if (!user) {
      console.log("User not found");
      return;
    }

    console.log("User found:", user);

    // Test password
    const isValidPassword = await bcrypt.compare("admin123@", user.password);
    console.log("Password valid:", isValidPassword);

    // Test wrong password
    const isWrongPassword = await bcrypt.compare(
      "wrongpassword",
      user.password
    );
    console.log("Wrong password test:", isWrongPassword);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testAuth();
