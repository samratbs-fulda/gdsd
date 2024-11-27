import axios from "axios";
import { getEnvironment } from "../utils/fetchEnvironment";

const environment = getEnvironment();
const apiUrl = environment.VITE_BACKEND;

export const getAllListings = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/listings`); // Assuming you have an endpoint like '/listings'
    return response.data.listings;
  } catch (error) {
    console.error("Failed to fetch listings:", error);
    throw error;
  }
};

export const searchListing = async (searchText, apartmentType) => {
  const payload = {
    params: {
      apartment_type: apartmentType,
      postal_code: searchText,
    }
  };

  try {
    const response = await axios.get(`${apiUrl}/api/listings/search`, payload);
    return response.data.listings;
  } catch (error) {
    console.error("API Request Failed:", error);
    throw error;
  }
};
