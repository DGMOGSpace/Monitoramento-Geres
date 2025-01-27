import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { sendEmail } from "../services/sendMail";
import nodemailer from "nodemailer";
import ExcelJS from "exceljs";

require("dotenv").config();

const prisma = new PrismaClient();

interface GeresData {
  geres: number; 
  fullName: string;
  lastReply: Date; 
}

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

      await sendEmail(email, password); 

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
      return reply.status(204).send(); 
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
      const geres = await prisma.$queryRaw<GeresData[]>`SELECT 
        u.geres,
        u.fullName,
        df.createdAt AS lastReply
      FROM 
        DataForm df
      JOIN 
        User u ON df.idUser = u.id
      WHERE 
        df.createdAt = (
            SELECT MAX(createdAt)
            FROM DataForm
            WHERE idUser IN (
                SELECT id
                FROM User
                WHERE geres = u.geres
            )
        );`;

      reply.status(200).send(geres);
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
          user: process.env["EMAIL_USER"],
          pass: process.env["EMAIL_PASS"],
        },
      });

      const mailOptions = {
        from: process.env["EMAIL_USER"],
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

  fastify.get("/download_excel", async (request, reply) => {
    try {
      const data = await prisma.log.findMany({
        include: {
          user: true,
          form: true,
        },
      });

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Logs");

      worksheet.columns = [
        { header: "ID", key: "logId", width: 10 },
        { header: "ID do Formulário", key: "formId", width: 10 },
        { header: "Nome do Usuário", key: "userName", width: 30 },
        { header: "Email do Usuário", key: "userEmail", width: 30 },
        { header: "Cargo do Usuário", key: "userCargo", width: 20 },
        { header: "Geres do Usuário", key: "geres", width: 20 },
        {
          header: "Execução do Orçamento por Regional",
          key: "execucao_do_orcamento_por_regional",
          width: 20,
        },
        {
          header: "Taxa de Satisfação do Municipio de Apoio das Geres",
          key: "taxa_de_satisfacao_municipios_apoio_geres",
          width: 20,
        },
        {
          header: "Taxa de Satisfação",
          key: "taxa_de_satisfacao_municipios_apoio_geres",
          width: 20,
        },
        {
          header: "Resolução Ações Competências GERES",
          key: "resolucao_acoes_competencias_geres",
          width: 20,
        },
        {
          header: "Municípios Visitados",
          key: "municipios_visitados",
          width: 20,
        },
        {
          header: "Aproveitamento Cotas Exame Imagem",
          key: "aproveitamento_cotas_exame_imagem",
          width: 20,
        },
        {
          header: "Taxa de Perda Primária UPAE",
          key: "taxa_perda_primaria_upae",
          width: 20,
        },
        {
          header: "Taxa de Absentismo",
          key: "taxa_absenteismo",
          width: 20,
        },
        {
          header: "Cumprimento PES Quadrimestre",
          key: "cumprimento_pes_quadrimestre",
          width: 20,
        },
        {
          header: "Cumprimento PES Exercício",
          key: "cumprimento_pes_exercicio",
          width: 20,
        },
        {
          header: "Índice Qualificação Ações Vigilância",
          key: "indice_qualificacao_acoes_vigilancia",
          width: 20,
        },
        {
          header: "Aproveitamento Cotas Consultas Especializadas",
          key: "aproveitamento_cotas_consultas_especializadas",
          width: 20,
        },
        {
          header: "Municípios Instrumentos Gestão SUS Atualizados",
          key: "municipios_instrumentos_gestao_sus_atualizados",
          width: 20,
        },
        {
          header: "Implementação Planejamento Estratégico",
          key: "implementacao_planejamento_estrategico",
          width: 20,
        },
        {
          header:
            "Engajamento Gestores Reuniões Grupos Condutores Macrorregionais",
          key: "engajamento_gestores_reunioes_grupos_condutores_macrorregionais",
          width: 20,
        },
        {
          header: "Integração Grupos Condutores Rede PRI",
          key: "integracao_grupos_condutores_rede_pri",
          width: 20,
        },
        {
          header: "Participação Gestores Reuniões Câmara Técnica CT CIR",
          key: "participacao_gestores_reunioes_camara_tecnica_ct_cir",
          width: 20,
        },
        {
          header: "Participação Gestores Reuniões CIR",
          key: "participacao_gestores_reunioes_cir",
          width: 20,
        },

        { header: "Data Início", key: "dataInicio", width: 20 },
        { header: "Data Final", key: "dataFinal", width: 20 },
        { header: "Data de Criação", key: "createdAt", width: 20 },
      ];

      data.forEach((log) => {
        worksheet.addRow({
          logId: log.id,
          userName: log.user.fullName,
          userEmail: log.user.email,
          userCargo: log.user.cargo,
          geres: log.user.geres,
          formId: log.form.id,
          execucao_do_orcamento_por_regional:
            log.form.execucao_do_orcamento_por_regional,
          taxa_de_satisfacao_municipios_apoio_geres:
            log.form.taxa_de_satisfacao_municipios_apoio_geres,
          resolucao_acoes_competencias_geres:
            log.form.resolucao_acoes_competencias_geres,
          municipios_visitados: log.form.municipios_visitados,
          aproveitamento_cotas_exame_imagem:
            log.form.aproveitamento_cotas_exame_imagem,
          taxa_perda_primaria_upae: log.form.taxa_perda_primaria_upae,
          taxa_absenteismo: log.form.taxa_absenteismo,
          cumprimento_pes_quadrimestre: log.form.cumprimento_pes_quadrimestre,
          cumprimento_pes_exercicio: log.form.cumprimento_pes_exercicio,
          indice_qualificacao_acoes_vigilancia:
            log.form.indice_qualificacao_acoes_vigilancia,
          aproveitamento_cotas_consultas_especializadas:
            log.form.aproveitamento_cotas_consultas_especializadas,
          municipios_instrumentos_gestao_sus_atualizados:
            log.form.municipios_instrumentos_gestao_sus_atualizados,
          implementacao_planejamento_estrategico:
            log.form.implementacao_planejamento_estrategico,
          engajamento_gestores_reunioes_grupos_condutores_macrorregionais:
            log.form
              .engajamento_gestores_reunioes_grupos_condutores_macrorregionais,
          integracao_grupos_condutores_rede_pri:
            log.form.integracao_grupos_condutores_rede_pri,
          participacao_gestores_reunioes_camara_tecnica_ct_cir:
            log.form.participacao_gestores_reunioes_camara_tecnica_ct_cir,
          participacao_gestores_reunioes_cir:
            log.form.participacao_gestores_reunioes_cir,
          dataInicio: log.form.dataInicio,
          dataFinal: log.form.dataFinal,
          createdAt: log.form.createdAt,
        });
      });

      reply.header(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      reply.header("Content-Disposition", "attachment; filename=logs.xlsx");

      const buffer = await workbook.xlsx.writeBuffer();
      reply.send(buffer);
    } catch (error) {
      console.error("Error generating Excel file", error);
      reply.status(500).send("Error generating Excel file");
    }
  });

  fastify.get("/health", (request, reply) => {
    reply.status(200).send("OK");
  });
}
