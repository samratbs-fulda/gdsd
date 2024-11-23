const prisma = require("../data/dbConnection");

class SearchService {
    async getListingsByApartmentType(apartment_type) {
        try {
            const listings = await prisma.listing.findMany({
                where: {
                    apartment_type: apartment_type
                }
            });
            return listings;
        } catch (error) {
            console.error("Error fetching listings:", error);
        }
    }
}

module.exports = SearchService;
