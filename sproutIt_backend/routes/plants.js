const express = require("express");
const router = express.Router();
const Plant = require("../models/Plant");

// Get all plants
router.get("/", async (req, res) => {
  try {
    const plants = await Plant.find();
    res.json(plants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single plant
router.get("/:id", async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) {
      return res.status(404).json({ message: "Plant not found" });
    }
    res.json(plant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
