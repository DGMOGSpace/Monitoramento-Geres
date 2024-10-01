import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const indicatorsMap: { [key: string]: string } = {
  "% DE EXECUÇÃO DO ORÇAMENTO POR REGIONAL":
    "execucao_do_orcamento_por_regional",
  "TAXA DE SATISFAÇÃO DOS MUNICÍPIOS EM RELAÇÃO AO APOIO DAS GERES":
    "taxa_de_satisfacao_municipios_apoio_geres",
  "% DE RESOLUÇÃO DAS AÇÕES DE COMPETÊNCIAS DA GERES":
    "resolucao_acoes_competencias_geres",
  "% DE MUNICÍPIOS VISITADOS": "municipios_visitados",
  "% DE APROVEITAMENTO DAS COTAS DE EXAME DE IMAGEM (TOMOGRAFIA E RM)":
    "aproveitamento_cotas_exame_imagem",
  "TAXA DE PERDA PRIMÁRIA UPAE": "taxa_perda_primaria_upae",
  "TAXA DE ABSENTEÍSMO": "taxa_absenteismo",
  "% DE CUMPRIMENTO DO PES POR QUADRIMESTRE": "cumprimento_pes_quadrimestre",
  "% DE CUMPRIMENTO DO PES NO EXERCÍCIO": "cumprimento_pes_exercicio",
  "ÍNDICE DE QUALIFICAÇÃO DAS AÇÕES DE VIGILÂNCIA":
    "indice_qualificacao_acoes_vigilancia",
  "% DE APROVEITAMENTO DAS COTAS DE CONSULTAS ESPECIALIZADAS":
    "aproveitamento_cotas_consultas_especializadas",
  "% DOS MUNICÍPIOS COM OS INSTRUMENTOS DE GESTÃO DO SUS ATUALIZADOS":
    "municipios_instrumentos_gestao_sus_atualizados",
  "% DE IMPLEMENTAÇÃO DO PLANEJAMENTO ESTRATÉGICO":
    "implementacao_planejamento_estrategico",
  "% ENGAJAMENTO DOS GESTORES NAS REUNIÕES DOS GRUPOS CONDUTORES MACRORREGIONAIS":
    "engajamento_gestores_reunioes_grupos_condutores_macrorregionais",
  "% DE INTEGRAÇÃO ENTRE GRUPOS CONDUTORES DE REDE E O PRI":
    "integracao_grupos_condutores_rede_pri",
  "% PARTICIPAÇÃO DOS GESTORES NAS REUNIÕES DE CÂMARA TÉCNICA/CT CIR":
    "participacao_gestores_reunioes_camara_tecnica_ct_cir",
  "% PARTICIPAÇÃO DOS GESTORES NAS REUNIÕES DE CIR":
    "participacao_gestores_reunioes_cir",
};

export function ConvertFormLabel(
  textToConvert: string,
  dict: { [key: string]: string }
): string {
  return dict[textToConvert] || textToConvert; // Retorna o valor ou o texto original
}

export default async function formRoutes(fastify: FastifyInstance) {
  fastify.post("/addData", async (request, reply) => {
    const { data, userId, values } = request.body as {
      data: string;
      userId: number;
      values: { indicador: string; valor: string | number }[];
    };

    console.log(data, userId, values);

    if (!data || !userId || !Array.isArray(values)) {
      return reply.status(400).send({ message: "Dados inválidos." });
    }

    const dataFormValues: { [key: string]: number | null | string } = {
      dataRef: data,
      execucao_do_orcamento_por_regional: null,
      taxa_de_satisfacao_municipios_apoio_geres: null,
      resolucao_acoes_competencias_geres: null,
      municipios_visitados: null,
      aproveitamento_cotas_exame_imagem: null,
      taxa_perda_primaria_upae: null,
      taxa_absenteismo: null,
      cumprimento_pes_quadrimestre: null,
      cumprimento_pes_exercicio: null,
      indice_qualificacao_acoes_vigilancia: null,
      aproveitamento_cotas_consultas_especializadas: null,
      municipios_instrumentos_gestao_sus_atualizados: null,
      implementacao_planejamento_estrategico: null,
      engajamento_gestores_reunioes_grupos_condutores_macrorregionais: null,
      integracao_grupos_condutores_rede_pri: null,
      participacao_gestores_reunioes_camara_tecnica_ct_cir: null,
      participacao_gestores_reunioes_cir: null,
    };

    for (const item of values) {
      const { indicador, valor } = item;
      const convertedIndicator = ConvertFormLabel(indicador, indicatorsMap);
      console.log(convertedIndicator);

      const floatValue = parseFloat(valor.toString());

      if (isNaN(floatValue)) {
        console.error("Valor inválido para conversão:", valor);
        return reply
          .status(400)
          .send({ message: "Valor inválido para o indicador." });
      }

      dataFormValues[convertedIndicator] = floatValue;
    }

    let dataFormId: number;

    try {
      const existingDataForm = await prisma.dataForm.findFirst({
        where: {
          idUser: userId,
          dataRef: data,
        },
      });

      if (existingDataForm) {
        dataFormId = existingDataForm.id;
        await prisma.dataForm.update({
          where: { id: existingDataForm.id },
          data: {
            dataRef: data,
            user: {
              connect: { id: userId },
            },
            ...dataFormValues,
          },
        });
      } else {
        const newDataForm = await prisma.dataForm.create({
          data: {
            dataRef: data,
            user: {
              connect: { id: userId },
            },
            ...dataFormValues,
          },
        });
        dataFormId = newDataForm.id;
      }

      await prisma.log.create({
        data: {
          idUser: userId,
          idForm: dataFormId,
        },
      });
    } catch (error) {
      console.error("Erro ao inserir/atualizar DataForm:", error);
      return reply
        .status(500)
        .send({ message: "Erro ao inserir/atualizar DataForm." });
    }
    return reply.status(201).send({ message: "Dados enviados com sucesso." });
  });
}
