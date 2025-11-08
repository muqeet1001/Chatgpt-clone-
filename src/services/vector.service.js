// Import the Pinecone library
const { Pinecone } = require('@pinecone-database/pinecone');

// Initialize Pinecone
const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
});

// Access your index
const chatGptindex = pc.index('chartgpt');

async function createMemory({ vector, metadata,messageId }) {
    await chatGptindex.upsert([
        {
            id:messageId,
            values:vector,
            metadata
        },
    ]);
}

async function queryMemory({ queryVector, limit = 5, metadata }) {
    const data = await chatGptindex.query({
        vector: queryVector,
        topK: limit,
        // Pass metadata fields directly; do not wrap inside { metadata: ... }
        filter: metadata || undefined,
        includeMetadata: true,
    });
    return data.matches;
}

module.exports = { createMemory, queryMemory };
