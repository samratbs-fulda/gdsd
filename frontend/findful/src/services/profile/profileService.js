import axios from "axios";
import { getEnvironment } from "../../utils/fetchEnvironment";

const environment = getEnvironment();
const apiUrl = environment.VITE_BACKEND;

export const getUserProfile = async (userId) => {
  if (!userId) throw new Error("User ID is required");

  console.log("Fetching Profile for User ID:", userId);

  try {
    const response = await axios.get(`${apiUrl}/api/users/profile/${userId}`);
    console.log("Profile Data Received:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user profile:", error.response?.data || error.message);
    throw error;
  }
};


export const updateUserProfile = async (userId, profileData) => {
  console.log("Sending Update Request for User ID:", userId);

  try {
    const response = await axios.patch(`${apiUrl}/api/users/profile/${userId}`, profileData);
    console.log("Profile Updated Successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to update user profile:", error.response?.data || error.message);
    throw error;
  }
};