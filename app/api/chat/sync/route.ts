import { NextRequest, NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";
import db from "@/lib/db";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { messages, projectId, chatId, chatName } = await req.json();

    const userId = req.headers.get("userId");

    if (!messages || !projectId || !userId) {
      return NextResponse.json(
        { message: "either one of messages/projectId/userId is missing" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    if (chatId) {
      await db.chats.update({
        where: {
          id: chatId,
        },
        data: {
          messages,
        },
      });
    } else {
      const chat = await db.chats.create({
        data: {
          messages,
        },
      });
      await db.chatMetadata.create({
        data: {
          projectId,
          userId,
          chatId: chat.id,
          chatName,
        },
      });
    }

    return NextResponse.json({ message: `Chat sync successful` });
  } catch (err) {
    return NextResponse.json(
      {
        message: `An error ${err} occured during saving of chats`,
      },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
