 // Import the Pinecone library
const { Pinecone } = require('@pinecone-database/pinecone');

// Initialize Pinecone
const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

// Access your index
const chatGptindex = pc.index('chatgpt-index');

async function createMemory({ messageID, vectors, metadata }) {
  await chatGptindex.upsert([
    {
      id: messageID,
      values: vectors,
      metadata: metadata,
    },
  ]);
}

async function queryMemory({ queryVector, limit = 5, metadata }) {
  const data = await chatGptindex.query({
    vector: queryVector,
    topK: limit,
    filter: metadata ? metadata : undefined,
    includeValues: true,
    includeMetadata: true,
  });
  return data.matches;
}

module.exports = { createMemory, queryMemory };
