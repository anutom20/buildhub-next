import { GenerativeModel } from "@google/generative-ai";
import axios from "axios";

export async function* redditSearch(
  central_context_bank: string,
  model: GenerativeModel
) {
  try {
    const result = await model.generateContent(
      `${central_context_bank}
      
       Identify the business idea of the user from the above text.
       Your output should be in 1-2 words

       e.g => lead generation , food delivery , sports hub
      `
    );

    const question = result.response.text();

    console.log("reddit_question", question);

    const response = await axios.get(
      `${process.env.REDDIT_API_BASE_URL}/get_posts_by_query?question=${question}`
    );

    yield JSON.stringify(response?.data?.posts);
  } catch (err) {
    console.log(err);
  }
}

export async function redditSummary(postUrl: string) {
  try {
    const response = await axios.get(
      `${process.env.REDDIT_API_BASE_URL}/generate_summary_prompt?post_url=${postUrl}`
    );

    return response?.data?.question;
  } catch (err) {
    console.log(err);
  }
}
