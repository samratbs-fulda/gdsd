require("dotenv-flow").config();

const express = require("express");
const cors = require("cors");
const prisma = require("./src/utils/db");
const router = require("./src/routes");

const app = express();
const PORT = process.env.PORT || 8000;

// Allow requests from the frontend
app.use(cors({ origin: "http://localhost:5174" }));

// helps in validating a successful database connection
async function startServer() {
  try {
    await prisma.$connect();
    app.listen(PORT, () => {
      console.log("Server is running on port 8000");
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
  }
}

app.use(express.json());
app.use("/api", router);

startServer();
