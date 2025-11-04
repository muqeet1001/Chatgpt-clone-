const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
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
      console.log(user);
      
      socket.user = user;
      return next();
    } catch (err) {
      console.error("Socket authentication error:", err);
      return next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
}

module.exports = initSocketServer;
