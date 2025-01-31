-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "modifyPassword" BOOLEAN NOT NULL DEFAULT false,
    "geres" INTEGER NOT NULL,
    "setor" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "admin" BOOLEAN NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("active", "admin", "cargo", "createdAt", "email", "fullName", "geres", "id", "modifyPassword", "password", "setor") SELECT "active", "admin", "cargo", "createdAt", "email", "fullName", "geres", "id", "modifyPassword", "password", "setor" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
