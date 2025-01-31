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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConvertFormLabel = ConvertFormLabel;
exports.default = formRoutes;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const indicatorsMap = {
    "% DE EXECUÇÃO DO ORÇAMENTO POR REGIONAL": "execucao_do_orcamento_por_regional",
    "TAXA DE SATISFAÇÃO DOS MUNICÍPIOS EM RELAÇÃO AO APOIO DAS GERES": "taxa_de_satisfacao_municipios_apoio_geres",
    "% DE RESOLUÇÃO DAS AÇÕES DE COMPETÊNCIAS DA GERES": "resolucao_acoes_competencias_geres",
    "% DE MUNICÍPIOS VISITADOS": "municipios_visitados",
    "% DE APROVEITAMENTO DAS COTAS DE EXAME DE IMAGEM (TOMOGRAFIA E RM)": "aproveitamento_cotas_exame_imagem",
    "TAXA DE PERDA PRIMÁRIA UPAE": "taxa_perda_primaria_upae",
    "TAXA DE ABSENTEÍSMO": "taxa_absenteismo",
    "% DE CUMPRIMENTO DO PES POR QUADRIMESTRE": "cumprimento_pes_quadrimestre",
    "% DE CUMPRIMENTO DO PES NO EXERCÍCIO": "cumprimento_pes_exercicio",
    "ÍNDICE DE QUALIFICAÇÃO DAS AÇÕES DE VIGILÂNCIA": "indice_qualificacao_acoes_vigilancia",
    "% DE APROVEITAMENTO DAS COTAS DE CONSULTAS ESPECIALIZADAS": "aproveitamento_cotas_consultas_especializadas",
    "% DOS MUNICÍPIOS COM OS INSTRUMENTOS DE GESTÃO DO SUS ATUALIZADOS": "municipios_instrumentos_gestao_sus_atualizados",
    "% DE IMPLEMENTAÇÃO DO PLANEJAMENTO ESTRATÉGICO": "implementacao_planejamento_estrategico",
    "% ENGAJAMENTO DOS GESTORES NAS REUNIÕES DOS GRUPOS CONDUTORES MACRORREGIONAIS": "engajamento_gestores_reunioes_grupos_condutores_macrorregionais",
    "% DE INTEGRAÇÃO ENTRE GRUPOS CONDUTORES DE REDE E O PRI": "integracao_grupos_condutores_rede_pri",
    "% PARTICIPAÇÃO DOS GESTORES NAS REUNIÕES DE CÂMARA TÉCNICA/CT CIR": "participacao_gestores_reunioes_camara_tecnica_ct_cir",
    "% PARTICIPAÇÃO DOS GESTORES NAS REUNIÕES DE CIR": "participacao_gestores_reunioes_cir",
};
function ConvertFormLabel(textToConvert, dict) {
    return dict[textToConvert] || textToConvert; // Retorna o valor ou o texto original
}
function formRoutes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.post("/addData", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { startDate, endDate, userId, values } = request.body;
            // Validações de entrada
            if (!startDate || !endDate || !userId || !Array.isArray(values)) {
                return reply.status(400).send({ message: "Dados inválidos." });
            }
            const dataFormValues = {
            // inicializa valores...
            };
            const parseValue = (valor) => {
                const floatValue = parseFloat(valor.toString());
                return isNaN(floatValue) ? null : floatValue; // Retorna null se o valor for inválido
            };
            try {
                for (const item of values) {
                    const { indicador, valor } = item;
                    const convertedIndicator = ConvertFormLabel(indicador, indicatorsMap);
                    dataFormValues[convertedIndicator] = parseValue(valor);
                }
                let dataFormId;
                const existingDataForm = yield prisma.dataForm.findFirst({
                    where: {
                        idUser: userId,
                        dataInicio: startDate
                    },
                });
                if (existingDataForm) {
                    dataFormId = existingDataForm.id;
                    yield prisma.dataForm.update({
                        where: { id: dataFormId },
                        data: Object.assign({ dataInicio: startDate, dataFinal: endDate, user: {
                                connect: { id: userId },
                            } }, dataFormValues),
                    });
                }
                else {
                    const newDataForm = yield prisma.dataForm.create({
                        data: Object.assign({ dataInicio: startDate, dataFinal: endDate, user: {
                                connect: { id: userId },
                            } }, dataFormValues),
                    });
                    dataFormId = newDataForm.id;
                }
                yield prisma.log.create({
                    data: {
                        idUser: userId,
                        idForm: dataFormId,
                    },
                });
                return reply.status(201).send({ message: "Dados enviados com sucesso." });
            }
            catch (error) {
                console.error("Erro ao inserir/atualizar DataForm:", error);
                return reply
                    .status(500)
                    .send({
                    message: error instanceof Error
                        ? error.message
                        : "Erro ao inserir/atualizar DataForm.",
                });
            }
        }));
    });
}
