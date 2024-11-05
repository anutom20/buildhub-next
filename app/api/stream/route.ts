import { NextRequest, NextResponse } from "next/server";
import {
  GenerateContentStreamResult,
  GoogleGenerativeAI,
} from "@google/generative-ai";

import llmPrompts from "./prompts";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const {
      prompt,
      history,
      chatName,
    }: { prompt: string; history: any[]; chatName: string } = await req.json();

    if (!prompt || !history) {
      return NextResponse.json(
        { message: "prompt or history or chatName is missing" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let initialPromptHistory: any[] = [];

    if (chatName) {
      initialPromptHistory = [
        {
          role: "user",
          parts: [
            {
              text: llmPrompts[chatName],
            },
          ],
        },
        {
          role: "model",
          parts: [{ text: "Yes i will follow" }],
        },
      ];
    }

    const chatHistory = [...initialPromptHistory, ...history];

    const chat = model.startChat({
      history: chatHistory,
    });

    const result = await chat.sendMessageStream(prompt);

    const stream = makeStream(readStreamFromGemini(result));
    const response = new StreamingResponse(stream);
    return response;
  } catch (err) {
    return NextResponse.json({
      message: `An error occured while streaming = ${err}`,
    });
  }
}

/**
 * async generator that simulate a data fetch from external resource and
 * return chunck of data every second
 */
async function* readStreamFromGemini(
  result: GenerateContentStreamResult
): AsyncGenerator<string, void, unknown> {
  for await (const chunk of result.stream) {
    yield chunk.text();
  }
}

export const makeStream = <T extends string>(
  generator: AsyncGenerator<T, void, unknown>
) => {
  const encoder = new TextEncoder();
  return new ReadableStream<any>({
    async start(controller) {
      for await (let chunk of generator) {
        const chunkData = encoder.encode(chunk);
        controller.enqueue(chunkData);
      }
      controller.close();
    },
  });
};

/**
 * A custom Response subclass that accepts a ReadableStream.
 * This allows creating a streaming Response for async generators.
 */
class StreamingResponse extends Response {
  constructor(res: ReadableStream<any>, init?: ResponseInit) {
    super(res as any, {
      ...init,
      status: 200,
      headers: {
        ...init?.headers,
      },
    });
  }
}
