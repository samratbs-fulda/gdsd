const prisma = require("../utils/db");

class MessageService {
  async createMessage(chatId, senderId, content) {
    try {
      const message = await prisma.messages.create({
        data: {
          chatId: chatId,
          senderId: senderId,
          content: content,
        },
      });
      return message;
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  async getMessages(chatId) {
    try {
      const messages = await prisma.messages.findMany({
        where: {
          chatId: parseInt(chatId),
        },
      });
      return messages;
    } catch (error) {
      console.error("Error getting messages:", error);
    }
  }
}

module.exports = MessageService;
