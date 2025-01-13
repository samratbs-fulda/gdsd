import axios from "axios";
import { getEnvironment } from "../../utils/fetchEnvironment";

const environment = getEnvironment();
const apiUrl = environment.VITE_BACKEND;

export const getListingsByLandlordId = async (landlordId) => {
  const payload = {
    params: {
      landlordId: landlordId,
    },
  };
  try {
    const response = await axios.get(`${apiUrl}/api/listings/review`, payload);
    return response.data.listings;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
};

// TODO: add edit listing service
