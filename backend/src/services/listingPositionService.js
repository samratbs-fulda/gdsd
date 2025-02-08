require("dotenv-flow").config();
const axios = require('axios');

class ListingPositionService {
  static async fetchListingPositionDetails(listingData) {
    // Fetch latitude and longitude of listing
    const queryString = new URLSearchParams({
      "country": "Germany",
      "street": listingData.street + " " + listingData.houseNumber,
      "postalcode": listingData.postalCode,
      format: 'json'
    }).toString();

    let latitude, longitude, distanceFromUni;

    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?${queryString}`);
      const { lat, lon } = response.data[0];
      latitude = parseFloat(lat);
      longitude = parseFloat(lon);
    } catch (error) {
      console.error("Failed to fetch listing position:", error);
      throw error;
    }

    // Fetch distance from uni
    try {
      const response = await axios.get(`https://api.openrouteservice.org/v2/directions/foot-walking?api_key=${process.env.ORS_KEY}&start=9.687715,50.564695&end=${longitude},${latitude}`);
      distanceFromUni = parseFloat((response.data.features[0].properties.segments[0].distance / 1000).toFixed(2));
    } catch (error) {
      console.error("Failed to fetch distance from uni:", error);
      throw error;
    }

    return { latitude, longitude, distanceFromUni };
  }
}

module.exports = ListingPositionService;
