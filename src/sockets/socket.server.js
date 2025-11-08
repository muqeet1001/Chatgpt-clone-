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

      if (typeof messagePayload === "string") {
        messagePayload = JSON.parse(messagePayload);
      }
      const userMessage = await messageModel.create({
        chat: messagePayload.chat,
        user: socket.user._id,
        content: messagePayload.content,
        role: "user"
      });
      const vectors = await generateEmbedding(messagePayload.content);
      await createMemory({
       vector: vectors,
       metadata:{
          chat: messagePayload.chat,
          user: socket.user._id
       },
       // Use the actual message id to keep vectors unique per message
       messageId: String(userMessage._id)

      });

      const chatHistory = (await messageModel.find({
        chat: messagePayload.chat
      }).sort({ createdAt: 1 }).limit(20).lean()).reverse();

      
      const aiResponse = await generateResponse(chatHistory.map(item => {
        return { role: item.role, parts: [{ text: item.content }] };
      }));

      await messageModel.create({
        chat: messagePayload.chat,
        user: socket.user._id,
        content: aiResponse,
        role: "model"
      });

      socket.emit("ai-response", {
        content: aiResponse,
        chat: messagePayload.chat
      });
    })
  });
}

module.exports = initSocketServer;
