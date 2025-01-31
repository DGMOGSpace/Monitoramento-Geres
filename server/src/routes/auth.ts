import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.put("/modify_password", async (request, reply) => {
    const { email, newPassword, currentPassword } = request.body as {
      email: string;
      currentPassword: string;
      newPassword: string;
    };

    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });
      console.log(user?.password, currentPassword)
      if (user?.password === currentPassword) {
        await prisma.user.update({
          where: { email },
          data: {
            password: newPassword,
            active: true,
          },
        });
        reply
          .status(200)
          .send({ success: true, message: "Senha cadastrada com sucesso." });
      }
    } catch (error) {
      reply
        .status(500)
        .send({ success: false, message: "Erro ao cadastrar a senha." });
    }
  });

  fastify.post("/login", async (request, reply) => {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };

    const user = await prisma.user.findUnique({
      where: { email, password, active: true },
    });

    if (!user) {
      return reply.status(401).send({ message: "Credenciais inválidas" });
    }

    const token = fastify.jwt.sign(
      { id: user.id, email: user.email },
      {
        expiresIn: process.env.JWT_EXPIRATION || "1h",
      }
    );

    const userResponse = {
      id: user.id,
      fullName: user.fullName,
      geres: user.geres,
      admin: user.admin,
      email: user.email,
    };

    return {
      user: userResponse,
      token,
    };
  });
}
