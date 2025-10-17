import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const profissional = await prisma.profissional.findUnique({
      where: { id },
      select: {
        id: true,
        profissional: true,
        especialidade: true,
        nome: true,
        Sobrenome: true,
        idade: true,
        disponibilidades: true,
        telefone: true,
        codigoProfissional: true,
      },
    });

    if (!profissional) {
      return NextResponse.json(
        { message: "Profissional não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(profissional, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar profissional:", error);
    return NextResponse.json(
      { message: "Erro ao buscar profissional" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
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

    const profissionalExistente = await prisma.profissional.findUnique({
      where: { id },
    });

    if (!profissionalExistente) {
      return NextResponse.json(
        { message: "Profissional não encontrado" },
        { status: 404 }
      );
    }

    const idadeInt = idade !== undefined ? parseInt(idade) : undefined;
    const telefoneInt = telefone !== undefined ? parseInt(telefone) : undefined;
    const disponibilidadesDate =
      disponibilidades !== undefined ? new Date(disponibilidades) : undefined;

    const tipoProfissionalEnum =
      profissional !== undefined
        ? (profissional as TipoProfissional)
        : undefined;
    const especialidadeProfissionalEnum =
      especialidade !== undefined
        ? (especialidade as EspecialidadeProfissional)
        : undefined;

    const profissionalAtualizado = await prisma.profissional.update({
      where: { id },
      data: {
        ...(tipoProfissionalEnum !== undefined && {
          profissional: tipoProfissionalEnum,
        }),
        ...(especialidadeProfissionalEnum !== undefined && {
          especialidade: especialidadeProfissionalEnum,
        }),
        ...(nome !== undefined && { nome }),
        ...(Sobrenome !== undefined && { Sobrenome }),
        ...(idadeInt !== undefined && { idade: idadeInt }),
        ...(disponibilidadesDate !== undefined && {
          disponibilidades: disponibilidadesDate,
        }),
        ...(telefoneInt !== undefined && { telefone: telefoneInt }),
        ...(codigoProfissional !== undefined && { codigoProfissional }),
      },
    });

    return NextResponse.json(profissionalAtualizado, { status: 200 });
  } catch (error: any) {
    console.error("Erro ao atualizar profissional:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        {
          message:
            "Conflito de dados: Telefone ou Código do Profissional já cadastrados.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Erro ao atualizar profissional" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const profissional = await prisma.profissional.findUnique({
      where: { id },
      include: {
        consultas: true,
      },
    });

    if (!profissional) {
      return NextResponse.json(
        { message: "Profissional não encontrado" },
        { status: 404 }
      );
    }

    if (profissional.consultas.length > 0) {
      return NextResponse.json(
        {
          message:
            "Não é possível excluir o profissional. Existem consultas associadas.",
        },
        { status: 400 }
      );
    }

    await prisma.profissional.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Profissional excluído com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao excluir profissional:", error);
    return NextResponse.json(
      { message: "Erro ao excluir profissional" },
      { status: 500 }
    );
  }
}
