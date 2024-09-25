// src/routes/auth.ts
import { FastifyInstance, FastifyPluginOptions } from "fastify";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function authRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.post("/login", async (request, reply) => {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return reply.status(401).send({ message: "Credenciais inválidas" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return reply.status(401).send({ message: "Credenciais inválidas" });
    }

    const token = fastify.jwt.sign(
      { id: user.id, email: user.email },
      {
        expiresIn: process.env.JWT_EXPIRATION || "1h",
      }
    );

    return { token };
  });
}
