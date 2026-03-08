import { config } from "dotenv";
config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { initializeAgentExecutorWithOptions } from "@langchain/classic/agents";
import { SerpAPI } from "@langchain/community/tools/serpapi";

// step 2
const model = new ChatGoogleGenerativeAI({
  model: "models/gemini-2.5-flash-lite",
  maxOutputTokens: 2048,
  temperature: 0.7,
  apiKey: process.env.API_KEY,
});

// step 3 - directly using built in tools
const searchTool = new SerpAPI(process.env.SERP_API_KEY, {
  location: "India",
});

// step 4 - Built agent
const agent = await initializeAgentExecutorWithOptions(
    [searchTool],
    model
)

// step 5 - try a question
const res = await agent.invoke({
    input: "What is the latest new about AI? (in 5 lines)"
})

console.log(res.output)