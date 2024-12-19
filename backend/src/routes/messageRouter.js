const express = require("express");
const { MessageService } = require("../services");

const messageService = new MessageService();

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { chatId, senderId, content } = req.body;

    const newMessage = await messageService.createMessage(
      chatId,
      senderId,
      content
    );

    res.json(newMessage);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Failed to send the message.",
    });
  }
});

router.get("/:chatId", async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await messageService.getMessages(chatId);
    res.json(messages);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Failed to get the messages.",
    });
  }
});

module.exports = router;
