const express = require("express");
const { ListingService } = require("../services");

const router = express.Router();
const listingService = new ListingService();

router.get("/", async (req, res) => {
  try {
    const listings = await listingService.getAllListings();
    res.status(200).json({ listings });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

// router.get("details/amenities/:id", async (req, res) => {
//   const id = parseInt(req.params.id);
//   try {
//     const amenities = await listingService.getAmenitiesByListingId(id);
//     res.status(200).json({ amenities });
//   } catch (error) {
//     res.status(500).json({
//       status: "error",
//       message: error.message,
//     });
//   }
// });

// router.get("/details/documents/:id", async (req, res) => {
//   const id = parseInt(req.params.id);
//   try {
//     const documents = await listingService.getDocumentsByListingId(id);
//     res.status(200).json({ documents });
//   } catch (error) {
//     res.status(500).json({
//       status: "error",
//       message: error.message,
//     });
//   }
// });

router.get("/detail/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const listing = await listingService.getListingById(id);
    res.status(200).json({ listing });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.get("/review/landlord", async (req, res) => {
  const { landlordId, status } = req.query;
  try {
    const landId = parseInt(landlordId);
    const listings = await listingService.getListingsByLandlordId(
      landId,
      status
    );
    res.status(200).json({ listings });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.get("/review/:status", async (req, res) => {
  const status = req.params.status;
  try {
    const listings = await listingService.getListingsByStatus(status);
    res.status(200).json({ listings });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.get("/search", async (req, res) => {
  const {
    postal_code,
    type,
    furnished,
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
    "tvCableIncluded",
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
  if (postal_code) {
    searchText = postal_code;
  } else {
    searchText = "";
  }

  if (type && type != "All") filters.type = type;
  if (furnished && furnished != "All") filters.furnished = furnished;
  if (min_price) filters.warmRent = { gte: parseFloat(min_price) };
  if (max_price)
    filters.warmRent = { ...filters.warmRent, lte: parseFloat(max_price) };
  if (size) filters.size = { gte: parseInt(size[0]), lte: parseInt(size[1]) };
  if (rooms)
    filters.totalRooms = { gte: parseInt(rooms[0]), lte: parseInt(rooms[1]) };
  if (max_distance) filters.distanceFromUni = { lt: parseFloat(max_distance) };
  console.log(filters);
  try {
    const listings = await listingService.getFilteredListings(
      searchText,
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
        message:
          "Listing created successfully, but some images failed to upload.",
        data: result.data,
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
    const updatedListing = await listingService.updateListingStatus(
      listingId,
      status
    );
    res.status(200).json({ updatedListing });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.get("/imgs/:listingId", async (req, res) => {
  const listingId = parseInt(req.params.listingId);
  try {
    const imgs = await listingService.getListingImgs(listingId, true);
    res.status(200).json({images: imgs})
  }catch (error){
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.patch("/update/:listingId", async (req, res) => {
  const listingId = parseInt(req.params.listingId);
  try {
    const updatedListing = listingService.updateListing(req.body, listingId);
    res.status(201).json({ updatedListing });
  }catch (error){
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.post("/route", async (req, res) => {
  try {
    const { start, end } = req.body;

    const route = await listingService.getRouteForMap(start, end);
    res.status(200).json({route});
  }catch (error){
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.post("/isochrones", async (req, res) => {
  try {
    const { locations, range } = req.body;

    const isochrones = await listingService.getIsochronesForMap(locations, range);
    res.status(200).json({isochrones});
  }catch (error){
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

module.exports = router;
