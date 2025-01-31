/*
  Warnings:

  - You are about to drop the column `aproveitamento_cotas_consultas_especializadas` on the `DataForm` table. All the data in the column will be lost.
  - You are about to drop the column `aproveitamento_cotas_exame_imagem` on the `DataForm` table. All the data in the column will be lost.
  - You are about to drop the column `cumprimento_pes_exercicio` on the `DataForm` table. All the data in the column will be lost.
  - You are about to drop the column `cumprimento_pes_quadrimestre` on the `DataForm` table. All the data in the column will be lost.
  - You are about to drop the column `engajamento_gestores_reunioes_grupos_condutores_macrorregionais` on the `DataForm` table. All the data in the column will be lost.
  - You are about to drop the column `execucao_do_orcamento_por_regional` on the `DataForm` table. All the data in the column will be lost.
  - You are about to drop the column `implementacao_planejamento_estrategico` on the `DataForm` table. All the data in the column will be lost.
  - You are about to drop the column `indice_qualificacao_acoes_vigilancia` on the `DataForm` table. All the data in the column will be lost.
  - You are about to drop the column `integracao_grupos_condutores_rede_pri` on the `DataForm` table. All the data in the column will be lost.
  - You are about to drop the column `municipios_instrumentos_gestao_sus_atualizados` on the `DataForm` table. All the data in the column will be lost.
  - You are about to drop the column `municipios_visitados` on the `DataForm` table. All the data in the column will be lost.
  - You are about to drop the column `participacao_gestores_reunioes_camara_tecnica_ct_cir` on the `DataForm` table. All the data in the column will be lost.
  - You are about to drop the column `participacao_gestores_reunioes_cir` on the `DataForm` table. All the data in the column will be lost.
  - You are about to drop the column `resolucao_acoes_competencias_geres` on the `DataForm` table. All the data in the column will be lost.
  - You are about to drop the column `taxa_absenteismo` on the `DataForm` table. All the data in the column will be lost.
  - You are about to drop the column `taxa_de_satisfacao_municipios_apoio_geres` on the `DataForm` table. All the data in the column will be lost.
  - You are about to drop the column `taxa_perda_primaria_upae` on the `DataForm` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DataForm" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "idUser" INTEGER NOT NULL,
    "percentualAreasTecnicasComSalasDeSituacaoInstituidas" REAL,
    "percentualAcoesRegionalizacaoDesenvolvidasPelaGERES" REAL,
    "percentualVinculacaoGestanteAoServicoReferencia" REAL,
    "percentualObitosInvestigadosEmTempoOportuno" REAL,
    "numeroMunicipiosCoberturaVacinalMenores2Anos" INTEGER,
    "percentualInternacaoPorCausasSensiveisAPS" REAL,
    "percentualPerdaPrimariaCotasConsultasExames" REAL,
    "percentualAbsenteismoConsultasExames" REAL,
    "taxaMortalidadeMaterna" REAL,
    "taxaMortalidadeInfantil" REAL,
    "percentualGestantesAltoRiscoAcompanhadas" REAL,
    "percentualPacientesRetornoGarantidoUPAEs" REAL,
    "percentualMunicipiosEnviaramDadosRNDS" REAL,
    "percentualCumprimentoPESNoExercicio" REAL,
    "taxaSatisfacaoMunicipiosApoioGERES" REAL,
    "percentualResolucaoAcoesCompetenciasGERES" REAL,
    "taxaMortalidadePorCausasEvitaeis" REAL,
    "proporcaoNascidosVivosMae7OuMaisConsultasPreNatal" REAL,
    "taxaMortalidadeAcidentesTransporteTerrestre" REAL,
    "percentualReducaoFilaConsultas" REAL,
    "percentualAproveitamentoCotasExamesImagem" REAL,
    "percentualInvestigacaoEpidemiologicaObitosAcidenteTrabalho" REAL,
    "percentualReducaoFilaExamesImagem" REAL,
    "percentualMortalidadeNaoHospitalarDCNT" REAL,
    "percentualMortalidadeNaoHospitalarInfancia" REAL,
    "percentualMortalidadeNaoHospitalarMaterna" REAL,
    "percentualCoberturaVacinalPorRegional" REAL,
    "percentualMortesAEsclarecerPorRegional" REAL,
    "percentualFilaEsperaPorRegional" REAL,
    "percentualAcoesFinanceirasExecutadasTempoHabil" REAL,
    "dataInicio" TEXT NOT NULL,
    "dataFinal" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DataForm_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DataForm" ("createdAt", "dataFinal", "dataInicio", "id", "idUser") SELECT "createdAt", "dataFinal", "dataInicio", "id", "idUser" FROM "DataForm";
DROP TABLE "DataForm";
ALTER TABLE "new_DataForm" RENAME TO "DataForm";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
