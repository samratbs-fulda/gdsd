const prisma = require("../utils/db");

class ChatService {
  async createChat(listingId, studentIds) {
    try {
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
    } catch (error) {
      console.error("Error creating chat:", error);
      throw new Error("Transaction failed: " + error.message);
    }
  }

  async findChatParticipants(chatId) {
    try {
      const chatParticipants = await prisma.chatParticipant.findMany({
        where: {
          chatId,
        },
        include: {
          user: true,
        },
      });
      return chatParticipants;
    } catch (error) {
      throw Error("Failed to find chat participants.", error);
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
      select: {
        id: true,
        createdAt: true,
        listing: {
          select: {
            id: true,
            title: true,
            landlordId: true,
          },
        },
        ChatParticipant: {
          select: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
    });

    // Transform chats to include recipient info
    const transformedChats = chats.map((chat) => {
      const participants = chat.ChatParticipant.map(
        (participant) => participant.user
      );

      return {
        id: chat.id,
        createdAt: chat.createdAt,
        listing: chat.listing,
        participants,
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
