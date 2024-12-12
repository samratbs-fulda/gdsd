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

export const searchListing = async (filters) => {
  const {
    searchText,
    listingType,
    minPrice,
    maxPrice,
    size,
    rooms,
    amenities,
    maxDistance,
  } = filters;
  var params = {};
  if (searchText) params.postal_code = searchText;
  if (listingType !== "all") params.type = listingType;
  if (minPrice) params.min_price = minPrice;
  if (maxPrice) params.max_price = maxPrice;
  if (size) params.size = size;
  if (rooms) params.rooms = rooms;
  if (amenities) params.amenities = amenities;
  if (maxDistance) params.max_distance = maxDistance;

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
  try {
    listingValues = {
      ...listingValues,
      distanceFromUni: 0.2, // TODO: Calculate distance
      landlordId: 6, // TODO: Add that from the DB
    }
    const response = await axios.post(`${apiUrl}/api/listings/add`, listingValues);
    return response.status;
  } catch (error) {
    console.error("API Request Failed:", error);
    throw error;
  }
};
