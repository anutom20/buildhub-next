import db from "@/lib/db";
import { getContextBankTemplatePrompt } from "./template";
import { GenerativeModel } from "@google/generative-ai";

export const updateContextBank = async (
  projectId: string,
  projectName: string,
  summary: string,
  model: GenerativeModel
) => {
  try {
    const prompt = getContextBankTemplatePrompt(projectName, summary);
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
