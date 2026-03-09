import express from "express";
import { config } from "dotenv";
config();
import path from "path"

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
  AgentExecutor,
  createToolCallingAgent,
} from "@langchain/classic/agents";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";

const app = express();
app.use(express.json());

const __dirname = path.resolve()

const model = new ChatGoogleGenerativeAI({
  model: "models/gemini-2.5-flash-lite",
  maxOutputTokens: 2048,
  temperature: 0.7,
  apiKey: process.env.GEMINI_API_KEY,
});

const getMenuTool = new DynamicStructuredTool({
  name: "getMenuTool",
  description:
    "Returns the final answer for today's menu for the given category (breakfast, lunch, dinner). Use this tool when the user asks about today's breakfast, lunch, or dinner menu.",
  schema: z.object({
    category: z
      .string()
      .describe("Type of food. Example: breakfast, lunch, dinner"),
  }),
  func: async ({ category }) => {
    const menus = {
      breakfast: "Paneer paratha, Chai",
      lunch: "Paneer Butter masala, rajma , rice",
      dinner: "Sabji, roti, dahi, Gulab jamun",
    };
    return menus[category.toLowerCase()] || "No menu found for the category";
  },
});

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are helpful assistant that uses tools when needed."],
  ["human", "{input}"],
  ["placeholder", "{agent_scratchpad}"],
]);

const agent = await createToolCallingAgent({
  llm: model,
  tools: [getMenuTool],
  prompt: prompt,
});

const executor = await AgentExecutor.fromAgentAndTools({
  agent,
  tools: [getMenuTool],
  verbose: true,
  maxIterations: 10
})

app.get("/" , (req,res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.post("/api/chat", async (req,res) => {
  const userInput = req.body.input
  console.log("userInput - ", userInput)
  try {
    
    const response = await executor.invoke({input: userInput})
    console.log("Agent full response - " , response)

    if(response.output) {
      return res.json({
        message: response.output
      })
    }
    res.status(400).json({
      message: "Agent could not find answer  "
    })

  } catch (error) {
    console.log("Error during agent execution: ", error)
    res.status(500).json({
      message: "Error during agent execution  "
    })
  }
})

const port = process.env.PORT || 2000;

app.listen(port, () => console.log(`server is running on port ${port}`));
