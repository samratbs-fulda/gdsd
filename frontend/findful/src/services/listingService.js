import axios from "axios";
import { getEnvironment } from "../utils/fetchEnvironment";

const environment = getEnvironment();
const apiUrl = environment.backend;

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
    query: searchText,
    apartmentType: apartmentType,
  };

  // TODO: Edit to fetch data from our data base (via backend API)
  try {
    const response = await axios.get(`${apiUrl}/api/search`, payload);
    return response.data;
  } catch (error) {
    console.error("API Request Failed:", error);
    throw error;
  }
};
