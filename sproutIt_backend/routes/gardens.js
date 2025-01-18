const express = require("express");
const router = express.Router();
const Garden = require("../models/Garden");
const auth = require("../middleware/auth");

// Get user's gardens
router.get("/", auth, async (req, res) => {
  try {
    console.log("GET /gardens - Fetching gardens for user:", req.user.id);
    console.log("Auth token received:", req.header("x-auth-token"));

    const gardens = await Garden.find({ userId: req.user.id });
    console.log("Found gardens:", gardens);

    if (!gardens || gardens.length === 0) {
      console.log("No gardens found for user");
    } else {
      console.log(`Found ${gardens.length} gardens`);
    }

    res.json(gardens);
  } catch (err) {
    console.error("Error in GET /gardens:", err);
    res.status(500).json({ message: err.message });
  }
});

// Get single garden by ID
router.get("/:id", auth, async (req, res) => {
  try {
    console.log("\n=== GET /gardens/:id ===");
    console.log("Garden ID:", req.params.id);
    console.log("User ID:", req.user.id);
    console.log("Auth token:", req.header("x-auth-token"));

    const garden = await Garden.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    console.log("MongoDB query result:", garden);

    if (!garden) {
      console.log("Garden not found or unauthorized");
      return res.status(404).json({ message: "Garden not found" });
    }

    console.log("Successfully found garden:", garden.name);
    res.json(garden);
  } catch (err) {
    console.error("Error in GET /gardens/:id:", err);
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid garden ID format" });
    }
    res.status(500).json({ message: err.message });
  }
});

// Create new garden
router.post("/", auth, async (req, res) => {
  const garden = new Garden({
    userId: req.user.id,
    name: req.body.name,
    layout: req.body.layout,
  });

  try {
    const newGarden = await garden.save();
    res.status(201).json(newGarden);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update garden
router.patch("/:id", auth, async (req, res) => {
  try {
    console.log("PATCH /gardens/:id - Updating garden:", req.params.id);
    console.log("User ID from token:", req.user.id);
    console.log("Update data:", req.body);

    const garden = await Garden.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!garden) {
      console.log("Garden not found or unauthorized");
      return res.status(404).json({ message: "Garden not found" });
    }

    console.log("Garden updated successfully:", garden);
    res.json(garden);
  } catch (err) {
    console.error("Error updating garden:", err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
