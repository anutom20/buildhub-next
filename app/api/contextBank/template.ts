export const getContextBankTemplatePrompt = (
  projectName: string,
  summary: string,
  chatName: string
) => {
  return ` 
  [Step Summary => ${summary}]
  
  You are a product roadmap creator from beginning to end . Below is the given format for the response you need to generate a central context bank that keeps track of all the steps:
  
  General information:
  Project Name : ${projectName}

  Following are the steps for the product roadmap generation , remember to address these steps in your response not in camel case but standard text:

  Step =>. ${chatName}
    {{summary}} -> create a more refined version of summary given above and put it here.

  summary should be divided into points for each lines . At the end of each line it should mention on which date the summary was created , i.e replace that with the date of your response
  the summary of each step is given in [] braces with step no mentioned
  no need to add more steps then given in the prompt .
  Also no need to mention that it is a central context bank.
  
  `;
};

export const updateContextBankTemplate = (
  prevContextBank: string,
  chatName: string,
  summary: string
) => {
  return `Given is the previous central context bank

  prev_context_bank : ${prevContextBank}
  
  [Step Summary => ${summary}]

  retain the entire previous context as it is without any change & add the below step with the following format:

  Step =>. ${chatName}
  
  {{summary}} -> create a more refined version of summary given above and put it here.

  summary should be divided into points for each lines . At the end of each line it should mention on which date the summary was created , i.e replace that with the date of your response
  the summary of each step is given in [] braces with step no mentioned
  no need to add more steps then given in the prompt .
  Also no need to mention that it is a central context bank.  

  VERY IMPORTANT => if the step is already present in the previous context , don't create the same step again. You may edit it's contents to refine the step.
  
  `;
};
