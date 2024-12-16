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
    console.log(err);
    return NextResponse.json(
      {
        message: `An error = ${err} occured while getting chat metadata`,
      },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { chatId } = await req.json();

    if (!chatId) {
      return NextResponse.json(
        { message: "chatId is required" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const updatedChatMetadata = await db.chatMetadata.update({
      where: { chatId },
      data: { completed: true },
    });

    return NextResponse.json({ updatedChatMetadata });
  } catch (err) {
    return NextResponse.json(
      {
        message: `An error = ${err} occurred while updating chat metadata`,
      },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
