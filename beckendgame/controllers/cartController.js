const Cart = require("../models/Cart");
const Game = require("../models/Game");

exports.getCart = async (req, res) => {
  try {
    const items = await Cart.find({ userId: req.user.id }).populate("gameId");
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch cart", error: err.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { gameId, quantity = 1 } = req.body;

    if (!gameId) {
      return res.status(400).json({ message: "gameId is required" });
    }

    const game = await Game.findById(gameId);

    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    const item = await Cart.findOneAndUpdate(
      { userId: req.user.id, gameId },
      { $inc: { quantity: Number(quantity) || 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).populate("gameId");

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: "Failed to add to cart", error: err.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const quantity = Number(req.body.quantity);

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const item = await Cart.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { quantity },
      { new: true, runValidators: true }
    ).populate("gameId");

    if (!item) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Failed to update cart", error: err.message });
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    const item = await Cart.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

    if (!item) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.json({ message: "Cart item removed" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove cart item", error: err.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    await Cart.deleteMany({ userId: req.user.id });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ message: "Failed to clear cart", error: err.message });
  }
};
