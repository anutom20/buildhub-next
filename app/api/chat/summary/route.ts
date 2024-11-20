import db from "@/lib/db";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { updateContextBank } from "../../contextBank";

export async function POST(req: NextRequest) {
  try {
    const { projectName, projectId, chatId, chatHistory } = await req.json();

    if (!chatId || !chatHistory || !projectName || !projectId) {
      return NextResponse.json(
        {
          message:
            "either one of chatId , chatHistory , projectName or projectId is missing",
        },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro"];
    let result;

    let successfulModel;

    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });

        successfulModel = model;

        const chat = model.startChat({
          history: chatHistory,
        });

        result = await chat.sendMessage(
          `Generate a brief summary of the chat in a very structured manner. include points and whatever you feel makes the summary good and concise. Don't include heading or anything like chat summary which makes it apparent that it's a chat summary`
        );

        break;
      } catch (error: any) {
        console.error(`Error with model ${modelName}:`, error?.statusText);
      }
    }

    const summary = result?.response?.text() ?? "";

    await db.chats.update({
      where: {
        id: chatId,
      },
      data: {
        summary,
      },
    });

    const chatMetadata = await db.chatMetadata.findUnique({
      where: { chatId },
    });

    const curProject = await db.project.findUnique({
      where: { id: projectId },
      select: { central_context_bank: true },
    });

    await updateContextBank(
      projectId,
      projectName,
      summary,
      successfulModel,
      chatMetadata?.chatName!,
      curProject?.central_context_bank ?? ""
    );

    return NextResponse.json({
      message: `chat summary added successfully to chatId = ${chatId} , central context store updated`,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        message: `An error = ${err} occured while saving chat summary`,
      },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const chatName = searchParams.get("chatName");
    const projectId = searchParams.get("projectId");

    if (!chatName || !projectId) {
      return NextResponse.json(
        { message: "chatName or projectId is missing" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const metadata = await db.chatMetadata.findFirst({
      where: {
        chatName,
        projectId,
      },
      select: {
        chatId: true,
      },
    });
    if (!metadata) {
      return NextResponse.json({ summary: null });
    }

    const summary = await db.chats.findUnique({
      where: { id: metadata?.chatId },
    });

    return NextResponse.json({ summary });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: `An error = ${err} occured while getting chat summary` },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
