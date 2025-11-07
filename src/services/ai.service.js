const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({});

async function generateResponse(content) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: content,
  });
  return response.text;
}

async function generateEmbedding(text) {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: text,
    confiq:{
      outputDimensions: 768
    }
  });
  return response.embeddings;
}
 module.exports = {
  generateResponse,
  generateEmbedding
 };