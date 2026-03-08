import { config } from "dotenv";
config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const model = new ChatGoogleGenerativeAI({
  model: "models/gemini-2.5-flash-lite",
  maxOutputTokens: 2048,
  temperature: 0.7,
  apiKey: process.env.API_KEY,
});

const prompt = PromptTemplate.fromTemplate(
  "You are a helpfull assistant. Answer the {question}",
);

const outputParser = new StringOutputParser()

const chain = prompt.pipe(model).pipe(outputParser);

const response = await chain.invoke({
    question: "What is the future of AI in Healthcare?"
})
console.log(response)