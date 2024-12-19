const express = require("express");
const router = express.Router();
const prisma = require("../utils/db");

// Get profile details
router.get("/:id", async (req, res) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: parseInt(req.params.id) },
      include: { user: true },
    });

    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Error fetching profile" });
  }
});

// Update profile details
router.put("/:id", async (req, res) => {
  try {
    const { age, gender, nationality, phone, bio } = req.body;

    const updatedProfile = await prisma.profile.update({
      where: { userId: parseInt(req.params.id) },
      data: { age, gender, nationality, phone, bio },
    });

    res.json(updatedProfile);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Error updating profile" });
  }
});

module.exports = router;
