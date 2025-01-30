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
      
        { header: "% de ações financeiras executadas em tempo hábil (60 dias)", key: "percentualAcoesFinanceirasExecutadas", width: 20 },
        { header: "% de áreas técnicas com salas de situação instituídas", key: "percentualAreasTecnicasComSalasSituacaoInstituidas", width: 20 },
        { header: "% de ações de regionalização desenvolvidas pela GERES", key: "percentualAcoesRegionalizacaoDesenvolvidasGeres", width: 20 },
        { header: "% de vinculação da gestante ao serviço de referência ao parto", key: "percentualVinculacaoGestanteServicoReferenciaParto", width: 20 },
        { header: "% de óbitos infantis e fetais investigados em tempo oportuno", key: "percentualObitosInfantisFetaisInvestigados", width: 20 },
        { header: "Número de municípios com cobertura vacinal em menores de 2 anos", key: "numeroMunicipiosCoberturaVacinalMenores2Anos", width: 20 },
        { header: "% de internação por causas sensíveis à APS", key: "percentualInternacaoCausasSensiveisAPS", width: 20 },
        { header: "% de perda primária de cotas de consultas e exames", key: "percentualPerdaPrimariaCotasConsultasExames", width: 20 },
        { header: "% de absenteísmo de consultas e exames", key: "percentualAbsenteismoConsultasExames", width: 20 },
        { header: "Taxa de mortalidade materna", key: "taxaMortalidadeMaterna", width: 20 },
        { header: "Taxa de mortalidade infantil", key: "taxaMortalidadeInfantil", width: 20 },
        { header: "% de gestantes de alto risco acompanhadas adequadamente", key: "percentualGestantesAltoRiscoAcompanhadasAdequadamente", width: 20 },
        { header: "% de pacientes com retorno garantido no serviço das UPAEs", key: "percentualPacientesRetornoGarantidoUPAEs", width: 20 },
        { header: "% de municípios que enviaram dados para a RNDS", key: "percentualMunicipiosEnviaramDadosRNDS", width: 20 },
        { header: "% de cumprimento do PES no exercício", key: "percentualCumprimentoPesExercicio", width: 20 },
        { header: "Taxa de satisfação dos municípios em relação ao apoio das GERES", key: "taxaSatisfacaoMunicipiosApoioGeres", width: 20 },
        { header: "% de resolução das ações de competências da GERES no Programa GERES PERCORRE", key: "percentualResolucaoAcoesCompetenciasGeresProgramaGeresPercorre", width: 20 },
        { header: "Taxa de mortalidade por causas evitáveis", key: "taxaMortalidadeCausasEvitaveis", width: 20 },
        { header: "Proporção de nascidos vivos de mães com 7 ou mais consultas de pré-natal", key: "proporcaoNascidosVivosMaes7ConsultasPrenatal", width: 20 },
        { header: "Taxa de mortalidade por acidentes de transporte terrestre", key: "taxaMortalidadeAcidentesTransporteTerrestre", width: 20 },
        { header: "% de redução de fila de consultas", key: "percentualReducaoFilaConsultas", width: 20 },
        { header: "% de aproveitamento das cotas de exame de imagem (tomografia e RM)", key: "percentualAproveitamentoCotasExameImagem", width: 20 },
        { header: "% de investigação epidemiológica dos óbitos por acidente de trabalho", key: "percentualInvestigacaoEpidemiologicaObitosAcidenteTrabalho", width: 20 },
        { header: "% de redução de fila de exames de imagem", key: "percentualReducaoFilaExamesImagem", width: 20 },
        { header: "% de mortalidade não hospitalar por DCNT", key: "percentualMortalidadeNaoHospitalarDCNT", width: 20 },
        { header: "% de mortalidade não hospitalar na infância", key: "percentualMortalidadeNaoHospitalarInfancia", width: 20 },
        { header: "% de mortalidade não hospitalar materna", key: "percentualMortalidadeNaoHospitalarMaterna", width: 20 },
        { header: "% de cobertura vacinal por regional", key: "percentualCoberturaVacinalPorRegional", width: 20 },
        { header: "% de mortes a esclarecer por regional", key: "percentualMortesEsclarecerPorRegional", width: 20 },
        { header: "% de fila de espera por regional", key: "percentualFilaEsperaPorRegional", width: 20 },
        
      
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
          percentualAcoesFinanceirasExecutadas: log.form.percentualAcoesFinanceirasExecutadas, 
          percentualAreasTecnicasComSalasSituacaoInstituidas: log.form.percentualAreasTecnicasComSalasSituacaoInstituidas, 
          percentualAcoesRegionalizacaoDesenvolvidasGeres: log.form.percentualAcoesRegionalizacaoDesenvolvidasGeres, 
          percentualVinculacaoGestanteServicoReferenciaParto: log.form.percentualVinculacaoGestanteServicoReferenciaParto, 
          percentualObitosInfantisFetaisInvestigados: log.form.percentualObitosInfantisFetaisInvestigados, 
          numeroMunicipiosCoberturaVacinalMenores2Anos: log.form.numeroMunicipiosCoberturaVacinalMenores2Anos, 
          percentualInternacaoCausasSensiveisAPS: log.form.percentualInternacaoCausasSensiveisAPS, 
          percentualPerdaPrimariaCotasConsultasExames: log.form.percentualPerdaPrimariaCotasConsultasExames, 
          percentualAbsenteismoConsultasExames: log.form.percentualAbsenteismoConsultasExames, 
          taxaMortalidadeMaterna: log.form.taxaMortalidadeMaterna, 
          taxaMortalidadeInfantil: log.form.taxaMortalidadeInfantil, 
          percentualGestantesAltoRiscoAcompanhadasAdequadamente: log.form.percentualGestantesAltoRiscoAcompanhadasAdequadamente, 
          percentualPacientesRetornoGarantidoUPAEs: log.form.percentualPacientesRetornoGarantidoUPAEs, 
          percentualMunicipiosEnviaramDadosRNDS: log.form.percentualMunicipiosEnviaramDadosRNDS, 
          percentualCumprimentoPesExercicio: log.form.percentualCumprimentoPesExercicio, 
          taxaSatisfacaoMunicipiosApoioGeres: log.form.taxaSatisfacaoMunicipiosApoioGeres, 
          percentualResolucaoAcoesCompetenciasGeresProgramaGeresPercorre: log.form.percentualResolucaoAcoesCompetenciasGeresProgramaGeresPercorre, 
          taxaMortalidadeCausasEvitaveis: log.form.taxaMortalidadeCausasEvitaveis, 
          proporcaoNascidosVivosMaes7ConsultasPrenatal: log.form.proporcaoNascidosVivosMaes7ConsultasPrenatal, 
          taxaMortalidadeAcidentesTransporteTerrestre: log.form.taxaMortalidadeAcidentesTransporteTerrestre, 
          percentualReducaoFilaConsultas: log.form.percentualReducaoFilaConsultas, 
          percentualAproveitamentoCotasExameImagem: log.form.percentualAproveitamentoCotasExameImagem, 
          percentualInvestigacaoEpidemiologicaObitosAcidenteTrabalho: log.form.percentualInvestigacaoEpidemiologicaObitosAcidenteTrabalho, 
          percentualReducaoFilaExamesImagem: log.form.percentualReducaoFilaExamesImagem, 
          percentualMortalidadeNaoHospitalarDCNT: log.form.percentualMortalidadeNaoHospitalarDCNT, 
          percentualMortalidadeNaoHospitalarInfancia: log.form.percentualMortalidadeNaoHospitalarInfancia, 
          percentualMortalidadeNaoHospitalarMaterna: log.form.percentualMortalidadeNaoHospitalarMaterna, 
          percentualCoberturaVacinalPorRegional: log.form.percentualCoberturaVacinalPorRegional, 
          percentualMortesEsclarecerPorRegional: log.form.percentualMortesEsclarecerPorRegional, 
          percentualFilaEsperaPorRegional: log.form.percentualFilaEsperaPorRegional, 

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
