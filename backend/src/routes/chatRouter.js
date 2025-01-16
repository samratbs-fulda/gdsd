const express = require("express");
const { ChatService } = require("../services");

const router = express.Router();

const chatService = new ChatService();

//createchat
router.post("/", async (req, res) => {
  try {
    const { user1Id, user2Id } = req.body;

    const chat = await chatService.createChat(user1Id, user2Id);
    res.json(chat);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Failed to create the listing.",
    });
  }
});

// finduserChats
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const chats = await chatService.findUserChats(parseInt(userId));
    res.json(chats);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Failed to find the chats.",
    });
  }
});

//findChatByIc
router.get("/chat-window/:chatId", async (req, res) => {
  const { chatId } = req.params;
  try {
    const chat = await chatService.findChatById(parseInt(chatId));
    res.json(chat);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Failed to find the chat.",
    });
  }
});

//findChat
router.get("/open/:user1Id/:user2Id", async (req, res) => {
  const { user1Id, user2Id } = req.params;
  try {
    const chats = await chatService.findChat(
      parseInt(user1Id),
      parseInt(user2Id)
    );
    res.json(chats);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Failed to find the chats.",
    });
  }
});

module.exports = router;
