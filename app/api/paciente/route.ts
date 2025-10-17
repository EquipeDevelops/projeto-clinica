import { NextRequest, NextResponse } from "next/server";
import prisma from "../../lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const pacientes = await prisma.paciente.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        celular: true,
        endereco: true,
      },
    });
    return NextResponse.json(pacientes, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao buscar pacientes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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

    // Conversão de tipos para Int
    const idadeInt = parseInt(idade);
    const numeroInt = parseInt(numero);
    const cepInt = parseInt(cep);
    const celularInt = parseInt(celular);

    // Conversão de data para DateTime
    const dataNascimentoDate = new Date(dataNascimento);

    // Conversão de campos opcionais para Int (se existirem)
    const telefoneResponsavelInt = telefoneResponsavel
      ? parseInt(telefoneResponsavel)
      : null;
    const idadeResponsavelInt = idadeResponsavel
      ? parseInt(idadeResponsavel)
      : null;

    const novoPaciente = await prisma.paciente.create({
      data: {
        nome,
        email,
        idade: idadeInt,
        dataNascimento: dataNascimentoDate,
        sexo,
        endereco,
        cep: cepInt,
        logradouro,
        complemento,
        bairro,
        numero: numeroInt,
        cidade,
        uf,
        estado,
        celular: celularInt,
        cpf,
        responsavelNome,
        telefoneResponsavel: telefoneResponsavelInt,
        idadeResponsavel: idadeResponsavelInt,
        emailResponsavel,
      },
    });

    return NextResponse.json(novoPaciente, { status: 201 });
  } catch (error: any) {
    console.error("Erro ao criar paciente:", error);

    // Tratamento de conflito de dados (campos @unique)
    if (error.code === "P2002") {
      return NextResponse.json(
        {
          message: "Conflito de dados: E-mail, CPF ou Celular já cadastrados.",
        },
        { status: 409 }
      );
    }

    // Erro genérico
    return NextResponse.json(
      {
        message:
          "Erro ao criar paciente. Verifique os tipos de dados e os campos obrigatórios.",
      },
      { status: 500 }
    );
  }
}
