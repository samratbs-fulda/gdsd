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

router.get("/review/:status", async (req, res) => {
  const status = req.params.status;

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

  const availableAmenities = [
    "kitchenFitted",
    "petsAllowed",
    "parkingAvailable",
    "balconyAvailable",
    "gardenAvailable",
    "wifiAvailable",
    "storageAvailable",
    "smokingAllowed",
    "dishWasherAvailable",
    "washingMachineAvailable",
    "tvCableIncluded"
  ];

  const filters = {};

  if (amenities) {
    filters.amenities = {};
    availableAmenities.forEach((amenity) => {
      if (amenities.includes(amenity)) {
        filters.amenities[amenity] = true;
      }
    });
  }
  if (postal_code) searchText = postal_code;
  if (type) filters.type = type;
  if (min_price) filters.warmRent = { gt: parseFloat(min_price) };
  if (max_price) filters.warmRent = { ...filters.warmRent, lt: parseFloat(max_price) };
  if (size) filters.size = { gt: parseInt(size[0]), lt: parseInt(size[1]) };
  if (rooms) filters.totalRooms = { gt: parseInt(rooms[0]), lt: parseInt(rooms[1]) };
  if (max_distance) filters.distanceFromUni = { lt: parseFloat(max_distance) };
  console.log(filters);
  try {
    const listings = await listingService.getFilteredListings(searchText,
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
    const result = await listingService.addListing(req.body);

    if (result.warnings) {
      // Partial success: database succeeded but S3 failed.
      return res.status(207).json({
        status: "Partial Success",
        message: "Listing created successfully, but some images failed to upload.",
        data: result.data
      });
    }
    // Full success: database and S3 both succeeded.
    return res.status(201).json({
      status: "success",
      message: "Listing created successfully.",
      data: result.data,
    });
  } catch (error) {
    //If both db and s3 failed.
    return res.status(500).json({
      status: "error",
      message: "Failed to create the listing.",
    });
  }
});

router.get("/search/:landlordId", async (req, res) => {
  const landlordId = parseInt(req.params.landlordId);
  try {
    const listings = await listingService.getListingsByLandlordId(landlordId);
    res.status(200).json({ listings });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.patch("/status", async (req, res) => {
  const { listingId, status } = req.body;
  try {
    const updatedListing = await listingService.updateListingStatus(listingId, status);
    res.status(200).json({ updatedListing });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

module.exports = router;
