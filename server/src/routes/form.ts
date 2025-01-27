import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const indicatorsMap: { [key: string]: string } = {
  "% de áreas técnicas com salas de situação instituídas":
  "percentualAreasTecnicasComSalasDeSituacaoInstituidas",
  "% das ações de regionalização desenvolvidas pela GERES no território":
  "percentualAcoesRegionalizacaoDesenvolvidasPelaGERES",
  "% de vinculação da gestante ao serviço de referência ao parto":
  "percentualVinculacaoGestanteAoServicoReferencia",
  "% de óbitos infantis e fetais investigados em tempo oportuno":
  "percentualObitosInvestigadosEmTempoOportuno",
  "número de municípios que atingiram a cobertura vacinal em menores de 2 anos":
  "numeroMunicipiosCoberturaVacinalMenores2Anos",
  "% de internação por causas sensíveis à APS":
  "percentualInternacaoPorCausasSensiveisAPS",
  "% de perda primária de cotas de consultas e exames":
  "percentualPerdaPrimariaCotasConsultasExames",
  "% de absenteísmo de consultas e exames":
  "percentualAbsenteismoConsultasExames",
  "Taxa de mortalidade materna":
  "taxaMortalidadeMaterna",
  "Taxa de mortalidade infantil":
  "taxaMortalidadeInfantil",
  "% de gestantes de alto risco acompanhadas adequadamente":
  "percentualGestantesAltoRiscoAcompanhadas",
  "% de pacientes com retorno garantido no serviço das UPAEs":
  "percentualPacientesRetornoGarantidoUPAEs",
  "% de municípios que enviaram dados para a RNDS":
  "percentualMunicipiosEnviaramDadosRNDS",
  "% de cumprimento do PES no exercício":
  "percentualCumprimentoPESNoExercicio",
  "taxa de satisfação dos municípios em relação ao apoio das GERES":
  "taxaSatisfacaoMunicipiosApoioGERES",
  "% de resolução das ações de competências da GERES no Programa GERES PERCORRE":
  "percentualResolucaoAcoesCompetenciasGERES",
  "Taxa de mortalidade por causas evitáveis":
  "taxaMortalidadePorCausasEvitaeis",
  "Proporção de nascidos vivos de mães com 7 ou mais consultas de pré-natal":
  "proporcaoNascidosVivosMae7OuMaisConsultasPreNatal",
  "taxa de mortalidade por acidentes de transporte terrestre":
  "taxaMortalidadeAcidentesTransporteTerrestre",
  "% de redução de fila de consultas":
  "percentualReducaoFilaConsultas",
  "% de aproveitamento das cotas de exame de imagem (tomografia e RM)":
  "percentualAproveitamentoCotasExamesImagem",
  "% de investigação epidemiológica dos óbitos por acidente de trabalho":
  "percentualInvestigacaoEpidemiologicaObitosAcidenteTrabalho",
  "% de redução de fila de exames de imagem":
  "percentualReducaoFilaExamesImagem",
  "% de mortalidade não hospitalar por DCNT":
  "percentualMortalidadeNaoHospitalarDCNT",
  "% de mortalidade não hospitalar na infância":
  "percentualMortalidadeNaoHospitalarInfancia",
  "% de mortalidade não hospitalar materna":
  "percentualMortalidadeNaoHospitalarMaterna",
  "% de cobertura vacinal por regional":
  "percentualCoberturaVacinalPorRegional",
  "% de mortes à esclarecer por regional":
  "percentualMortesAEsclarecerPorRegional",
  "% de fila de espera por regional":
  "percentualFilaEsperaPorRegional"
};


export function ConvertFormLabel(
  textToConvert: string,
  dict: { [key: string]: string }
): string {
  return dict[textToConvert] || textToConvert; // Retorna o valor ou o texto original
}

export default async function formRoutes(fastify: FastifyInstance) {
  fastify.post("/addData", async (request, reply) => {
    const { startDate, endDate, userId, values } = request.body as {
      startDate: string;
      endDate: string;
      userId: number;
      values: { indicador: string; valor: string | number }[];
    };

    // Validações de entrada
    if (!startDate || !endDate || !userId || !Array.isArray(values)) {
      return reply.status(400).send({ message: "Dados inválidos." });
    }

    const dataFormValues: { [key: string]: number | null } = {
      // inicializa valores...
    };

    const parseValue = (valor: string | number) => {
      const floatValue = parseFloat(valor.toString());
      return isNaN(floatValue) ? null : floatValue;
    };

    try {
      for (const item of values) {
        const { indicador, valor } = item;
        const convertedIndicator = ConvertFormLabel(indicador, indicatorsMap);
        dataFormValues[convertedIndicator] = parseValue(valor);
      }

      let dataFormId: number;

      const existingDataForm = await prisma.dataForm.findFirst({
        where: {
          idUser: userId,
          dataInicio: startDate
         
        },
      });

      if (existingDataForm) {
        dataFormId = existingDataForm.id;
        await prisma.dataForm.update({
          where: { id: dataFormId },
          data: {
            dataInicio: startDate,
            dataFinal: endDate,
            user: {
              connect: { id: userId },
            },
            ...dataFormValues,
          },
        });
      } else {
        const newDataForm = await prisma.dataForm.create({
          data: {
            dataInicio: startDate, // Utilize as variáveis corretas
            dataFinal: endDate,
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

      return reply.status(201).send({ message: "Dados enviados com sucesso." });
    } catch (error) {
      console.error("Erro ao inserir/atualizar DataForm:", error);
      return reply
        .status(500)
        .send({
          message:
            error instanceof Error
              ? error.message
              : "Erro ao inserir/atualizar DataForm.",
        });
    }
  });
}
