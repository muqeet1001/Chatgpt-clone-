const app = require("./src/app");
const initSocketServer = require("./src/sockets/socket.server");
const httpServer = require("http").createServer(app);

initSocketServer(httpServer);

httpServer.listen(3000, () => {
  console.log("Server is running on port 3000");
});
