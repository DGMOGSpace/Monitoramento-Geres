import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Criar um novo usuário
  const hashedPassword = await bcrypt.hash("minhasenha", 10); // Hash a senha
  const user = await prisma.user.create({
    data: {
      username: "meuusuario",
      password: hashedPassword,
      geres: 123,
      cpf: "123.456.789-00",
    },
  });
  console.log("Usuário criado:", user);

  // Encontrar um usuário pelo CPF
  const foundUser = await prisma.user.findUnique({
    where: { cpf: "123.456.789-00" },
  });
  console.log("Usuário encontrado:", foundUser);

  // Verificar a senha
  const isValidPassword = await bcrypt.compare(
    "minhasenha",
    foundUser!.password
  );
  console.log("Senha válida:", isValidPassword);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
