import axios from "axios";
import { getEnvironment } from "../../utils/fetchEnvironment";

const environment = getEnvironment();
const apiUrl = environment.VITE_BACKEND;

export const getReviewListings = async (status) => {
  try {
    const response = await axios.get(`${apiUrl}/api/listings/review/${status}`);
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