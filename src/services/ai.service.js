 const { GoogleGenAI } = require("@google/genai");
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const ai = new GoogleGenAI({});

async function generateResponse(content) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: content,
  });
  return response.text;
}

async function generateEmbedding(text) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",  
    input: text
  });

  // ✅ Correct property
  return response.data[0].embedding;
}

module.exports = {
  generateResponse,
  generateEmbedding
};
