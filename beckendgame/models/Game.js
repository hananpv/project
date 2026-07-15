const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    image: String,
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: String,
    description: String,
    developer: String,
    year: Number,
    rating: {
      type: Number,
      min: 0,
      max: 10,
    },
    platform: String,
    isNew: {
      type: Boolean,
      default: false,
    },
    isTopSeller: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Game", gameSchema);
