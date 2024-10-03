import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { sendEmail } from "../services/sendMail";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

export default async function adminRoutes(fastify: FastifyInstance) {
  fastify.post("/users", async (request, reply) => {
    const { fullName, geres, cargo, setor, admin, email } = request.body as {
      fullName: string;
      geres: string;
      cargo: string;
      setor: string;
      admin: boolean;
      email: string;
    };

    try {
      // Verifica se o usuário já existe com o email fornecido
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return reply
          .status(400)
          .send({ message: "Usuário já existe com este email." });
      }

      const geresInt = parseInt(geres, 10);

      if (isNaN(geresInt)) {
        return reply
          .status(400)
          .send({ message: "GERES deve ser um número válido" });
      }

      const password = crypto.randomBytes(12).toString("hex");

      const user = await prisma.user.create({
        data: {
          fullName,
          geres: geresInt,
          admin,
          email,
          cargo,
          setor,
          password,
        },
      });

      await sendEmail(email, password); // Aguarda o envio do email

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

  fastify.put("/removeUsers/:id", async (request, reply) => {
    const { id } = request.params as { id: number };

    try {
      await prisma.user.update({
        where: { id },
        data: { active: false },
      });
      return reply.status(204).send(); // No Content
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      return reply.status(500).send({ message: "Erro ao deletar usuário" });
    }
  });

  fastify.get("/logs", async (request, reply) => {
    try {
      const logs = await prisma.log.findMany({
        include: {
          user: true,
          form: true,
        },
      });
      console.log(logs);

      return reply.send(logs);
    } catch (error) {
      console.error("Erro ao buscar logs:", error);
      return reply.status(500).send({ message: "Erro ao buscar logs" });
    }
  });

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

  fastify.get("/geres-data", async (request, reply) => {
    try {
      const geres = await prisma.dataForm.findMany({
        select: {
          createdAt: true,
          idUser: true,
        },
      });
      console.log(geres);

      const geresData = await Promise.all(
        geres.map(async (item: { idUser: any; createdAt: any }) => {
          const user = await prisma.user.findFirst({
            where: {
              id: item.idUser,
            },
            select: {
              geres: true,
              fullName: true,
            },
          });

          return {
            lastReply: item.createdAt,
            geres: user ? user.geres : null,
            fullName: user ? user.fullName : null,
          };
        })
      );

      reply.status(200).send(geresData);
    } catch (error) {
      console.error("Erro ao buscar dados da GERES:", error);
      reply.status(500).send({ error: "Erro ao buscar dados." });
    }
  });

  fastify.post("/send-alert", async (request, reply) => {
    const { geres } = request.body as {
      geres: number;
    };

    try {
      const users = await prisma.user.findMany({
        where: {
          geres: geres,
        },
        select: {
          email: true,
        },
      });

      const emails = users.map((user) => user.email);

      if (emails.length === 0) {
        return reply
          .status(404)
          .send({ message: "Nenhum email encontrado para essa GERES" });
      }

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: emails,
        subject: `Alerta: Data de Vencimento Próxima para GERES ${geres}`,
        text: `A data de vencimento para a GERES ${geres} está próxima. Por favor, envie os dados o quanto antes.`,
      };

      await transporter.sendMail(mailOptions);

      reply.status(200).send({ message: "Alerta enviado com sucesso!" });
    } catch (error) {
      console.error("Erro ao enviar alerta:", error);
      reply.status(500).send({ error: "Erro ao enviar alerta" });
    }
  });
}
