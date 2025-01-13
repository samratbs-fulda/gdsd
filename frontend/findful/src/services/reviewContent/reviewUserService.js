import axios from "axios";
import { getEnvironment } from "../../utils/fetchEnvironment";

const environment = getEnvironment();
const apiUrl = environment.VITE_BACKEND;

export const getReviewUsers = async (status) => {
  const payload = {
    params: {
      status: status,
    },
  };
  try {
    const response = await axios.get(`${apiUrl}/api/users/review`, payload);
    return response.data.users;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
};

export const updateUserStatus = async (userId, status) => {
  try {
    const response = await axios.patch(`${apiUrl}/api/users/status`, {
      userId: userId,
      status: status,
    });
    return response.data.updatedUser;
  } catch (error) {
    console.error("Failed to update user status:", error);
    throw error;
  }
}