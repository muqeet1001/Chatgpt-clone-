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
    const queryOptions = {
        vector: queryVector,
        topK: limit,
        includeMetadata: true,
    };

    // Only add filter if metadata has keys
    if (metadata && Object.keys(metadata).length > 0) {
        queryOptions.filter = metadata;
    }

    const data = await chatGptindex.query(queryOptions);
    return data.matches;
}


module.exports = { createMemory, queryMemory };
