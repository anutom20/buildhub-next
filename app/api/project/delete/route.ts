import { NextRequest, NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";
import db from "@/lib/db";

export const DELETE = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;

    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { message: "projectId is missing" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const alreadyExists = await db.project.findUnique({
      where: {
        id: projectId,
      },
    });

    if (!alreadyExists) {
      return NextResponse.json(
        { message: "project does not exist" },
        { status: StatusCodes.NOT_FOUND }
      );
    }

    await db.project.delete({
      where: {
        id: projectId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: `Error creating new project!` },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};
