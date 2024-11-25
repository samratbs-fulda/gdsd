const express = require("express");
const { homeController, searchController } = require("../controllers");
const { getListingsController } = require("../controllers/searchController");

const router = express.Router();

router.get("/", homeController);
router.get("/api/search", searchController);
router.get("/api/listings", getListingsController);

module.exports = router;
