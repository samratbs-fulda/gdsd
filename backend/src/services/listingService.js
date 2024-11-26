const prisma = require("../utils/db");

class SearchService {
  async getAllListings() {
    try {
      const listings = await prisma.listing.findMany();
      return listings;
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  }

  async getListingsByApartmentType(apartment_type, postal_code) {
    try {
      const listings = await prisma.listing.findMany({
        where: {
          apartment_type: apartment_type,
          postcode: postal_code
        }
      });
      return listings;
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  }
}

module.exports = SearchService;
