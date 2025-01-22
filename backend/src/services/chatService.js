const prisma = require("../utils/db");

class ChatService {
  async createChat(listingId) {
    try {
      const chat = await prisma.chat.create({
        data: {
          listingId,
        },
      });
      return chat;
    } catch (error) {
      throw Error("Failed to create chat.", error);
    }
  }

  async addChatParticipant(chatId, userId) {
    try {
      const chatParticipant = await prisma.chatParticipant.create({
        data: {
          chatId,
          userId,
        },
      });
      return chatParticipant;
    } catch (error) {
      throw Error("Failed to add chat participant.", error);
    }
  }

  async findUserChats(userId) {
    try {
      const chats = await prisma.chatParticipant.findMany({
        where: {
          userId,
        },
        include: {
          chat: {
            include: {
              ChatParticipant: {
                include: {
                  user: true, // Include details of all participants
                },
              },
            },
          },
        },
      });

      // return chats;

      // Transform chats to include recipient info
      const transformedChats = chats.map((chatParticipant) => {
        const chat = chatParticipant.chat;

        const participants = chat.ChatParticipant.map((p) => ({
          id: p.user.id,
          username: p.user.username,
        }));
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
      throw Error("Failed to get userChat.", error);
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
      throw Error("Failed to find chat by id.", error);
    }
  }
}

module.exports = ChatService;
