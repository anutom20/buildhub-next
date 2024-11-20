import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";
import { userPersonaPrompt } from "../stream/prompts";
import { GoogleGenerativeAI } from "@google/generative-ai";
import db from "@/lib/db";
import UserPersona from "@/components/UserPersona";

export async function POST(req: NextRequest) {
  try {
    const {
      chatHistory,
      projectId,
    }: { chatHistory: any[]; projectId: string } = await req.json();

    if (!chatHistory || !projectId) {
      return NextResponse.json(
        { message: "chatHistory or projectId is missing" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const prompt = userPersonaPrompt(chatHistory);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);

    console.log(result.response.text());

    const userPersonaJson = extractJson(result.response.text());

    if (userPersonaJson) {
      await db.project.update({
        where: {
          id: projectId,
        },
        data: {
          user_persona: userPersonaJson,
        },
      });
    }

    return NextResponse.json({ message: "success" });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: `error while creating user persona = ${err}` },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { message: "projectId missing" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const project = await db.project.findUnique({
      where: {
        id: projectId,
      },
      select: {
        user_persona: true,
      },
    });

    if (!project?.user_persona) {
      return NextResponse.json({ userPersona: null });
    }

    return NextResponse.json({ userPersona: project?.user_persona });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: `error while fetching user persona = ${err}` },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
};

function extractJson(text: string) {
  const jsonPattern = /\s*(\{(?:[^{}]*|\{[^{}]*\})*\})\s*/;
  const match = text.match(jsonPattern);
  if (match) {
    try {
      return JSON.parse(match[1]);
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  return null;
}
