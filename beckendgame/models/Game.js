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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Game", gameSchema);
