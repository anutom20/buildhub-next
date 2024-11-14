import { NextRequest, NextResponse } from "next/server";
import {
  GenerateContentStreamResult,
  GoogleGenerativeAI,
} from "@google/generative-ai";

import llmPrompts, { mainChatNames } from "./prompts";
import db from "@/lib/db";
import { redditSearch, redditSummary } from "./reddit";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const {
      generateRedditSummary,
      postUrl,
      prompt,
      projectId,
      history,
      chatName,
    }: {
      prompt: string;
      history: any[];
      chatName: string;
      projectId: string;
      generateRedditSummary?: string;
      postUrl?: string;
    } = await req.json();

    if (!prompt || !history || !projectId || !chatName) {
      return NextResponse.json(
        { message: "prompt or history or chatName or projectId is missing" },
        { status: 400 }
      );
    }

    let needPrevStepContext = false,
      doRedditSearch = false;

    if (prompt.includes("do_reddit_search") && chatName === mainChatNames[1])
      doRedditSearch = true;

    if (mainChatNames.slice(1).some((name) => chatName === name)) {
      needPrevStepContext = true;
    }

    let initialPrompt = llmPrompts[chatName];

    let curProject;

    if (needPrevStepContext) {
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

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

    const chatHistory = [...initialPromptHistory, ...history];

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

    const chat = model.startChat({
      history: chatHistory,
    });

    const finalPrompt = summaryPrompt
      ? `${summaryPrompt} . 
      Then continue the conversation by saying something small that makes user think that you're still there guiding them`
      : prompt;

    const result = await chat.sendMessageStream(finalPrompt);

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
