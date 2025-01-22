const prisma = require("../utils/db");

class ChatService {
  async createChat(listingId, studentIds) {
    return await prisma.$transaction(async (prisma) => {
      // Get the listing with the landlordId
      const listing = await prisma.listing.findUnique({
        where: {
          id: listingId,
        },
        select: {
          landlordId: true,
        },
      });

      if (!listing) {
        throw new Error("Listing not found");
      }

      //create the chat
      const newChat = await prisma.chat.create({
        data: {
          listingId,
        },
      });

      // add landlord as participant
      await prisma.chatParticipant.create({
        data: {
          chatId: newChat.id,
          userId: listing.landlordId,
        },
      });

      // Add all student participants
      await prisma.chatParticipant.createMany({
        data: studentIds.map((studentId) => ({
          chatId: newChat.id,
          userId: studentId,
        })),
      });

      return newChat;
    });
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
    const chats = await prisma.chat.findMany({
      where: {
        ChatParticipant: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        listing: true,
        ChatParticipant: {
          include: {
            user: true,
          },
        },
      },
    });

    // Transform chats to include recipient info
    const transformedChats = chats.map((chat) => {
      // Find the other participant (not the current user)
      const otherParticipant = chat.ChatParticipant.find(
        (participant) => participant.userId !== userId
      );

      return {
        id: chat.id,
        listingId: chat.listingId,
        createdAt: chat.createdAt,
        recipientId: otherParticipant?.userId,
        recipientUsername: otherParticipant?.user.username,
        listing: chat.listing,
      };
    });

    return transformedChats;
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
