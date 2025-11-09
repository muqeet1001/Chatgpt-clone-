const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { generateResponse } = require("../services/ai.service");
const messageModel = require("../models/message.model");
const { queryMemory, createMemory } = require("../services/vector.service");
const { generateEmbedding } = require("../services/ai.service");
async function initSocketServer(httpServer) {
  const io = new Server(httpServer, {});
  io.use(async (socket, next) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
      const token = cookies.token;
      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      if (!user) {
        console.error("Socket auth: user not found for decoded token:", decoded);
        return next(new Error("Authentication error: User not found"));
      }

      socket.user = user;
      return next();
    } catch (err) {
      console.error("Socket authentication error:", err);
      return next(new Error("Authentication error"));
    }
  });
  io.on("connection", (socket) => {
    socket.on("ai-message", async (messagePayload) => {
      try {
        if (typeof messagePayload === "string") {
          messagePayload = JSON.parse(messagePayload);
        }
        
        // Validate that content is not empty
        if (!messagePayload.content || !messagePayload.content.trim()) {
          socket.emit("error", { message: "Message content cannot be empty" });
          return;
        }
      
      const userMessage = await messageModel.create({
        chat: messagePayload.chat,
        user: socket.user._id,
        content: messagePayload.content,
        role: "user"
      });
      const vectors = await generateEmbedding(messagePayload.content);
      const similarMessages = await queryMemory({
        queryVector: vectors,
        limit: 5,
        metadata: { chat: messagePayload.chat }
      });

      // Build retrieval context from matched message IDs
      const matchIds = (similarMessages || []).map(m => m.id);
      const contextDocs = matchIds.length ? await messageModel.find({ _id: { $in: matchIds } }).lean() : [];
      const contextText = contextDocs.map(doc => `- ${doc.role}: ${doc.content}`).join("\n");

      await createMemory({
        vector: vectors,
        metadata: {
          chat: messagePayload.chat,
          user: socket.user._id,
          text: messagePayload.content
        },
        // Use the actual message id to keep vectors unique per message
        messageId: String(userMessage._id)

      });

      // Recent chat history in chronological order
      const chatHistory = await messageModel
        .find({ chat: messagePayload.chat })
        .sort({ createdAt: 1 })
        .limit(20)
        .lean();

      const prelude = {
        role: "user",
        parts: [{ text: `Use the following context to answer the user's latest question. If the answer isn't in the context, say you don't know.\n\nContext:\n${contextText}` }]
      };

      const contents = [prelude, ...chatHistory.map(item => ({ role: item.role, parts: [{ text: item.content }] }))];

      const aiResponse = await generateResponse(contents);

      // Handle empty AI response
      if (!aiResponse || !aiResponse.trim()) {
        socket.emit("ai-response", {
          content: "I apologize, but I couldn't generate a response. Please try again.",
          chat: messagePayload.chat
        });
        return;
      }

      const responseMessage = await messageModel.create({
        chat: messagePayload.chat,
        user: socket.user._id,
        content: aiResponse,
        role: "model"
      });

      const responseVectors = await generateEmbedding(aiResponse);
      await createMemory({
        vector: responseVectors,
        metadata: {
          chat: messagePayload.chat,
          user: socket.user._id,
          text: aiResponse
        },
        messageId: String(responseMessage._id) + "-response"
      });

      socket.emit("ai-response", {
        content: aiResponse,
        chat: messagePayload.chat
      });
      } catch (error) {
        console.error("Error processing AI message:", error);
        socket.emit("error", { 
          message: "An error occurred while processing your message. Please try again." 
        });
      }
    })
  });
}

module.exports = initSocketServer;
