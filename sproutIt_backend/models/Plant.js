const mongoose = require("mongoose");

const PlantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["vegetable", "fruit", "herb"],
  },
  seedStartIndoor: {
    type: Number,
    required: true,
  },
  seedStartOutdoor: {
    type: Number,
    required: true,
  },
  spacing: {
    type: Number,
    required: true,
  },
  companionPlants: [
    {
      type: String,
    },
  ],
  harvestTime: {
    type: Number,
    required: true,
  },
  sunRequirements: {
    type: String,
    required: true,
    enum: ["full-sun", "partial-shade", "full-shade"],
  },
  description: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Plant", PlantSchema);
