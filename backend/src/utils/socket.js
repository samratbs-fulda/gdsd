const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const initializeSocket = (server, allowedOrigins) => {
  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
    },
  });

  //middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("invalid token"));
    }

    // Decode the token to check its expiration
    const decodedToken = jwt.decode(token);
    const currentTime = Date.now() / 1000; // Current time in seconds

    // Check if the token has expired
    if (decodedToken && decodedToken.exp < currentTime) {
      return next(new Error("token expired"));
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (!user) {
      return next(new Error("invalid token"));
    }
    socket.user = user;
    next();
  });

  //connect
  io.on("connection", (socket) => {
    console.log("SOCKET CONNECTED", socket.user.id);

    //listen for incoming messages
    socket.on("message", (message) => {
      console.log("message received", message);

      io.emit("message", message);
    });

    socket.on("disconnect", () => {
      console.log("SOCKET DISCONNECTED");
    });
  });

  return io;
};

module.exports = initializeSocket;
