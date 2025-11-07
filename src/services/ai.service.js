const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({});

async function generateResponse(content) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: content,
  });
  return response.text;
}

//async function generateEmbedding(text) {
  // const response = await ai.models.embedContent({
  //   model: "gemini-embedding-001",
  //   contents: text,
  //   config:{
  //     outputDimensions: 768
  //   }
  // });
  // return response.embeddings[0].values;
//}
async function generateEmbedding(text) {
  const response = await ai.models.embedContent({
    model: "models/embedding-001",
    contents: text,
    config: {
      outputDimension: 768, // ✅ correct key + correct spelling
    },
  });

  return response.embeddings[0].values; // ✅ correct property
}
 module.exports = {
  generateResponse,
  generateEmbedding
 };