import dotenv from "dotenv";
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { LLMChain } from "@langchain/classic/chains";
import { PromptTemplate } from "@langchain/core/prompts";

// step 2 - model setup
const model = new ChatGoogleGenerativeAI({
  model: "models/gemini-2.5-flash-lite",
  maxOutputTokens: 2048,
  temperature: 0.7,
  apiKey: process.env.API_KEY,
});

// step 3 - create prompt
const prompt = PromptTemplate.fromTemplate(
  "Explain the concept of {topic} to a begineer in 2 lines",
);

// step 4 - build a chain
const chain = new LLMChain({
  llm: model,
  prompt: prompt,
});

// step 5 - use chain
const res = await chain.run("React js")
console.log("Gemini Response - " , res)
