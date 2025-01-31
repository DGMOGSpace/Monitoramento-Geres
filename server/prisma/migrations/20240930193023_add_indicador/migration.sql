-- CreateTable
CREATE TABLE "Indicador" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "data" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "indicador" TEXT NOT NULL,
    "valor" REAL NOT NULL
);
