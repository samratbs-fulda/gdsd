import axios from "axios";
import { getEnvironment } from "../utils/fetchEnvironment";

const environment = getEnvironment();
const apiUrl = environment.VITE_BACKEND;

console.log("first", apiUrl);

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
  var params = {};
  if (searchText) params.postal_code = searchText;
  if (apartmentType && apartmentType !== "all")
    params.apartment_type = apartmentType;

  const payload = {
    params: params,
  };

  try {
    const response = await axios.get(`${apiUrl}/api/listings/search`, payload);
    return response.data.listings;
  } catch (error) {
    console.error("API Request Failed:", error);
    throw error;
  }
};

export const addListing = async (listingValues) => {
  const payload = {
    params: listingValues,
  };
  try {
    console.log(payload);
    const response = await axios.post(`${apiUrl}/api/listings/add`, payload);
    return response.status;
  } catch (error) {
    console.error("API Request Failed:", error);
    throw error;
  }
};
