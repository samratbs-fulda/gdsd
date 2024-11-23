require("dotenv-flow").config();

const express = require("express");
const router = require("./src/routes/routes");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

app.use(router);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
