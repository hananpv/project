const Cart = require("../models/Cart");
const Order = require("../models/Order");
const User = require("../models/User");

exports.getOrders = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const filter = user?.role === "admin" ? {} : { userId: req.user.id };
    const orders = await Order.find(filter).populate("userId", "name username email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders", error: err.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.id });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch order", error: err.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.user.id }).populate("gameId");

    if (!cartItems.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const items = cartItems.map((item) => ({
      gameId: item.gameId._id,
      title: item.gameId.title,
      price: item.gameId.price,
      image: item.gameId.image,
      quantity: item.quantity,
    }));

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order = await Order.create({ userId: req.user.id, items, total });

    await Cart.deleteMany({ userId: req.user.id });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to create order", error: err.message });
  }
};
