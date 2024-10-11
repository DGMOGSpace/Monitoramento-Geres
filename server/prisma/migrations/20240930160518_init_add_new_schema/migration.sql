-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "geres" INTEGER NOT NULL,
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
    "execucao_do_orcamento_por_regional" REAL,
    "taxa_de_satisfacao_municipios_apoio_geres" REAL,
    "resolucao_acoes_competencias_geres" REAL,
    "municipios_visitados" REAL,
    "aproveitamento_cotas_exame_imagem" REAL,
    "taxa_perda_primaria_upae" REAL,
    "taxa_absenteismo" REAL,
    "cumprimento_pes_quadrimestre" REAL,
    "cumprimento_pes_exercicio" REAL,
    "indice_qualificacao_acoes_vigilancia" REAL,
    "aproveitamento_cotas_consultas_especializadas" REAL,
    "municipios_instrumentos_gestao_sus_atualizados" REAL,
    "implementacao_planejamento_estrategico" REAL,
    "engajamento_gestores_reunioes_grupos_condutores_macrorregionais" REAL,
    "integracao_grupos_condutores_rede_pri" REAL,
    "participacao_gestores_reunioes_camara_tecnica_ct_cir" REAL,
    "participacao_gestores_reunioes_cir" REAL,
    "dataRef" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DataForm_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
