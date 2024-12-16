import db from "@/lib/db";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";
import { mainChatNames } from "@/app/api/stream/prompts";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { message: "projectId is required" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const chatMetadataList = await db.chatMetadata.findMany({
      where: {
        projectId,
      },
    });

    const normalChats = chatMetadataList.filter(
      (chat) => !mainChatNames.includes(chat.chatName)
    );

    return NextResponse.json({ normalChats });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        message: `An error = ${err} occurred while fetching chat metadata`,
      },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
