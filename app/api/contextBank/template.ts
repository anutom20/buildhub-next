import { viewNames } from "@/components/Static";

export const getContextBankTemplatePrompt = (
  projectName: string,
  summary: any
) => {
  return ` 
  [Step 1 Summary => ${summary[viewNames.IDENTIFY_A_NEED]}]
  
  You are a product roadmap creator from beginning to end . Below is the given format for the response you need to generate a central context bank that keeps track of all the steps:
  
  General information:
  Project Name : ${projectName}

  Following are the steps for the product roadmap generation , remember to address these steps in your response not in camel case but standard text:

  1. ${viewNames.IDENTIFY_A_NEED}
    {{summary}}

  summary should be divided into points for each lines . At the end of each line it should mention on which date the summary was created
  
  `;
};
