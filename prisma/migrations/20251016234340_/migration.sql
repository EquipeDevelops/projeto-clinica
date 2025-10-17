/*
  Warnings:

  - You are about to drop the `Recepcionista` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `recepcionistaId` on the `Consulta` table. All the data in the column will be lost.
  - You are about to drop the column `rua` on the `Paciente` table. All the data in the column will be lost.
  - You are about to alter the column `cep` on the `Paciente` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `numero` on the `Paciente` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Added the required column `atualizado_em` to the `Consulta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `atualizado_em` to the `Paciente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataNascimento` to the `Paciente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Paciente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logradouro` to the `Paciente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uf` to the `Paciente` table without a default value. This is not possible if the table is not empty.
  - Made the column `complemento` on table `Paciente` required. This step will fail if there are existing NULL values in that column.
  - Made the column `idade` on table `Paciente` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sexo` on table `Paciente` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `Sobrenome` to the `Profissional` table without a default value. This is not possible if the table is not empty.
  - Added the required column `atualizado_em` to the `Profissional` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idade` to the `Profissional` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profissional` to the `Profissional` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Recepcionista_telefone_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Recepcionista";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Consulta" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dataHora" DATETIME NOT NULL,
    "salaLocal" TEXT,
    "observacao" TEXT,
    "profissionalId" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'AGENDADA',
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" DATETIME NOT NULL,
    CONSTRAINT "Consulta_profissionalId_fkey" FOREIGN KEY ("profissionalId") REFERENCES "Profissional" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Consulta_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Paciente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Consulta" ("clienteId", "dataHora", "id", "observacao", "profissionalId", "salaLocal", "status") SELECT "clienteId", "dataHora", "id", "observacao", "profissionalId", "salaLocal", "status" FROM "Consulta";
DROP TABLE "Consulta";
ALTER TABLE "new_Consulta" RENAME TO "Consulta";
CREATE TABLE "new_Paciente" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "idade" INTEGER NOT NULL,
    "dataNascimento" DATETIME NOT NULL,
    "sexo" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "cep" INTEGER NOT NULL,
    "logradouro" TEXT NOT NULL,
    "complemento" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "cidade" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "celular" INTEGER NOT NULL,
    "cpf" TEXT NOT NULL,
    "responsavelNome" TEXT,
    "telefoneResponsavel" INTEGER,
    "idadeResponsavel" INTEGER,
    "emailResponsavel" TEXT,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" DATETIME NOT NULL
);
INSERT INTO "new_Paciente" ("bairro", "celular", "cep", "cidade", "complemento", "cpf", "emailResponsavel", "endereco", "estado", "id", "idade", "idadeResponsavel", "nome", "numero", "responsavelNome", "sexo", "telefoneResponsavel") SELECT "bairro", "celular", "cep", "cidade", "complemento", "cpf", "emailResponsavel", "endereco", "estado", "id", "idade", "idadeResponsavel", "nome", "numero", "responsavelNome", "sexo", "telefoneResponsavel" FROM "Paciente";
DROP TABLE "Paciente";
ALTER TABLE "new_Paciente" RENAME TO "Paciente";
CREATE UNIQUE INDEX "Paciente_email_key" ON "Paciente"("email");
CREATE UNIQUE INDEX "Paciente_celular_key" ON "Paciente"("celular");
CREATE UNIQUE INDEX "Paciente_cpf_key" ON "Paciente"("cpf");
CREATE TABLE "new_Profissional" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profissional" TEXT NOT NULL,
    "especialidade" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "Sobrenome" TEXT NOT NULL,
    "idade" INTEGER NOT NULL,
    "disponibilidades" DATETIME NOT NULL,
    "telefone" INTEGER NOT NULL,
    "códigoProfissional" TEXT NOT NULL,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" DATETIME NOT NULL
);
INSERT INTO "new_Profissional" ("códigoProfissional", "disponibilidades", "especialidade", "id", "nome", "telefone") SELECT "códigoProfissional", "disponibilidades", "especialidade", "id", "nome", "telefone" FROM "Profissional";
DROP TABLE "Profissional";
ALTER TABLE "new_Profissional" RENAME TO "Profissional";
CREATE UNIQUE INDEX "Profissional_telefone_key" ON "Profissional"("telefone");
CREATE UNIQUE INDEX "Profissional_códigoProfissional_key" ON "Profissional"("códigoProfissional");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
