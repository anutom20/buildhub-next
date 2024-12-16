import { NextRequest, NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";
import db from "@/lib/db";

export async function GET(req: NextRequest) {
  const projectId = req.nextUrl.searchParams.get("projectId");

  if (!projectId) {
    return NextResponse.json(
      { message: "Project ID is required" },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  try {
    const project = await db.project.findUnique({
      where: { id: projectId },
      select: { current_phase: true },
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: StatusCodes.NOT_FOUND }
      );
    }

    return NextResponse.json({ currentPhase: project?.current_phase });
  } catch (error) {
    console.error("Error fetching project phase:", error);
    return NextResponse.json(
      { message: "Error fetching project phase" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
