-- CreateTable
CREATE TABLE "Profissional" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "especialidade" TEXT NOT NULL,
    "disponibilidades" DATETIME NOT NULL,
    "telefone" INTEGER NOT NULL,
    "códigoProfissional" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Paciente" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "idade" INTEGER,
    "sexo" TEXT,
    "endereco" TEXT NOT NULL,
    "rua" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "complemento" TEXT,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "celular" INTEGER NOT NULL,
    "cpf" TEXT NOT NULL,
    "responsavelNome" TEXT,
    "telefoneResponsavel" INTEGER,
    "idadeResponsavel" INTEGER,
    "emailResponsavel" TEXT
);

-- CreateTable
CREATE TABLE "Consulta" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dataHora" DATETIME NOT NULL,
    "salaLocal" TEXT,
    "observacao" TEXT,
    "recepcionistaId" TEXT,
    "profissionalId" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Agendada',
    CONSTRAINT "Consulta_recepcionistaId_fkey" FOREIGN KEY ("recepcionistaId") REFERENCES "Recepcionista" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Consulta_profissionalId_fkey" FOREIGN KEY ("profissionalId") REFERENCES "Profissional" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Consulta_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Paciente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Recepcionista" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "diaDeTrabalho" DATETIME NOT NULL,
    "telefone" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Profissional_telefone_key" ON "Profissional"("telefone");

-- CreateIndex
CREATE UNIQUE INDEX "Profissional_códigoProfissional_key" ON "Profissional"("códigoProfissional");

-- CreateIndex
CREATE UNIQUE INDEX "Paciente_celular_key" ON "Paciente"("celular");

-- CreateIndex
CREATE UNIQUE INDEX "Paciente_cpf_key" ON "Paciente"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Recepcionista_telefone_key" ON "Recepcionista"("telefone");
