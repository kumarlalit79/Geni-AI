import { config } from "dotenv";
config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";

// step 2 - setup the model
const model = new ChatGoogleGenerativeAI({
  model: "models/gemini-2.5-flash-lite",
  maxOutputTokens: 2048,
  temperature: 0.7,
  apiKey: process.env.API_KEY,
});

// step 3 - create prompt
const prompt = PromptTemplate.fromTemplate(
    "You are a helpfull assistant. Answer the {question}"
)

// step 4 : Create chain using LCEL
const chain = prompt.pipe(model)

// step 5 : call kardo
const response = await chain.invoke({
    question: "What is the future of AI in Healthcare? (in 2 line)"
})

console.log(response.text)