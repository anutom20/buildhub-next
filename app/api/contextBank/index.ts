import db from "@/lib/db";
import {
  getContextBankTemplatePrompt,
  updateContextBankTemplate,
} from "./template";
import { GenerativeModel } from "@google/generative-ai";
import { mainChatNames } from "../stream/prompts";

export const updateContextBank = async (
  projectId: string,
  projectName: string,
  summary: string,
  model: GenerativeModel | undefined,
  chatName: string,
  prevContextBank: string = ""
) => {
  try {
    if (!model) {
      return;
    }
    console.log(chatName);
    const prompt =
      chatName === mainChatNames[0]
        ? getContextBankTemplatePrompt(projectName, summary, chatName)
        : updateContextBankTemplate(prevContextBank, chatName, summary);
    const result = model.generateContent(prompt);

    const contextBankUpdatedText = (await result).response.text();

    await db.project.update({
      where: {
        id: projectId,
      },
      data: {
        central_context_bank: contextBankUpdatedText,
      },
    });
  } catch (err) {
    console.log(err);
  }
};
