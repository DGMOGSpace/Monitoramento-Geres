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
  "TAXA DE SATISFAÇÃO DOS MUNICÍPIOS EM RELAÇÃO AO APOIO DAS GERES": "taxaSatisfacaoMunicipiosApoioGeres",
  "% DE RESOLUÇÃO DAS AÇÕES DE COMPETÊNCIAS DA GERES": "percentualResolucaoAcoesCompetenciasGeres",
  "% DE MUNICÍPIOS VISITADOS": "percentualMunicipiosVisitados",
  "NÚMERO DE MUNICÍPIOS QUE ATINGIRAM A COBERTURA VACINAL EM MENORES DE 2 ANOS": "numeroMunicipiosCoberturaVacinalMenores2Anos",
  "% DE MUNICÍPIOS QUE ENVIARAM DADOS PARA A RNDS": "percentualMunicipiosEnviaramDadosRNDS",
  "% DE CUMPRIMENTO DO PES NO EXERCÍCIO": "percentualCumprimentoPesExercicio",
  "% DE ÁREAS TÉCNICAS COM SALAS DE SITUAÇÃO INSTITUIDAS": "percentualAreasTecnicasComSalasSituacaoInstituidas",
  "% DAS AÇÕES DE REGIONALIZAÇÃO DESENVOLVIDAS PELA GERES NO TERRITÓRIO": "percentualAcoesRegionalizacaoDesenvolvidasGeres",
  "% DE VINCULAÇÃO DA GESTANTE AO SERVIÇO DE REFERÊNCIA AO PARTO": "percentualVinculacaoGestanteServicoReferenciaParto",
  "% DE ÓBITOS INFANTIS E FETAIS INVESTIGADOS EM TEMPO OPORTUNO.": "percentualObitosInfantisFetaisInvestigados",
  "% DE REDUÇÃO DE FILA DE CONSULTAS": "percentualReducaoFilaConsultas",
  "% DE REDUÇÃO DE FILA DE EXAMES DE IMAGE": "percentualReducaoFilaExamesImagem",
  "% DE INVESTIGAÇÃO EPIDEMIOLÓGICA DOS ÓBITOS POR ACIDENTE DE TRABALHO": "percentualInvestigacaoEpidemiologicaObitosAcidenteTrabalho",
  "% DE APROVEITAMENTO DAS COTAS DE EXAME DE IMAGEM (TOMOGRAFIA E RM)": "percentualAproveitamentoCotasExameImagem",
  "% DE INTERNAÇÃO POR CAUSAS SENSÍVEIS A APS": "percentualInternacaoCausasSensiveisAPS",
  "% DE ABSENTEISMO DE CONSULTAS E EXAMES": "percentualAbsenteismoConsultasExames",
  "% DE PERDA PRIMÁRIA DE COTAS DE CONSULTAS E EXAMES": "percentualPerdaPrimariaCotasConsultasExames",
  "% DE PACIENTES COM RETORNO GARANTIDO NO SERVIÇO DAS UPAES": "percentualPacientesRetornoGarantidoUPAEs",
  "% DE GESTANTES DE ALTO RISCO ACOMPANHADAS ADEQUADAMENTE": "percentualGestantesAltoRiscoAcompanhadasAdequadamente",
  "TAXA DE MORTALIDADE MATERNA": "taxaMortalidadeMaterna",
  "TAXA DE MORTALIDADE INFANTIL": "taxaMortalidadeInfantil",
  "% DE RESOLUÇÃO DAS AÇÕES DE COMPETÊNCIAS DA GERES NO PROGRAMA GERES PERCORRE": "percentualResolucaoAcoesCompetenciasGeresProgramaGeresPercorre",
  "TAXA DE MORTALIDADE POR CAUSAS EVITÁVEIS": "taxaMortalidadeCausasEvitaveis",
  "PROPORÇÃO DE NASCIDOS VIVOS DE MÃES COM 7 OU MAIS CONSULTAS DE PRÉ-NATAL": "proporcaoNascidosVivosMães7ConsultasPrenatal",
  "TAXA DE MORTALIDADE POR ACIDENTES DE TRANSPORTE TERRESTRE": "taxaMortalidadeAcidentesTransporteTerrestre",
  "% DE MORTALIDADE NÃO HOSPITALAR POR DCNT": "percentualMortalidadeNaoHospitalarDCNT",
  "% DE MORTALIDADE NÃO HOSPITALAR NA INFÂNCIA": "percentualMortalidadeNaoHospitalarInfancia",
  "% DE MORTALIDADE NÃO HOSPITALAR MATERNA": "percentualMortalidadeNaoHospitalarMaterna",
  "% DE COBERTURA VACINAL POR REGIONAL": "percentualCoberturaVacinalPorRegional",
  "% DE MORTES À ESCLARECER POR REGIONAL": "percentualMortesEsclarecerPorRegional",
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
    // 5. Validação de tipos com Zod
    const validationResult = createDataFormSchema.safeParse(request.body);
    if (!validationResult.success) {
      return reply.status(400).send({
        message: "Dados inválidos",
        errors: validationResult.error.errors
      });
    }

    const { startDate, endDate, userId, values } = validationResult.data;

    // 6. Validação adicional de datas
    if (new Date(startDate) >= new Date(endDate)) {
      return reply.status(400).send({
        message: "Data final deve ser posterior à data inicial"
      });
    }

    try {
      // 7. Usar transação do Prisma
      return await prisma.$transaction(async (tx) => {
        const dataFormValues: Record<string, number | null> = {};

        // 8. Processamento seguro dos valores
        const parseValue = (valor: string | number): number | null => {
          const num = Number(valor);
          return Number.isFinite(num) ? num : null;
        };

        // 9. Validação de indicadores
        for (const item of values) {
          const convertedIndicator = convertFormLabel(item.indicador, indicatorsMap);
          if (!convertedIndicator) {
            throw new Error(`Indicador inválido: ${item.indicador}`);
          }
          dataFormValues[convertedIndicator] = parseValue(item.valor);
        }

        // 10. Atualização/Inserção com verificação completa
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