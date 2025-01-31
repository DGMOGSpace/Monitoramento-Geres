/*
  Warnings:

  - You are about to drop the column `percentualMunicipiosVisitados` on the `DataForm` table. All the data in the column will be lost.
  - You are about to drop the column `percentualResolucaoAcoesCompetenciasGeres` on the `DataForm` table. All the data in the column will be lost.

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
    "percentualCumprimentoPesExercicio" REAL,
    "taxaSatisfacaoMunicipiosApoioGeres" REAL,
    "percentualResolucaoAcoesCompetenciasGeresProgramaGeresPercorre" REAL,
    "taxaMortalidadeCausasEvitaveis" REAL,
    "proporcaoNascidosVivosMaes7ConsultasPrenatal" REAL,
    "taxaMortalidadeAcidentesTransporteTerrestre" REAL,
    "percentualReducaoFilaConsultas" REAL,
    "percentualAproveitamentoCotasExameImagem" REAL,
    "percentualInvestigacaoEpidemiologicaObitosAcidenteTrabalho" REAL,
    "percentualReducaoFilaExamesImagem" REAL,
    "percentualMortalidadeNaoHospitalarDCNT" REAL,
    "percentualMortalidadeNaoHospitalarInfancia" REAL,
    "percentualMortalidadeNaoHospitalarMaterna" REAL,
    "percentualCoberturaVacinalPorRegional" REAL,
    "percentualMortesEsclarecerPorRegional" REAL,
    "percentualFilaEsperaPorRegional" REAL,
    "dataInicio" TEXT NOT NULL,
    "dataFinal" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DataForm_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DataForm" ("createdAt", "dataFinal", "dataInicio", "id", "idUser", "numeroMunicipiosCoberturaVacinalMenores2Anos", "percentualAbsenteismoConsultasExames", "percentualAcoesFinanceirasExecutadas", "percentualAcoesRegionalizacaoDesenvolvidasGeres", "percentualAproveitamentoCotasExameImagem", "percentualAreasTecnicasComSalasSituacaoInstituidas", "percentualCoberturaVacinalPorRegional", "percentualCumprimentoPesExercicio", "percentualFilaEsperaPorRegional", "percentualGestantesAltoRiscoAcompanhadasAdequadamente", "percentualInternacaoCausasSensiveisAPS", "percentualInvestigacaoEpidemiologicaObitosAcidenteTrabalho", "percentualMortalidadeNaoHospitalarDCNT", "percentualMortalidadeNaoHospitalarInfancia", "percentualMortalidadeNaoHospitalarMaterna", "percentualMortesEsclarecerPorRegional", "percentualMunicipiosEnviaramDadosRNDS", "percentualObitosInfantisFetaisInvestigados", "percentualPacientesRetornoGarantidoUPAEs", "percentualPerdaPrimariaCotasConsultasExames", "percentualReducaoFilaConsultas", "percentualReducaoFilaExamesImagem", "percentualResolucaoAcoesCompetenciasGeresProgramaGeresPercorre", "percentualVinculacaoGestanteServicoReferenciaParto", "proporcaoNascidosVivosMaes7ConsultasPrenatal", "taxaMortalidadeAcidentesTransporteTerrestre", "taxaMortalidadeCausasEvitaveis", "taxaMortalidadeInfantil", "taxaMortalidadeMaterna", "taxaSatisfacaoMunicipiosApoioGeres") SELECT "createdAt", "dataFinal", "dataInicio", "id", "idUser", "numeroMunicipiosCoberturaVacinalMenores2Anos", "percentualAbsenteismoConsultasExames", "percentualAcoesFinanceirasExecutadas", "percentualAcoesRegionalizacaoDesenvolvidasGeres", "percentualAproveitamentoCotasExameImagem", "percentualAreasTecnicasComSalasSituacaoInstituidas", "percentualCoberturaVacinalPorRegional", "percentualCumprimentoPesExercicio", "percentualFilaEsperaPorRegional", "percentualGestantesAltoRiscoAcompanhadasAdequadamente", "percentualInternacaoCausasSensiveisAPS", "percentualInvestigacaoEpidemiologicaObitosAcidenteTrabalho", "percentualMortalidadeNaoHospitalarDCNT", "percentualMortalidadeNaoHospitalarInfancia", "percentualMortalidadeNaoHospitalarMaterna", "percentualMortesEsclarecerPorRegional", "percentualMunicipiosEnviaramDadosRNDS", "percentualObitosInfantisFetaisInvestigados", "percentualPacientesRetornoGarantidoUPAEs", "percentualPerdaPrimariaCotasConsultasExames", "percentualReducaoFilaConsultas", "percentualReducaoFilaExamesImagem", "percentualResolucaoAcoesCompetenciasGeresProgramaGeresPercorre", "percentualVinculacaoGestanteServicoReferenciaParto", "proporcaoNascidosVivosMaes7ConsultasPrenatal", "taxaMortalidadeAcidentesTransporteTerrestre", "taxaMortalidadeCausasEvitaveis", "taxaMortalidadeInfantil", "taxaMortalidadeMaterna", "taxaSatisfacaoMunicipiosApoioGeres" FROM "DataForm";
DROP TABLE "DataForm";
ALTER TABLE "new_DataForm" RENAME TO "DataForm";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
