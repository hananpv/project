const Wishlist = require("../models/Wishlist");
const Game = require("../models/Game");

exports.getWishlist = async (req, res) => {
  try {
    const items = await Wishlist.find({ userId: req.user.id }).populate("gameId");
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch wishlist", error: err.message });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const { gameId } = req.body;

    if (!gameId) {
      return res.status(400).json({ message: "gameId is required" });
    }

    const game = await Game.findById(gameId);

    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    const item = await Wishlist.findOneAndUpdate(
      { userId: req.user.id, gameId },
      { userId: req.user.id, gameId },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).populate("gameId");

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: "Failed to add to wishlist", error: err.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const item = await Wishlist.findOneAndDelete({
      userId: req.user.id,
      gameId: req.params.gameId,
    });

    if (!item) {
      return res.status(404).json({ message: "Wishlist item not found" });
    }

    res.json({ message: "Wishlist item removed" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove wishlist item", error: err.message });
  }
};
