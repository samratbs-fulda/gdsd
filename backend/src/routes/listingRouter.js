const express = require("express");
const { ListingService } = require("../services");

const router = express.Router();
const listingService = new ListingService();

router.get("/", async (req, res) => {
  const listings = await listingService.getAllListings();
  res.json({ listings });
});

router.get("/review", async (req, res) => {
  const { status } = req.query;

  const listings = await listingService.getListingsByStatus(status);
  res.json({ listings });
});

router.get("/search", async (req, res) => {
  const { apartment_type } = req.query;
  const { postal_code } = req.query;

  // if (!apartment_type) {
  //   return res.status(400).json({ message: "apartment_type is required" });
  // }

  const listings = await listingService.getListingsByApartmentType(
    apartment_type,
    postal_code
  );
  res.json({ listings });
});

router.post("/add", async (req, res) => {
  try {
    const newListing = await listingService.addListing(req.body);
    res.status(201).json({
      status: "success",
      message: "Listing created successfully",
      data: newListing,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to create listing",
    });
  }
});

module.exports = router;
