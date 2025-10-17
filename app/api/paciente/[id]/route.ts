import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const paciente = await prisma.paciente.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        idade: true,
        dataNascimento: true,
        sexo: true,
        endereco: true,
        cep: true,
        logradouro: true,
        complemento: true,
        bairro: true,
        numero: true,
        cidade: true,
        uf: true,
        estado: true,
        celular: true,
        cpf: true,
        responsavelNome: true,
        telefoneResponsavel: true,
        idadeResponsavel: true,
        emailResponsavel: true,
      },
    });

    if (!paciente) {
      return NextResponse.json(
        { message: "Paciente não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(paciente, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar paciente:", error);
    return NextResponse.json(
      { message: "Erro ao buscar paciente" },
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
      nome,
      email,
      idade,
      dataNascimento,
      sexo,
      endereco,
      cep,
      logradouro,
      complemento,
      bairro,
      numero,
      cidade,
      uf,
      estado,
      celular,
      cpf,
      responsavelNome,
      telefoneResponsavel,
      idadeResponsavel,
      emailResponsavel,
    } = body;

    const pacienteExistente = await prisma.paciente.findUnique({
      where: { id },
    });

    if (!pacienteExistente) {
      return NextResponse.json(
        { message: "Paciente não encontrado" },
        { status: 404 }
      );
    }

    const idadeInt = idade !== undefined ? parseInt(idade) : undefined;
    const numeroInt = numero !== undefined ? parseInt(numero) : undefined;
    const cepInt = cep !== undefined ? parseInt(cep) : undefined;
    const celularInt = celular !== undefined ? parseInt(celular) : undefined;

    const dataNascimentoDate =
      dataNascimento !== undefined ? new Date(dataNascimento) : undefined;

    const telefoneResponsavelInt =
      telefoneResponsavel !== undefined
        ? telefoneResponsavel
          ? parseInt(telefoneResponsavel)
          : null
        : undefined;
    const idadeResponsavelInt =
      idadeResponsavel !== undefined
        ? idadeResponsavel
          ? parseInt(idadeResponsavel)
          : null
        : undefined;

    const pacienteAtualizado = await prisma.paciente.update({
      where: { id },
      data: {
        ...(nome !== undefined && { nome }),
        ...(email !== undefined && { email }),
        ...(idadeInt !== undefined && { idade: idadeInt }),
        ...(dataNascimentoDate !== undefined && {
          dataNascimento: dataNascimentoDate,
        }),
        ...(sexo !== undefined && { sexo }),
        ...(endereco !== undefined && { endereco }),
        ...(cepInt !== undefined && { cep: cepInt }),
        ...(logradouro !== undefined && { logradouro }),
        ...(complemento !== undefined && { complemento }),
        ...(bairro !== undefined && { bairro }),
        ...(numeroInt !== undefined && { numero: numeroInt }),
        ...(cidade !== undefined && { cidade }),
        ...(uf !== undefined && { uf }),
        ...(estado !== undefined && { estado }),
        ...(celularInt !== undefined && { celular: celularInt }),
        ...(cpf !== undefined && { cpf }),
        ...(responsavelNome !== undefined && { responsavelNome }),
        ...(telefoneResponsavelInt !== undefined && {
          telefoneResponsavel: telefoneResponsavelInt,
        }),
        ...(idadeResponsavelInt !== undefined && {
          idadeResponsavel: idadeResponsavelInt,
        }),
        ...(emailResponsavel !== undefined && { emailResponsavel }),
      },
    });

    return NextResponse.json(pacienteAtualizado, { status: 200 });
  } catch (error: any) {
    console.error("Erro ao atualizar paciente:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        {
          message: "Conflito de dados: E-mail, CPF ou Celular já cadastrados.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Erro ao atualizar paciente" },
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

    const paciente = await prisma.paciente.findUnique({
      where: { id },
      include: {
        consultas: true,
      },
    });

    if (!paciente) {
      return NextResponse.json(
        { message: "Paciente não encontrado" },
        { status: 404 }
      );
    }

    if (paciente.consultas.length > 0) {
      return NextResponse.json(
        {
          message:
            "Não é possível excluir o paciente. Existem consultas associadas.",
        },
        { status: 400 }
      );
    }

    await prisma.paciente.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Paciente excluído com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao excluir paciente:", error);
    return NextResponse.json(
      { message: "Erro ao excluir paciente" },
      { status: 500 }
    );
  }
}
