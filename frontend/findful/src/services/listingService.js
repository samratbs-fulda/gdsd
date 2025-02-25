import axios from "axios";
import { getEnvironment } from "../utils/fetchEnvironment";
import { jwtDecode } from "jwt-decode";

const environment = getEnvironment();
const apiUrl = environment.VITE_BACKEND;

export const getAllListings = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/listings`);
    return response.data.listings;
  } catch (error) {
    console.error("Failed to fetch listings:", error);
    throw error;
  }
};

export const getListingById = async (id) => {
  try {
    const response = await axios.get(`${apiUrl}/api/listings/detail/${id}`);
    return response.data.listing;
  } catch (error) {
    console.error("Failed to fetch listing:", error);
    throw error;
  }
};

export const searchListing = async (filters) => {
  const {
    searchText,
    listingType,
    furnished,
    minPrice,
    maxPrice,
    size,
    rooms,
    amenities,
    maxDistance,
  } = filters;
  var params = {};
  if (searchText) params.postal_code = searchText;
  if (listingType !== "All") params.type = listingType;
  if (furnished !== "All") params.furnished = furnished;
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
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const landlordId = decodedToken.id;

    listingValues = {
      ...listingValues,
      landlordId: landlordId,
    }
    const response = await axios.post(`${apiUrl}/api/listings/add`, listingValues);
    return response.status;
  } catch (error) {
    console.error("API Request Failed:", error);
    throw error;
  }
};

export const getListingImages = async (listingId) => {
  try {
    const response = await axios.get(`${apiUrl}/api/listings/imgs/${listingId}`);
    return response.data.images;
  } catch (error) {
    console.error("API Request Failed:", error);
    throw error;
  }
}

export const updateListing = async (listingValues, listingId) => {
  try {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const landlordId = decodedToken.id;

    listingValues = {
      ...listingValues,
      landlordId: landlordId,
    }
    const response = await axios.patch(`${apiUrl}/api/listings/update/${listingId}`, listingValues);
    return response.status;
  } catch (error) {
    console.error("API Request Failed:", error);
    throw error;
  }
};
