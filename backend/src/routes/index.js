const express = require("express");
const listingRouter = require("./listingRouter");
const userRouter = require("./userRouter");
const chatRouter = require("./chatRouter");
const messageRouter = require("./messageRouter");

const router = express.Router();

// Use the listing routes
router.use("/listings", listingRouter);
router.use("/users", userRouter);

// message routes
router.use("/chats", chatRouter);
router.use("/messages", messageRouter);

//Add other routes here. Eg: userRouter
router.get("/", (req, res) => {
  res.send("Welcome to FindFul");
});

module.exports = router;
