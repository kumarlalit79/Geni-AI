import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "Currency Convertor MCP Server",
  version: "1.0.0",
});

server.tool(
  "convertCurrency",
  "Convert amount from one currency to another",
  {
    amount: z.number().describe("Amount to convert for e.g. 100"),
    from: z.number().describe("Base currency code for e.g. USD"),
    to: z.number().describe("Target currency code for e.g. INR"),
  },
  async ({ amount, from, to }) => {
    try {

        const res = await fetch(`https://open.er-api.com/v6/latest/${from.toUpperCase()}`)
        const data = await res.json()

        const rates = data.rates[to.toUpperCase()]
        const converted = (amount * rates).toFixed(2)

        const result = `${amount} ${from.toUpperCase()} = ${converted} ${to.toUpperCase()}`

      return {
        content: [
          {
            type: "text",
            text: result,
          },
        ],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }],
      };
    }
  },
);

async function startServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP convert currency server started");
}

startServer().catch((error) => {
  console.error("failed to start MCP server", error);
  process.exit(1);
});
