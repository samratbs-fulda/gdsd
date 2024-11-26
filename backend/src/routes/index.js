const express = require("express");
const listingRouter = require("./listingRouter");

const router = express.Router();

// Use the listing routes
router.use("/listings", listingRouter);

//Add other routes here. Eg: userRouter
router.get("/", (req, res) => {
  res.send("Welcome to FindFul");
});

module.exports = router;
