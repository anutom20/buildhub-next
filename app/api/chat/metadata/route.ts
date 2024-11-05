import db from "@/lib/db";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { projectId, chatName } = await req.json();

    if (!projectId) {
      return NextResponse.json(
        { message: "projectId is required" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const chatMetadata = await db.chatMetadata.findFirst({
      where: {
        projectId,
        chatName,
      },
    });

    return NextResponse.json({ chatMetadata });
  } catch (err) {
    return NextResponse.json(
      {
        message: `An error = ${err} occured while getting chat metadata`,
      },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
