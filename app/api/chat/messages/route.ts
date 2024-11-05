import db from "@/lib/db";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { chatId } = await req.json();

    if (!chatId) {
      return NextResponse.json(
        { message: "chatId is required" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const chatHistory = await db.chats.findUnique({
      where: {
        id: chatId,
      },
      select: {
        messages: true,
      },
    });

    return NextResponse.json({ chatHistory });
  } catch (err) {
    return NextResponse.json(
      {
        message: `An error = ${err} occured while getting chat messages`,
      },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
