const express = require("express");
const { ListingService } = require("../services");

const router = express.Router();
const listingService = new ListingService();

router.get("/", async (req, res) => {
  const listings = await listingService.getAllListings();
  res.json({ listings });
});

router.get("/detail/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  const listing = await listingService.getListingById(id);
  res.json({ listing });
});

router.get("/review", async (req, res) => {
  const { status } = req.query;

  const listings = await listingService.getListingsByStatus(status);
  res.json({ listings });
});

router.get("/search", async (req, res) => {
  const {
    postal_code,
    type,
    min_price,
    max_price,
    size,
    rooms,
    amenities,
    max_distance,
  } = req.query;

  const filters = {};
if (postal_code) filters.postalCode = postal_code;
if (type) filters.type = type;
if (min_price) filters.warmRent = { gt: parseFloat(min_price) };
if (max_price) filters.warmRent = { ...filters.warmRent, lt: parseFloat(max_price) };
if (size) filters.size = { gt: parseInt(size[0]), lt: parseInt(size[1]) };
if (rooms) filters.totalRooms = { gt: parseInt(rooms[0]), lt: parseInt(rooms[1]) };
// if (amenities) filters.amenities = amenities;
if (max_distance) filters.distanceFromUni = { lt: parseFloat(max_distance) };
  console.log(filters);
  try{
    const listings = await listingService.getFilteredListings(
      filters
    );
    res.status(200).json({ listings });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
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
