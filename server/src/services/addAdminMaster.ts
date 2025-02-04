import { PrismaClient } from "@prisma/client";

require("dotenv").config();

const prisma = new PrismaClient();

export async function createAdminUser() {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: "dgmog.ses@gmail.com" },
    });

    if (existingUser) {
      console.log("User already exists:", existingUser);
      return;
    }

    const newUser = await prisma.user.create({
      data: {
        fullName: "Admin Master",
        password: process.env["ADMIN_PASS"] || "dgmopassword",
        email: "dgmog.ses@gmail.com",
        geres: 1,
        cargo: "Admin",
        setor: "Admin",
        admin: true,
      },
    });
    console.log("User created:", newUser);
  } catch (error) {
    console.error("Error creating user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

