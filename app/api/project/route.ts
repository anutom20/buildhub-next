import { NextRequest, NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";
import db from "@/lib/db";

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const { name } = await req.json();

    const userId = req.headers.get("userId");

    if (!name || !userId) {
      return NextResponse.json(
        { message: "project name or userId is missing" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const alreadyExists = await db.project.findFirst({
      where: {
        name,
        userId,
      },
    });

    if (alreadyExists) {
      return NextResponse.json(
        { message: "project already exists" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const createdProject = await db.project.create({
      data: {
        name,
        userId,
      },
    });

    return NextResponse.json({ createdProject });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: `Error creating new project!` },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};
