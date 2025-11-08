const { GoogleGenAI } = require("@google/genai");
const { pipeline } = require("@xenova/transformers");

// Keep your existing Gemini setup
const ai = new GoogleGenAI({});

// 🧠 Keep your existing text generation function
async function generateResponse(content) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: content,
  });
  return response.text;
}

// 🧩 Embedding function using Transformers.js (pooling + normalize)
let embedder = null;

async function generateEmbedding(text) {
  if (!embedder) {
    // Use a 768-d model to match your Pinecone index
    const modelId = "Xenova/all-mpnet-base-v2";
    console.log("⏳ Loading embedding model...", modelId);
    embedder = await pipeline("feature-extraction", modelId);
    console.log("✅ Embedding model ready (768-d)");
  }

  // Compute a single 768-d sentence embedding (mean pooled, L2-normalized)
  const output = await embedder(text, { pooling: "mean", normalize: true });

  // Ensure we return a plain JS array for Pinecone
  return Array.from(output.data);
}

module.exports = {
  generateResponse,
  generateEmbedding,
};
