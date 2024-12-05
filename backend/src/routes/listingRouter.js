const express = require("express");
const { SearchService } = require("../services");

const router = express.Router();
const searchService = new SearchService();

router.get("/", async (req, res) => {
  const listings = await searchService.getAllListings();
  res.json({ listings });
});

router.get("/review", async (req, res) => {
  const { status } = req.query;

  const listings = await searchService.getListingsByStatus(status);
  res.json({ listings });
});

router.get("/search", async (req, res) => {
  const { apartment_type } = req.query;
  const { postal_code } = req.query;

  // if (!apartment_type) {
  //   return res.status(400).json({ message: "apartment_type is required" });
  // }

  const listings = await searchService.getListingsByApartmentType(
    apartment_type,
    postal_code
  );
  res.json({ listings });
});

module.exports = router;
