require("dotenv-flow").config();
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const morgan = require("morgan");
const prisma = require("./src/utils/db");
const router = require("./src/routes");
const jwt = require("jsonwebtoken");
const initializeSocket = require("./src/utils/socket");
const app = express();

const PORT = process.env.PORT || 8000;

// Allow requests from the frontend

const allowedOrigins = [
  "https://findful.us.to",
  "http://localhost:5174",
  "http://localhost:5173",
];
// const allowedOrigins = ["http://localhost:5174/"];

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
const io = initializeSocket(server, allowedOrigins);

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// helps in validating a successful database connection
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

startServer();
