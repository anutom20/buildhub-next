import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";
export async function GET(req: NextRequest) {
  const projectId = req.nextUrl.searchParams.get("projectId");

  if (!projectId) {
    return NextResponse.json(
      { message: "Project ID is required" },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  try {
    const contextBankData = await db.project.findUnique({
      where: {
        id: projectId,
      },
      select: {
        central_context_bank: true,
      },
    });

    if (!contextBankData) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: StatusCodes.NOT_FOUND }
      );
    }

    const centralContextBank = contextBankData?.central_context_bank;

    return NextResponse.json({ centralContextBank });
  } catch (error) {
    console.error("Error fetching context bank data:", error);
    return NextResponse.json(
      { message: "Error fetching context bank data" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
