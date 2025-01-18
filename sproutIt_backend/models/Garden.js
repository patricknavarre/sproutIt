const mongoose = require("mongoose");

const PlantSchema = new mongoose.Schema({
  plantId: {
    type: String,
    required: true,
  },
  plantName: {
    type: String,
    required: true,
  },
  emoji: {
    type: String,
    required: true,
  },
  daysToMaturity: {
    type: Number,
    required: true,
  },
  position: {
    x: {
      type: Number,
      required: true,
      min: 0,
    },
    y: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  plantedDate: {
    type: Date,
    required: true,
  },
  harvestDate: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    default: "annual",
  },
});

const BedSchema = new mongoose.Schema({
  width: {
    type: Number,
    required: true,
    min: 1,
    max: 12,
  },
  length: {
    type: Number,
    required: true,
    min: 1,
    max: 12,
  },
  plants: [PlantSchema],
});

const GardenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  layout: {
    type: {
      type: String,
      enum: ["single-bed", "multiple-beds"],
      default: "single-bed",
    },
    beds: [BedSchema],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add a pre-save hook to ensure the garden has at least one bed
GardenSchema.pre("save", function (next) {
  if (!this.layout.beds || this.layout.beds.length === 0) {
    this.layout.beds = [
      {
        width: 4,
        length: 8,
        plants: [],
      },
    ];
  }
  next();
});

module.exports = mongoose.model("Garden", GardenSchema);
