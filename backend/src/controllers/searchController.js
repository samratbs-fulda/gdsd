const { SearchService } = require("../services");

const searchService = new SearchService();

const searchController = async (req, res) => {
    const { apartment_type } = req.query;

    if (!apartment_type) {
        return res.status(400).json({ message: "apartment_type is required" });
    }

    const listings = await searchService.getListingsByApartmentType(apartment_type);
    res.status(200).json({ listings });
};

module.exports = { searchController };
