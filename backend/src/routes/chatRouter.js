const express = require("express");
const { ChatService } = require("../services");

const router = express.Router();

const chatService = new ChatService();

//createchat
router.post("/", async (req, res) => {
  try {
    const { listingId, studentIds } = req.body;

    const chat = await chatService.createChat(listingId, studentIds);

    res.json(chat);
  } catch (error) {
    console.log(error);
    return;
  }
});

//addchatparticipant
router.post("/participant", async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    const chatParticipant = await chatService.addChatParticipant(
      chatId,
      userId
    );
    res.json(chatParticipant);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Failed to add chat participant.",
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
