import axios from "axios";
import { getEnvironment } from "../../utils/fetchEnvironment";

const environment = getEnvironment();
const apiUrl = environment.VITE_BACKEND;

export const getReviewListings = async (status) => {
  const payload = {
    params: {
      status: status,
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

export const updateListingStatus = async (listingId, status) => {
  try {
    const response = await axios.patch(`${apiUrl}/api/listings/status`, {
      listingId: listingId,
      status: status,
    });
    return response.data.updatedListing;
  } catch (error) {
    console.error("Failed to update listing status:", error);
    throw error;
  }
}