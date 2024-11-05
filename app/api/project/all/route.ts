import db from "@/lib/db";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, res: NextResponse) => {
  const userId = req.headers.get("userId");
  try {
    if (!userId) {
      return NextResponse.json(
        { message: "userId is required" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const projects = await db.project.findMany({
      where: {
        userId,
      },
      select: { name: true, id: true },
    });

    return NextResponse.json({ projects });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: `Error fetching project names` },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};
