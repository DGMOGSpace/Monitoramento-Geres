import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function adminRoutes(fastify: FastifyInstance) {
  fastify.post("/users", async (request, reply) => {
    const { fullName, password, geres, admin, email } = request.body as {
      fullName: string;
      password: string;
      geres: string; // Mantenha como string inicialmente
      admin: boolean;
      email: string;
    };

    try {
      // Converte geres de string para inteiro
      const geresInt = parseInt(geres, 10);

      // Verifica se a conversão foi bem-sucedida
      if (isNaN(geresInt)) {
        return reply
          .status(400)
          .send({ message: "GERES deve ser um número válido" });
      }

      const user = await prisma.user.create({
        data: {
          fullName,
          password,
          geres: geresInt,
          admin,
          email,
        },
      });
      return reply.status(201).send(user);
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      return reply.status(500).send({ message: "Erro ao criar usuário" });
    }
  });

  fastify.get("/users", async (request, reply) => {
    try {
      const users = await prisma.user.findMany({
        include: {
          logs: true,
          dataForms: true,
        },
      });
      return reply.send(users);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      return reply.status(500).send({ message: "Erro ao buscar usuários" });
    }
  });

  fastify.put("/users/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const { fullName, password, geres, admin, email } = request.body as {
      fullName?: string;
      password?: string;
      geres?: number;
      admin?: boolean;
      email?: string;
    };

    try {
      const user = await prisma.user.update({
        where: { id: Number(id) },
        data: {
          fullName,
          password,
          geres,
          admin,
          email,
        },
      });
      return reply.send(user);
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      return reply.status(500).send({ message: "Erro ao atualizar usuário" });
    }
  });

  // DELETE - Deletar um usuário
  fastify.delete("/users/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      await prisma.user.delete({
        where: { id: Number(id) },
      });
      return reply.status(204).send(); // No Content
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      return reply.status(500).send({ message: "Erro ao deletar usuário" });
    }
  });

  // READ - Obter logs
  fastify.get("/logs", async (request, reply) => {
    try {
      const logs = await prisma.log.findMany({
        include: {
          user: true,
          form: true,
        },
      });
      return reply.send(logs);
    } catch (error) {
      console.error("Erro ao buscar logs:", error);
      return reply.status(500).send({ message: "Erro ao buscar logs" });
    }
  });

  // READ - Obter todos os dataForms
  fastify.get("/dataForms", async (request, reply) => {
    try {
      const dataForms = await prisma.dataForm.findMany({
        include: {
          user: true,
        },
      });
      return reply.send(dataForms);
    } catch (error) {
      console.error("Erro ao buscar dataForms:", error);
      return reply.status(500).send({ message: "Erro ao buscar dataForms" });
    }
  });
}
