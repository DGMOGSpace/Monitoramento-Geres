// src/routes/auth.ts
import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function formRoutes(fastify: FastifyInstance) {
  fastify.post("/addData", async (request, reply) => {
    const { dimensao, macro, geres, tema, indicador, valor, dataref, userId } =
      request.body as {
        dimensao: string;
        macro: string;
        geres: string;
        tema: string;
        indicador: string;
        valor: string;
        dataref: string;
        userId: number;
      };
    console.log(userId, dimensao);

    return reply.status(201).send({ message: "Form Enviado" });
  });
}
