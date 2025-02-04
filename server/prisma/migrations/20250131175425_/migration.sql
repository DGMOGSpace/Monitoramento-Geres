-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "geres" INTEGER NOT NULL,
    "setor" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "admin" BOOLEAN NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Log" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "idUser" INTEGER NOT NULL,
    "idForm" INTEGER NOT NULL,
    CONSTRAINT "Log_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Log_idForm_fkey" FOREIGN KEY ("idForm") REFERENCES "DataForm" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DataForm" (
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
    "taxaMortalidadeAcidentesTransporteTerrestre" REAL,
    "dataInicio" TEXT NOT NULL,
    "dataFinal" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DataForm_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
