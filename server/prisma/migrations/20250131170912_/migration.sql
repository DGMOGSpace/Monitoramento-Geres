/*
  Warnings:

  - You are about to drop the column `taxaMortalidadePorCausasEvitaeis` on the `DataForm` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DataForm" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "idUser" INTEGER NOT NULL,
    "percentualAcoesFinanceirasExecutadas" REAL,
    "percentualAreasTecnicasComSalasSituacaoInstituidas" REAL,
    "percentualAcoesRegionalizacaoDesenvolvidasGeres" REAL,
    "percentualVinculacaoGestanteServicoReferenciaParto" REAL,
    "percentualObitosInfantisFetaisInvestigados" REAL,
    "numeroMunicipiosCoberturaVacinalMenores2Anos" REAL,
    "percentualInternacaoCausasSensiveisAPS" REAL,
    "percentualPerdaPrimariaCotasConsultasExames" REAL,
    "percentualAbsenteismoConsultasExames" REAL,
    "taxaMortalidadeMaterna" REAL,
    "taxaMortalidadeInfantil" REAL,
    "percentualGestantesAltoRiscoAcompanhadasAdequadamente" REAL,
    "percentualPacientesRetornoGarantidoUPAEs" REAL,
    "percentualMunicipiosEnviaramDadosRNDS" REAL,
    "percentualCumprimentoPESNoExercicio" REAL,
    "taxaSatisfacaoMunicipiosApoioGERES" REAL,
    "percentualResolucaoAcoesCompetenciasGERES" REAL,
    "taxaMortalidadePorCausasEvitaveis" REAL,
    "proporcaoNascidosVivosMae7OuMaisConsultasPreNatal" REAL,
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
    "dataInicio" TEXT NOT NULL,
    "dataFinal" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DataForm_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DataForm" ("createdAt", "dataFinal", "dataInicio", "id", "idUser", "numeroMunicipiosCoberturaVacinalMenores2Anos", "percentualAbsenteismoConsultasExames", "percentualAcoesFinanceirasExecutadas", "percentualAcoesRegionalizacaoDesenvolvidasGeres", "percentualAproveitamentoCotasExamesImagem", "percentualAreasTecnicasComSalasSituacaoInstituidas", "percentualCoberturaVacinalPorRegional", "percentualCumprimentoPESNoExercicio", "percentualFilaEsperaPorRegional", "percentualGestantesAltoRiscoAcompanhadasAdequadamente", "percentualInternacaoCausasSensiveisAPS", "percentualInvestigacaoEpidemiologicaObitosAcidenteTrabalho", "percentualMortalidadeNaoHospitalarDCNT", "percentualMortalidadeNaoHospitalarInfancia", "percentualMortalidadeNaoHospitalarMaterna", "percentualMortesAEsclarecerPorRegional", "percentualMunicipiosEnviaramDadosRNDS", "percentualObitosInfantisFetaisInvestigados", "percentualPacientesRetornoGarantidoUPAEs", "percentualPerdaPrimariaCotasConsultasExames", "percentualReducaoFilaConsultas", "percentualReducaoFilaExamesImagem", "percentualResolucaoAcoesCompetenciasGERES", "percentualVinculacaoGestanteServicoReferenciaParto", "proporcaoNascidosVivosMae7OuMaisConsultasPreNatal", "taxaMortalidadeInfantil", "taxaMortalidadeMaterna", "taxaSatisfacaoMunicipiosApoioGERES") SELECT "createdAt", "dataFinal", "dataInicio", "id", "idUser", "numeroMunicipiosCoberturaVacinalMenores2Anos", "percentualAbsenteismoConsultasExames", "percentualAcoesFinanceirasExecutadas", "percentualAcoesRegionalizacaoDesenvolvidasGeres", "percentualAproveitamentoCotasExamesImagem", "percentualAreasTecnicasComSalasSituacaoInstituidas", "percentualCoberturaVacinalPorRegional", "percentualCumprimentoPESNoExercicio", "percentualFilaEsperaPorRegional", "percentualGestantesAltoRiscoAcompanhadasAdequadamente", "percentualInternacaoCausasSensiveisAPS", "percentualInvestigacaoEpidemiologicaObitosAcidenteTrabalho", "percentualMortalidadeNaoHospitalarDCNT", "percentualMortalidadeNaoHospitalarInfancia", "percentualMortalidadeNaoHospitalarMaterna", "percentualMortesAEsclarecerPorRegional", "percentualMunicipiosEnviaramDadosRNDS", "percentualObitosInfantisFetaisInvestigados", "percentualPacientesRetornoGarantidoUPAEs", "percentualPerdaPrimariaCotasConsultasExames", "percentualReducaoFilaConsultas", "percentualReducaoFilaExamesImagem", "percentualResolucaoAcoesCompetenciasGERES", "percentualVinculacaoGestanteServicoReferenciaParto", "proporcaoNascidosVivosMae7OuMaisConsultasPreNatal", "taxaMortalidadeInfantil", "taxaMortalidadeMaterna", "taxaSatisfacaoMunicipiosApoioGERES" FROM "DataForm";
DROP TABLE "DataForm";
ALTER TABLE "new_DataForm" RENAME TO "DataForm";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
