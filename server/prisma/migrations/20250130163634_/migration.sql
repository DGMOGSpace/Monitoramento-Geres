/*
  Warnings:

  - You are about to drop the column `percentualAcoesFinanceirasExecutadasTempoHabil` on the `DataForm` table. All the data in the column will be lost.
  - You are about to drop the column `percentualAcoesRegionalizacaoDesenvolvidasPelaGERES` on the `DataForm` table. All the data in the column will be lost.
  - You are about to drop the column `percentualAproveitamentoCotasExamesImagem` on the `DataForm` table. All the data in the column will be lost.
  - You are about to drop the column `percentualAreasTecnicasComSalasDeSituacaoInstituidas` on the `DataForm` table. All the data in the column will be lost.
  - You are about to drop the column `percentualCumprimentoPESNoExercicio` on the `DataForm` table. All the data in the column will be lost.
  - You are about to drop the column `percentualGestantesAltoRiscoAcompanhadas` on the `DataForm` table. All the data in the column will be lost.
  - You are about to drop the column `percentualInternacaoPorCausasSensiveisAPS` on the `DataForm` table. All the data in the column will be lost.
  - You are about to drop the column `percentualMortesAEsclarecerPorRegional` on the `DataForm` table. All the data in the column will be lost.
  - You are about to drop the column `percentualObitosInvestigadosEmTempoOportuno` on the `DataForm` table. All the data in the column will be lost.
  - You are about to drop the column `percentualResolucaoAcoesCompetenciasGERES` on the `DataForm` table. All the data in the column will be lost.
  - You are about to drop the column `percentualResolucaoAcoesCompetenciasGERESProgramaGERESPercore` on the `DataForm` table. All the data in the column will be lost.
  - You are about to drop the column `percentualVinculacaoGestanteAoServicoReferencia` on the `DataForm` table. All the data in the column will be lost.
  - You are about to drop the column `proporcaoNascidosVivosMae7OuMaisConsultasPreNatal` on the `DataForm` table. All the data in the column will be lost.
  - You are about to drop the column `taxaMortalidadePorCausasEvitaeis` on the `DataForm` table. All the data in the column will be lost.
  - You are about to drop the column `taxaSatisfacaoMunicipiosApoioGERES` on the `DataForm` table. All the data in the column will be lost.
  - You are about to alter the column `numeroMunicipiosCoberturaVacinalMenores2Anos` on the `DataForm` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DataForm" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "idUser" INTEGER NOT NULL,
    "percentualAcoesFinanceirasExecutadas" REAL,
    "taxaSatisfacaoMunicipiosApoioGeres" REAL,
    "percentualResolucaoAcoesCompetenciasGeres" REAL,
    "percentualMunicipiosVisitados" REAL,
    "numeroMunicipiosCoberturaVacinalMenores2Anos" REAL,
    "percentualMunicipiosEnviaramDadosRNDS" REAL,
    "percentualCumprimentoPesExercicio" REAL,
    "percentualAreasTecnicasComSalasSituacaoInstituidas" REAL,
    "percentualAcoesRegionalizacaoDesenvolvidasGeres" REAL,
    "percentualVinculacaoGestanteServicoReferenciaParto" REAL,
    "percentualObitosInfantisFetaisInvestigados" REAL,
    "percentualReducaoFilaConsultas" REAL,
    "percentualReducaoFilaExamesImagem" REAL,
    "percentualInvestigacaoEpidemiologicaObitosAcidenteTrabalho" REAL,
    "percentualAproveitamentoCotasExameImagem" REAL,
    "percentualInternacaoCausasSensiveisAPS" REAL,
    "percentualAbsenteismoConsultasExames" REAL,
    "percentualPerdaPrimariaCotasConsultasExames" REAL,
    "percentualPacientesRetornoGarantidoUPAEs" REAL,
    "percentualGestantesAltoRiscoAcompanhadasAdequadamente" REAL,
    "taxaMortalidadeMaterna" REAL,
    "taxaMortalidadeInfantil" REAL,
    "taxaSatisfacaoMunicipiosApoioGeres2" REAL,
    "percentualResolucaoAcoesCompetenciasGeresProgramaGeresPercorre" REAL,
    "taxaMortalidadeCausasEvitaveis" REAL,
    "proporcaoNascidosVivosMaes7ConsultasPrenatal" REAL,
    "taxaMortalidadeAcidentesTransporteTerrestre" REAL,
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
INSERT INTO "new_DataForm" ("createdAt", "dataFinal", "dataInicio", "id", "idUser", "numeroMunicipiosCoberturaVacinalMenores2Anos", "percentualAbsenteismoConsultasExames", "percentualCoberturaVacinalPorRegional", "percentualFilaEsperaPorRegional", "percentualInvestigacaoEpidemiologicaObitosAcidenteTrabalho", "percentualMortalidadeNaoHospitalarDCNT", "percentualMortalidadeNaoHospitalarInfancia", "percentualMortalidadeNaoHospitalarMaterna", "percentualMunicipiosEnviaramDadosRNDS", "percentualMunicipiosVisitados", "percentualPacientesRetornoGarantidoUPAEs", "percentualPerdaPrimariaCotasConsultasExames", "percentualReducaoFilaConsultas", "percentualReducaoFilaExamesImagem", "taxaMortalidadeAcidentesTransporteTerrestre", "taxaMortalidadeInfantil", "taxaMortalidadeMaterna") SELECT "createdAt", "dataFinal", "dataInicio", "id", "idUser", "numeroMunicipiosCoberturaVacinalMenores2Anos", "percentualAbsenteismoConsultasExames", "percentualCoberturaVacinalPorRegional", "percentualFilaEsperaPorRegional", "percentualInvestigacaoEpidemiologicaObitosAcidenteTrabalho", "percentualMortalidadeNaoHospitalarDCNT", "percentualMortalidadeNaoHospitalarInfancia", "percentualMortalidadeNaoHospitalarMaterna", "percentualMunicipiosEnviaramDadosRNDS", "percentualMunicipiosVisitados", "percentualPacientesRetornoGarantidoUPAEs", "percentualPerdaPrimariaCotasConsultasExames", "percentualReducaoFilaConsultas", "percentualReducaoFilaExamesImagem", "taxaMortalidadeAcidentesTransporteTerrestre", "taxaMortalidadeInfantil", "taxaMortalidadeMaterna" FROM "DataForm";
DROP TABLE "DataForm";
ALTER TABLE "new_DataForm" RENAME TO "DataForm";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
