import axios from "axios";
import { getEnvironment } from "../utils/fetchEnvironment";

const environment = getEnvironment();
const apiUrl = environment.VITE_BACKEND;

export const getUserProfile = async (userId) => {
  try {
    const response = await axios.get(`${apiUrl}/api/users/profile/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user profile:", error.response?.data || error.message);
    throw error;
  }
};

export const updateUserProfile = async (userId, profileData) => {
  try {
    console.log("Updating profile for user:", userId, profileData);
    const response = await axios.patch(`${apiUrl}/api/users/profile/${userId}`, profileData);
    console.log("Profile updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to update user profile:", error.response?.data || error.message);
    throw error;
  }
};
