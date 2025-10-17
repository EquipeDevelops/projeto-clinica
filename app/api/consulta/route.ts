import { NextRequest, NextResponse } from "next/server";
import prisma from "../../lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const consulta = await prisma.consulta.findMany({
      select: {
        id: true,
        dataHora: true,
        salaLocal: true,
        observacao: true,
        profissional: { select: { nome: true } },
        cliente: { select: { nome: true } },
      },
    });
    return NextResponse.json(consulta, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao buscar consultas" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      dataHora,
      salaLocal,
      observacao,
      profissionalId,
      clienteId,
      status,
    } = body;

    const dataHoraDate = new Date(dataHora);

    // Converte o status para o enum, se fornecido
    const statusConsultaEnum = status
      ? (status.toUpperCase() as StatusConsulta)
      : undefined; // Se não fornecido, o Prisma usará o @default(AGENDADA)

    // 2. Criação da Consulta
    const novaConsulta = await prisma.consulta.create({
      data: {
        dataHora: dataHoraDate,
        salaLocal,
        observacao,
        profissionalId,
        clienteId,
        // Só define o status se ele foi fornecido no corpo
        ...(statusConsultaEnum && { status: statusConsultaEnum }),
      },
    });

    return NextResponse.json(novaConsulta, { status: 201 }); // Retorna 201 Created
  } catch (error: any) {
    console.error("Erro ao criar consulta:", error);

    if (error.code === "P2003") {
      return NextResponse.json(
        {
          message:
            "Falha na criação: O Profissional ou o Paciente fornecido não foram encontrados no sistema.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message:
          "Erro interno do servidor ao criar consulta. Verifique o formato da data e se os IDs são válidos.",
      },
      { status: 500 }
    );
  }
}
