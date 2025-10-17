/*
  Warnings:

  - You are about to drop the column `códigoProfissional` on the `Profissional` table. All the data in the column will be lost.
  - Added the required column `codigoProfissional` to the `Profissional` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Profissional" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profissional" TEXT NOT NULL,
    "especialidade" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "Sobrenome" TEXT NOT NULL,
    "idade" INTEGER NOT NULL,
    "disponibilidades" DATETIME NOT NULL,
    "telefone" INTEGER NOT NULL,
    "codigoProfissional" TEXT NOT NULL,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" DATETIME NOT NULL
);
INSERT INTO "new_Profissional" ("Sobrenome", "atualizado_em", "criado_em", "disponibilidades", "especialidade", "id", "idade", "nome", "profissional", "telefone") SELECT "Sobrenome", "atualizado_em", "criado_em", "disponibilidades", "especialidade", "id", "idade", "nome", "profissional", "telefone" FROM "Profissional";
DROP TABLE "Profissional";
ALTER TABLE "new_Profissional" RENAME TO "Profissional";
CREATE UNIQUE INDEX "Profissional_telefone_key" ON "Profissional"("telefone");
CREATE UNIQUE INDEX "Profissional_codigoProfissional_key" ON "Profissional"("codigoProfissional");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
