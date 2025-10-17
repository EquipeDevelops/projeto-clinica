import { NextRequest, NextResponse } from "next/server";
import prisma from "../../lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const profissional = await prisma.profissional.findMany({
      select: {
        id: true,
        profissional: true,
        especialidade: true,
        nome: true,
        Sobrenome: true,
        idade: true,
        disponibilidades: true,
        telefone: true,
        códigoProfissional: true,
      },
    });
    return NextResponse.json(profissional, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao buscar profissional" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      profissional,
      especialidade,
      nome,
      Sobrenome,
      idade,
      disponibilidades,
      telefone,
      codigoProfissional,
    } = body;

    // 1. Conversão de Tipos (Strings JSON -> Int/Date)

    // Campos Int
    const idadeInt = parseInt(idade);
    const telefoneInt = parseInt(telefone);

    // Campo DateTime
    const disponibilidadesDate = new Date(disponibilidades);

    // 2. Validação dos Enums
    // O Prisma Client aceita a string, mas esta validação é uma boa prática
    const tipoProfissionalEnum = profissional as TipoProfissional;
    const especialidadeProfissionalEnum =
      especialidade as EspecialidadeProfissional;

    // 3. Criação do Profissional
    const novoProfissional = await prisma.profissional.create({
      data: {
        profissional: tipoProfissionalEnum,
        especialidade: especialidadeProfissionalEnum,
        nome,
        Sobrenome,
        idade: idadeInt,
        disponibilidades: disponibilidadesDate,
        telefone: telefoneInt,
        codigoProfissional,
      },
    });

    return NextResponse.json(novoProfissional, { status: 201 }); // 201 Created
  } catch (error: any) {
    console.error("Erro ao criar profissional:", error);

    // Tratamento de Erro P2002 para campos @unique (telefone, codigoProfissional)
    if (error.code === "P2002") {
      return NextResponse.json(
        {
          message:
            "Conflito de dados: Telefone ou Código do Profissional já cadastrados.",
        },
        { status: 409 } // 409 Conflict
      );
    }

    // Erro Genérico (Problema de tipagem, enum inválido, etc.)
    return NextResponse.json(
      {
        message:
          "Erro interno do servidor ao criar profissional. Verifique os tipos de dados e os campos obrigatórios.",
      },
      { status: 500 }
    );
  }
}
