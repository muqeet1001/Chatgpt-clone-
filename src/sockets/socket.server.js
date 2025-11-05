const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { generateResponse } = require("../services/ai.service");
const messageModel = require("../models/message.model");

function initSocketServer(httpServer) {
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
     console.log(messagePayload.content);
      await messageModel.create({
        chat: messagePayload.chat,
        user: socket.user._id,
        content: messagePayload.content,
        role: "user"
      })
      const chatHistory = await messageModel.find({
        chat: messagePayload.chat
      })
      

      const aiResponse = await generateResponse(chatHistory.map(item =>{
        return { role: item.role, parts:[{text:item.content}] };
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
