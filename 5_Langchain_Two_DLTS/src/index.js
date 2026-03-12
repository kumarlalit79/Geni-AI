import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { fileURLToPath } from "url";
import path from "path";

const __fileName = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__fileName)

async function main() {
  const pdfPath = path.resolve(__dirname, "../docs/RegistrationForm.pdf");

  const loader = new PDFLoader(pdfPath);
  const rawDocs = await loader.load();

  console.log("=== RAW DOCUMENT INFO ===");
  console.log(`Total pages loaded : ${rawDocs.length}`);
  console.log(`\nFirst page preview (first 300 chars):\n`);
  console.log(rawDocs[0].pageContent.slice(0, 300));
  console.log(`\nMetadata of first page:`, rawDocs[0].metadata);

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
  });

  const chunks = await splitter.splitDocuments(rawDocs);

  console.log("\n=== CHUNKS INFO ===");
  console.log(`Total chunks created: ${chunks.length}`);
  console.log(`\n--- First 3 chunks ---\n`);

  chunks.slice(0, 3).forEach((chunk, index) => {
    console.log(`\n[Chunk ${index + 1}]`);
    console.log(`Characters: ${chunk.pageContent.length}`);
    console.log(`Metadata:`, chunk.metadata);
    console.log(`Content:\n${chunk.pageContent}`);
    console.log("─".repeat(60));
  });
}

main().catch(console.error);
