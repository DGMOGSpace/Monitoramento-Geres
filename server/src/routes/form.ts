// src/routes/auth.ts
import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function formRoutes(fastify: FastifyInstance) {
  fastify.post("/form", async (request, reply) => {
    const { dimensao, macro, geres, tema, indicador, valor, dataref } =
      request.body as {
        dimensao: string;
        macro: string;
        geres: string;
        tema: string;
        indicador: string;
        valor: string;
        dataref: string;
      };

    return reply.status(201).send({ message: "Form Enviado" });
  });
}
