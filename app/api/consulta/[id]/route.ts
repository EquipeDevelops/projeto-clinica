import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const consulta = await prisma.consulta.findUnique({
      where: { id },
      select: {
        id: true,
        dataHora: true,
        salaLocal: true,
        observacao: true,
        status: true,
        profissional: {
          select: { nome: true, Sobrenome: true, especialidade: true },
        },
        cliente: { select: { nome: true, email: true, celular: true } },
      },
    });

    if (!consulta) {
      return NextResponse.json(
        { message: "Consulta não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(consulta, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar consulta:", error);
    return NextResponse.json(
      { message: "Erro ao buscar consulta" },
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
      dataHora,
      salaLocal,
      observacao,
      profissionalId,
      clienteId,
      status,
    } = body;

    const consultaExistente = await prisma.consulta.findUnique({
      where: { id },
    });

    if (!consultaExistente) {
      return NextResponse.json(
        { message: "Consulta não encontrada" },
        { status: 404 }
      );
    }

    const dataHoraDate =
      dataHora !== undefined ? new Date(dataHora) : undefined;

    const statusConsultaEnum =
      status !== undefined
        ? (status.toUpperCase() as StatusConsulta)
        : undefined;

    if (profissionalId !== undefined) {
      const profissional = await prisma.profissional.findUnique({
        where: { id: profissionalId },
      });
      if (!profissional) {
        return NextResponse.json(
          { message: "Profissional não encontrado" },
          { status: 404 }
        );
      }
    }

    if (clienteId !== undefined) {
      const cliente = await prisma.paciente.findUnique({
        where: { id: clienteId },
      });
      if (!cliente) {
        return NextResponse.json(
          { message: "Paciente não encontrado" },
          { status: 404 }
        );
      }
    }

    const consultaAtualizada = await prisma.consulta.update({
      where: { id },
      data: {
        ...(dataHoraDate !== undefined && { dataHora: dataHoraDate }),
        ...(salaLocal !== undefined && { salaLocal }),
        ...(observacao !== undefined && { observacao }),
        ...(profissionalId !== undefined && { profissionalId }),
        ...(clienteId !== undefined && { clienteId }),
        ...(statusConsultaEnum !== undefined && { status: statusConsultaEnum }),
      },
    });

    return NextResponse.json(consultaAtualizada, { status: 200 });
  } catch (error: any) {
    console.error("Erro ao atualizar consulta:", error);

    if (error.code === "P2003") {
      return NextResponse.json(
        {
          message:
            "Falha na atualização: O Profissional ou o Paciente fornecido não foram encontrados no sistema.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Erro ao atualizar consulta" },
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

    const consulta = await prisma.consulta.findUnique({
      where: { id },
    });

    if (!consulta) {
      return NextResponse.json(
        { message: "Consulta não encontrada" },
        { status: 404 }
      );
    }

    await prisma.consulta.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Consulta excluída com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao excluir consulta:", error);
    return NextResponse.json(
      { message: "Erro ao excluir consulta" },
      { status: 500 }
    );
  }
}
