require("dotenv-flow").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const prisma = require("./src/utils/db");
const router = require("./src/routes");

const app = express();
const PORT = process.env.PORT || 8000;

// Allow requests from the frontend
const allowedOrigins = ['https://findful.us.to'];

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};

app.use(cors(corsOptions));
app.use(morgan("dev"));

// helps in validating a successful database connection
async function startServer() {
  try {
    await prisma.$connect();
    app.listen(PORT, () => {
      console.log("Server is running on port", PORT);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
  }
}

app.use(express.json());
app.use("/api", router);

startServer();
