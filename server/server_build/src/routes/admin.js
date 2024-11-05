"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = adminRoutes;
const client_1 = require("@prisma/client");
const crypto_1 = __importDefault(require("crypto"));
const sendMail_1 = require("../services/sendMail");
const nodemailer_1 = __importDefault(require("nodemailer"));
const exceljs_1 = __importDefault(require("exceljs"));
require("dotenv").config();
const prisma = new client_1.PrismaClient();
function adminRoutes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.post("/users", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { fullName, geres, cargo, setor, admin, email } = request.body;
            try {
                // Verifica se o usuário já existe com o email fornecido
                const existingUser = yield prisma.user.findUnique({
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
                const password = crypto_1.default.randomBytes(12).toString("hex");
                const user = yield prisma.user.create({
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
                yield (0, sendMail_1.sendEmail)(email, password); // Aguarda o envio do email
                return reply.status(201).send(user);
            }
            catch (error) {
                console.error("Erro ao criar usuário:", error);
                return reply.status(500).send({ message: "Erro ao criar usuário" });
            }
        }));
        fastify.get("/users", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield prisma.user.findMany({
                    include: {
                        logs: true,
                        dataForms: true,
                    },
                });
                return reply.send(users);
            }
            catch (error) {
                console.error("Erro ao buscar usuários:", error);
                return reply.status(500).send({ message: "Erro ao buscar usuários" });
            }
        }));
        fastify.put("/users/:id", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            const { fullName, password, geres, admin, email } = request.body;
            try {
                const user = yield prisma.user.update({
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
            }
            catch (error) {
                console.error("Erro ao atualizar usuário:", error);
                return reply.status(500).send({ message: "Erro ao atualizar usuário" });
            }
        }));
        fastify.put("/removeUsers/:id", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            try {
                yield prisma.user.update({
                    where: { id },
                    data: { active: false },
                });
                return reply.status(204).send(); // No Content
            }
            catch (error) {
                console.error("Erro ao deletar usuário:", error);
                return reply.status(500).send({ message: "Erro ao deletar usuário" });
            }
        }));
        fastify.get("/logs", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const logs = yield prisma.log.findMany({
                    include: {
                        user: true,
                        form: true,
                    },
                });
                console.log(logs);
                return reply.send(logs);
            }
            catch (error) {
                console.error("Erro ao buscar logs:", error);
                return reply.status(500).send({ message: "Erro ao buscar logs" });
            }
        }));
        fastify.get("/dataForms", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const dataForms = yield prisma.dataForm.findMany({
                    include: {
                        user: true,
                    },
                });
                return reply.send(dataForms);
            }
            catch (error) {
                console.error("Erro ao buscar dataForms:", error);
                return reply.status(500).send({ message: "Erro ao buscar dataForms" });
            }
        }));
        fastify.get("/geres-data", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const geres = yield prisma.$queryRaw `SELECT 
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
            }
            catch (error) {
                console.error("Erro ao buscar dados da GERES:", error);
                reply.status(500).send({ error: "Erro ao buscar dados." });
            }
        }));
        fastify.post("/send-alert", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { geres } = request.body;
            try {
                const users = yield prisma.user.findMany({
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
                const transporter = nodemailer_1.default.createTransport({
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
                yield transporter.sendMail(mailOptions);
                reply.status(200).send({ message: "Alerta enviado com sucesso!" });
            }
            catch (error) {
                console.error("Erro ao enviar alerta:", error);
                reply.status(500).send({ error: "Erro ao enviar alerta" });
            }
        }));
        fastify.get("/download_excel", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield prisma.log.findMany({
                    include: {
                        user: true,
                        form: true,
                    },
                });
                const workbook = new exceljs_1.default.Workbook();
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
                        header: "Engajamento Gestores Reuniões Grupos Condutores Macrorregionais",
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
                // Preenche a planilha com os dados
                data.forEach((log) => {
                    worksheet.addRow({
                        logId: log.id,
                        userName: log.user.fullName,
                        userEmail: log.user.email,
                        userCargo: log.user.cargo,
                        geres: log.user.geres,
                        formId: log.form.id,
                        execucao_do_orcamento_por_regional: log.form.execucao_do_orcamento_por_regional,
                        taxa_de_satisfacao_municipios_apoio_geres: log.form.taxa_de_satisfacao_municipios_apoio_geres,
                        resolucao_acoes_competencias_geres: log.form.resolucao_acoes_competencias_geres,
                        municipios_visitados: log.form.municipios_visitados,
                        aproveitamento_cotas_exame_imagem: log.form.aproveitamento_cotas_exame_imagem,
                        taxa_perda_primaria_upae: log.form.taxa_perda_primaria_upae,
                        taxa_absenteismo: log.form.taxa_absenteismo,
                        cumprimento_pes_quadrimestre: log.form.cumprimento_pes_quadrimestre,
                        cumprimento_pes_exercicio: log.form.cumprimento_pes_exercicio,
                        indice_qualificacao_acoes_vigilancia: log.form.indice_qualificacao_acoes_vigilancia,
                        aproveitamento_cotas_consultas_especializadas: log.form.aproveitamento_cotas_consultas_especializadas,
                        municipios_instrumentos_gestao_sus_atualizados: log.form.municipios_instrumentos_gestao_sus_atualizados,
                        implementacao_planejamento_estrategico: log.form.implementacao_planejamento_estrategico,
                        engajamento_gestores_reunioes_grupos_condutores_macrorregionais: log.form
                            .engajamento_gestores_reunioes_grupos_condutores_macrorregionais,
                        integracao_grupos_condutores_rede_pri: log.form.integracao_grupos_condutores_rede_pri,
                        participacao_gestores_reunioes_camara_tecnica_ct_cir: log.form.participacao_gestores_reunioes_camara_tecnica_ct_cir,
                        participacao_gestores_reunioes_cir: log.form.participacao_gestores_reunioes_cir,
                        dataInicio: log.form.dataInicio,
                        dataFinal: log.form.dataFinal,
                        createdAt: log.form.createdAt,
                    });
                });
                // Define o tipo de resposta para Excel
                reply.header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                reply.header("Content-Disposition", "attachment; filename=logs.xlsx");
                // Gera o arquivo Excel e envia na resposta
                const buffer = yield workbook.xlsx.writeBuffer();
                reply.send(buffer);
            }
            catch (error) {
                console.error("Error generating Excel file", error);
                reply.status(500).send("Error generating Excel file");
            }
        }));
    });
}
