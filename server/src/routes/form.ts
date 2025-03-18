import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import z from "zod";
const prisma = new PrismaClient();

const createDataFormSchema = z.object({
  startDate: z.string() ,
  endDate: z.string(),
  userId: z.number().int().positive(),
  values: z.array(z.object({
    indicador: z.string(),
    valor: z.union([z.string(), z.number()])
  }))
});

const indicatorsMap: { [key: string]: string } = {
  "% DE AÇÕES FINANCEIRAS EXECUTADAS EM TEMPO HÁBIL (60 DIAS)": "percentualAcoesFinanceirasExecutadas",
  "% DE ÁREAS TÉCNICAS COM SALAS DE SITUAÇÃO INSTITUÍDAS": "percentualAreasTecnicasComSalasSituacaoInstituidas",
  "% DAS AÇÕES DE REGIONALIZAÇÃO DESENVOLVIDAS PELA GERES NO TERRITÓRIO": "percentualAcoesRegionalizacaoDesenvolvidasGeres",
  "% DE VINCULAÇÃO DA GESTANTE AO SERVIÇO DE REFERÊNCIA AO PARTO": "percentualVinculacaoGestanteServicoReferenciaParto",
  "% DE ÓBITOS INFANTIS E FETAIS INVESTIGADOS EM TEMPO OPORTUNO.": "percentualObitosInfantisFetaisInvestigados",
  "NÚMERO DE MUNICÍPIOS QUE ATINGIRAM A COBERTURA VACINAL EM MENORES DE 2 ANOS": "numeroMunicipiosCoberturaVacinalMenores2Anos",
  "% DE INTERNAÇÃO POR CAUSAS SENSÍVEIS A APS": "percentualInternacaoCausasSensiveisAPS",
  "% DE PERDA PRIMÁRIA DE COTAS DE CONSULTAS E EXAMES": "percentualPerdaPrimariaCotasConsultasExames",
  "% DE ABSENTEÍSMO DE CONSULTAS E EXAMES": "percentualAbsenteismoConsultasExames",
  "TAXA DE MORTALIDADE MATERNA": "taxaMortalidadeMaterna",
  "TAXA DE MORTALIDADE INFANTIL": "taxaMortalidadeInfantil",
  "% DE GESTANTES DE ALTO RISCO ACOMPANHADAS ADEQUADAMENTE": "percentualGestantesAltoRiscoAcompanhadasAdequadamente",
  "% DE PACIENTES COM RETORNO GARANTIDO NO SERVIÇO DAS UPAES": "percentualPacientesRetornoGarantidoUPAEs",
  "% DE MUNICÍPIOS QUE ENVIARAM DADOS PARA A RNDS": "percentualMunicipiosEnviaramDadosRNDS",
  "% DE CUMPRIMENTO DO PES NO EXERCÍCIO": "percentualCumprimentoPESNoExercicio",
  "TAXA DE SATISFAÇÃO DOS MUNICÍPIOS EM RELAÇÃO AO APOIO DAS GERES": "taxaSatisfacaoMunicipiosApoioGERES",
  "% DE RESOLUÇÃO DAS AÇÕES DE COMPETÊNCIAS DA GERES NO PROGRAMA GERES PERCORRE": "percentualResolucaoAcoesCompetenciasGERES",
  "TAXA DE MORTALIDADE POR CAUSAS EVITÁVEIS": "taxaMortalidadePorCausasEvitaveis",
  "PROPORÇÃO DE NASCIDOS VIVOS DE MÃES COM 7 OU MAIS CONSULTAS DE PRÉ-NATAL": "proporcaoNascidosVivosMae7OuMaisConsultasPreNatal",
  "TAXA DE MORTALIDADE POR ACIDENTES DE TRANSPORTE TERRESTRE": "taxaMortalidadeAcidentesTransporteTerrestre",
  "% DE REDUÇÃO DE FILA DE CONSULTAS": "percentualReducaoFilaConsultas",
  "% DE APROVEITAMENTO DAS COTAS DE EXAME DE IMAGEM (TOMOGRAFIA E RM)": "percentualAproveitamentoCotasExamesImagem",
  "% DE INVESTIGAÇÃO EPIDEMIOLÓGICA DOS ÓBITOS POR ACIDENTE DE TRABALHO": "percentualInvestigacaoEpidemiologicaObitosAcidenteTrabalho",
  "% DE REDUÇÃO DE FILA DE EXAMES DE IMAGEM": "percentualReducaoFilaExamesImagem",
  "% DE MORTALIDADE NÃO HOSPITALAR POR DCNT": "percentualMortalidadeNaoHospitalarDCNT",
  "% DE MORTALIDADE NÃO HOSPITALAR NA INFÂNCIA": "percentualMortalidadeNaoHospitalarInfancia",
  "% DE MORTALIDADE NÃO HOSPITALAR MATERNA": "percentualMortalidadeNaoHospitalarMaterna",
  "% DE COBERTURA VACINAL POR REGIONAL": "percentualCoberturaVacinalPorRegional",
  "% DE MORTES À ESCLARECER POR REGIONAL": "percentualMortesAEsclarecerPorRegional",
  "% DE FILA DE ESPERA POR REGIONAL": "percentualFilaEsperaPorRegional"
};


export function convertFormLabel(
  textToConvert: string,
  dict: typeof indicatorsMap
): keyof typeof indicatorsMap | null {
  const key = Object.keys(dict).find(k => k === textToConvert.trim());
  return key ? dict[key as keyof typeof indicatorsMap] : null;
}
export default async function formRoutes(fastify: FastifyInstance) {
  fastify.post("/addData", async (request, reply) => {
    const validationResult = createDataFormSchema.safeParse(request.body);
    if (!validationResult.success) {
      return reply.status(400).send({
        message: "Dados inválidos",
        errors: validationResult.error.errors
      });
    }

    const { startDate, endDate, userId, values } = validationResult.data;

    if (new Date(startDate) >= new Date(endDate)) {
      return reply.status(400).send({
        message: "Data final deve ser posterior à data inicial"
      });
    }

    try {
      return await prisma.$transaction(async (tx) => {
        const dataFormValues: Record<string, number | null> = {};

        const parseValue = (valor: string | number): number | null => {
          const num = Number(valor);
          return Number.isFinite(num) ? num : null;
        };

        for (const item of values) {
          const convertedIndicator = convertFormLabel(item.indicador, indicatorsMap);
          if (!convertedIndicator) {
            throw new Error(`Indicador inválido: ${item.indicador}`);
          }
          dataFormValues[convertedIndicator] = parseValue(item.valor);
        }

        const existingDataForm = await tx.dataForm.findFirst({
          where: {
            idUser: userId,
            dataInicio: startDate,
            dataFinal: endDate
          },
          select: { id: true }
        });

        let dataFormOperation;
        if (existingDataForm) {
          dataFormOperation = tx.dataForm.update({
            where: { id: existingDataForm.id },
            data: { ...dataFormValues }
          });
        } else {
          dataFormOperation = tx.dataForm.create({
            data: {
              dataInicio: startDate,
              dataFinal: endDate,
              idUser: userId,
              ...dataFormValues
            }
          });
        }

      const dataForm = await dataFormOperation;
        await tx.log.create({
          data: {
            idUser: userId,
            idForm: dataForm.id,  
          }
        });

        return reply.status(201).send({
          message: "Dados processados com sucesso",
          dataFormId: dataForm.id
        });
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      console.error(`Erro: ${errorMessage}`, error);
      
      return reply.status(500).send({
        message: "Erro no processamento dos dados",
        error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      });
    }
  });
}