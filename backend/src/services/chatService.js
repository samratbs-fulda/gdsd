const prisma = require("../utils/db");

class ChatService {
  async createChat(user1Id, user2Id) {
    try {
      const chat = await prisma.chat.create({
        data: {
          user1Id: user1Id,
          user2Id: user2Id,
        },
      });
      return chat;
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  async findUserChats(userId) {
    try {
      const chats = await prisma.chat.findMany({
        where: {
          OR: [
            {
              user1Id: userId,
            },
            {
              user2Id: userId,
            },
          ],
        },
        include: {
          user1: true, // Include user1 details
          user2: true, // Include user2 details
        },
      });

      // Transform chats to include recipient info
      const transformedChats = chats.map((chat) => {
        const recipient = chat.user1Id === userId ? chat.user2 : chat.user1;

        return {
          id: chat.id,
          user1Id: chat.user1Id,
          user2Id: chat.user2Id,
          createdAt: chat.createdAt,
          recipientId: recipient.id,
          recipientUsername: recipient.username,
        };
      });
      return transformedChats;
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  async findChatById(chatId) {
    try {
      console.log("chatId", chatId);
      const chat = await prisma.chat.findUnique({
        where: {
          id: chatId,
        },
      });
      return chat;
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  async findChat(user1Id, user2Id) {
    try {
      const chat = await prisma.chat.findFirst({
        where: {
          OR: [
            {
              user1Id: user1Id,
              user2Id: user2Id,
            },
            {
              user1Id: user2Id,
              user2Id: user1Id,
            },
          ],
        },
      });
      console.log("chat", chat);
      return chat;
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }
}

module.exports = ChatService;
