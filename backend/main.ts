import express, { Express } from "express";
import router from "./src/routes/routes";

const app: Express = express();
const PORT = 8000;

// Use the router for all routes
app.use(router);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});