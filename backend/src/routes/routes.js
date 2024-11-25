const express = require("express");
const { homeController, searchController } = require("../controllers");

const router = express.Router();

router.get("/", homeController);
router.get("/api/search", searchController);

module.exports = router;
