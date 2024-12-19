require("dotenv-flow").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const morgan = require("morgan");
const prisma = require("./src/utils/db");
const router = require("./src/routes");
const profileRouter = require("./src/routes/profileRouter"); 
const jwt = require("jsonwebtoken");
const app = express();

const PORT = process.env.PORT || 8000;

// Allow requests from the frontend
const allowedOrigins = [
  "https://findful.us.to",
  "http://localhost:5174",
  "http://localhost:5173",
];

const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(cookieParser());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("invalid token"));
  }

  const decodedToken = jwt.decode(token);
  const currentTime = Date.now() / 1000;

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

io.on("connection", (socket) => {
  console.log("SOCKET CONNECTED", socket.user.id);

  socket.on("message", (message) => {
    console.log("message received", message);
    io.emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log("SOCKET DISCONNECTED");
  });
});

// Helps in validating a successful database connection
async function startServer() {
  try {
    await prisma.$connect();
    server.listen(PORT, () => {
      console.log("Server is running on port", PORT);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
  }
}

app.use(express.json());
app.use("/api", router);
app.use("/profile", profileRouter);

startServer();
