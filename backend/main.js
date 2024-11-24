const express = require("express");
const router = require("./src/routes/routes");

const app = express();
const PORT = 8000;

app.use(router);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});