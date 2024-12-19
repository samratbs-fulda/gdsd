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
