import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";
import { userPersonaPrompt } from "../stream/prompts";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function POST(req: NextRequest) {
  try {
    const { chatHistory }: { chatHistory: any[] } = await req.json();

    if (!chatHistory) {
      return NextResponse.json(
        { message: "chatHistory is missing" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const prompt = userPersonaPrompt(chatHistory);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);

    return result.response.text();
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: `error while creating user persona = ${err}` },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
