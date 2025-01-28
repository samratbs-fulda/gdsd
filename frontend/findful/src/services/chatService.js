import axios from "axios";
import { getEnvironment } from "../utils/fetchEnvironment";

const environment = getEnvironment();
const apiUrl = environment.VITE_BACKEND;

export const getUserChats = async (userId) => {
  try {
    const response = await axios.get(`${apiUrl}/api/chats/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch chats:", error);
    throw error;
  }
};

export const createUserChats = async (listingId, studentIds) => {
  try {
    const response = await axios.post(`${apiUrl}/api/chats`, {
      listingId,
      studentIds,
    });
    console.log("response", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to create chat:", error);
    throw error;
  }
};

export const getChatParticipants = async (chatId) => {
  try {
    const response = await axios.get(
      `${apiUrl}/api/chats/participants/${chatId}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch chat participants:", error);
    throw error;
  }
};

export const getMessages = async (chatId) => {
  try {
    const response = await axios.get(`${apiUrl}/api/messages/${chatId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    throw error;
  }
};

export const createMessages = async (chatId, senderId, content) => {
  try {
    const response = await axios.post(`${apiUrl}/api/messages`, {
      chatId,
      senderId,
      content,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to create message:", error);
    throw error;
  }
};
