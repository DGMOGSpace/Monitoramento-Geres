/*
  Warnings:

  - You are about to drop the column `percentualAproveitamentoCotasExameImagem` on the `DataForm` table. All the data in the column will be lost.
  - You are about to drop the column `percentualCumprimentoPesExercicio` on the `DataForm` table. All the data in the column will be lost.
  - You are about to drop the column `percentualMortesEsclarecerPorRegional` on the `DataForm` table. All the data in the column will be lost.
  - You are about to drop the column `percentualResolucaoAcoesCompetenciasGeresProgramaGeresPercorre` on the `DataForm` table. All the data in the column will be lost.
  - You are about to drop the column `proporcaoNascidosVivosMaes7ConsultasPrenatal` on the `DataForm` table. All the data in the column will be lost.
  - You are about to drop the column `taxaMortalidadeAcidentesTransporteTerrestre` on the `DataForm` table. All the data in the column will be lost.
  - You are about to drop the column `taxaMortalidadeCausasEvitaveis` on the `DataForm` table. All the data in the column will be lost.
  - You are about to drop the column `taxaSatisfacaoMunicipiosApoioGeres` on the `DataForm` table. All the data in the column will be lost.

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
    "taxaMortalidadePorCausasEvitaeis" REAL,
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
INSERT INTO "new_DataForm" ("createdAt", "dataFinal", "dataInicio", "id", "idUser", "numeroMunicipiosCoberturaVacinalMenores2Anos", "percentualAbsenteismoConsultasExames", "percentualAcoesFinanceirasExecutadas", "percentualAcoesRegionalizacaoDesenvolvidasGeres", "percentualAreasTecnicasComSalasSituacaoInstituidas", "percentualCoberturaVacinalPorRegional", "percentualFilaEsperaPorRegional", "percentualGestantesAltoRiscoAcompanhadasAdequadamente", "percentualInternacaoCausasSensiveisAPS", "percentualInvestigacaoEpidemiologicaObitosAcidenteTrabalho", "percentualMortalidadeNaoHospitalarDCNT", "percentualMortalidadeNaoHospitalarInfancia", "percentualMortalidadeNaoHospitalarMaterna", "percentualMunicipiosEnviaramDadosRNDS", "percentualObitosInfantisFetaisInvestigados", "percentualPacientesRetornoGarantidoUPAEs", "percentualPerdaPrimariaCotasConsultasExames", "percentualReducaoFilaConsultas", "percentualReducaoFilaExamesImagem", "percentualVinculacaoGestanteServicoReferenciaParto", "taxaMortalidadeInfantil", "taxaMortalidadeMaterna") SELECT "createdAt", "dataFinal", "dataInicio", "id", "idUser", "numeroMunicipiosCoberturaVacinalMenores2Anos", "percentualAbsenteismoConsultasExames", "percentualAcoesFinanceirasExecutadas", "percentualAcoesRegionalizacaoDesenvolvidasGeres", "percentualAreasTecnicasComSalasSituacaoInstituidas", "percentualCoberturaVacinalPorRegional", "percentualFilaEsperaPorRegional", "percentualGestantesAltoRiscoAcompanhadasAdequadamente", "percentualInternacaoCausasSensiveisAPS", "percentualInvestigacaoEpidemiologicaObitosAcidenteTrabalho", "percentualMortalidadeNaoHospitalarDCNT", "percentualMortalidadeNaoHospitalarInfancia", "percentualMortalidadeNaoHospitalarMaterna", "percentualMunicipiosEnviaramDadosRNDS", "percentualObitosInfantisFetaisInvestigados", "percentualPacientesRetornoGarantidoUPAEs", "percentualPerdaPrimariaCotasConsultasExames", "percentualReducaoFilaConsultas", "percentualReducaoFilaExamesImagem", "percentualVinculacaoGestanteServicoReferenciaParto", "taxaMortalidadeInfantil", "taxaMortalidadeMaterna" FROM "DataForm";
DROP TABLE "DataForm";
ALTER TABLE "new_DataForm" RENAME TO "DataForm";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
