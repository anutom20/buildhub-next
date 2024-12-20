import { NextRequest, NextResponse } from "next/server";
import {
  GenerateContentStreamResult,
  GoogleGenerativeAI,
} from "@google/generative-ai";

import llmPrompts, { mainChatNames } from "./prompts";
import db from "@/lib/db";
import { redditSearch, redditSummary } from "./reddit";
import { StatusCodes } from "http-status-codes";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const {
      generateRedditSummary,
      postUrl,
      prompt,
      projectId,
      history,
      chatName,
      includeProjectHistory,
    }: {
      prompt: string;
      history: any[];
      chatName: string;
      projectId: string;
      generateRedditSummary?: string;
      postUrl?: string;
      includeProjectHistory?: boolean;
    } = await req.json();

    if (!prompt || !history || !projectId || !chatName) {
      return NextResponse.json(
        { message: "prompt or history or chatName or projectId is missing" },
        { status: 400 }
      );
    }

    const normalChat: boolean = !mainChatNames.some(
      (name) => chatName === name
    );

    let needPrevStepContext = false,
      doRedditSearch = false;

    if (prompt.includes("do_reddit_search") && chatName === mainChatNames[1])
      doRedditSearch = true;

    if (
      mainChatNames.slice(1).some((name) => chatName === name) ||
      (includeProjectHistory && normalChat)
    ) {
      needPrevStepContext = true;
    }

    let initialPrompt =
      normalChat && includeProjectHistory
        ? llmPrompts.normalChatPromptUseProjectMemory
        : llmPrompts[chatName];

    let curProject;

    if (needPrevStepContext) {
      if (normalChat) {
      }
      curProject = await db.project.findUnique({
        where: {
          id: projectId,
        },
        select: { central_context_bank: true },
      });
      initialPrompt = initialPrompt.replace(
        "{{context_of_prev_steps}}",
        curProject?.central_context_bank ?? ""
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro"];
    const modelIndex = Math.floor(Math.random() * models.length); // Randomly select a model
    const model = genAI.getGenerativeModel({ model: models[modelIndex] });

    let initialPromptHistory: any[] = [];

    if (chatName) {
      initialPromptHistory = [
        {
          role: "user",
          parts: [
            {
              text: initialPrompt,
            },
          ],
        },
        {
          role: "model",
          parts: [{ text: "Yes i will follow" }],
        },
      ];
    }

    const chatHistory =
      normalChat && !includeProjectHistory
        ? [...history]
        : [...initialPromptHistory, ...history];

    if (doRedditSearch) {
      const stream = makeStream(
        redditSearch(
          curProject?.central_context_bank ?? "use any business idea",
          model
        )
      );
      const response = new StreamingResponse(stream);
      return response;
    }

    let summaryPrompt;
    if (generateRedditSummary && postUrl) {
      summaryPrompt = await redditSummary(postUrl);
    }

    const finalPrompt = summaryPrompt
      ? `${summaryPrompt} . 
      Then continue the conversation by saying something small that makes user think that you're still there guiding them`
      : prompt;

    let result;

    console.log("finalPrompt", finalPrompt);

    console.log("chatHistory", chatHistory);

    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });

        const chat = model.startChat({ history: chatHistory });
        result = await chat.sendMessageStream(finalPrompt);

        break;
      } catch (error: any) {
        console.error(`Error with model ${modelName}:`, error);
      }
    }

    if (!result) {
      return NextResponse.json(
        { message: "An error occured. Please try again" },
        { status: StatusCodes.INTERNAL_SERVER_ERROR }
      );
    }

    const stream = makeStream(readStreamFromGemini(result));
    const response = new StreamingResponse(stream);
    return response;
  } catch (err: any) {
    console.log(err);
    return NextResponse.json(
      {
        message: "An unexpected error occured. Please try again",
      },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
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

const makeStream = <T extends string>(
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
