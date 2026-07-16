const Game = require("../models/Game");

// GET /api/admin/products
exports.getProducts = async (req, res) => {
  try {
    const games = await Game.find().sort({ createdAt: -1 });
    res.json({ games });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products", error: err.message });
  }
};

// POST /api/admin/products
exports.addProduct = async (req, res) => {
  try {
    const game = await Game.create(req.body);
    res.status(201).json(game);
  } catch (err) {
    res.status(500).json({ message: "Failed to add product", error: err.message });
  }
};

// PUT /api/admin/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!game) return res.status(404).json({ message: "Product not found" });
    res.json(game);
  } catch (err) {
    res.status(500).json({ message: "Failed to update product", error: err.message });
  }
};

// DELETE /api/admin/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);
    if (!game) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete product", error: err.message });
  }
};

// POST /api/admin/products/upload
exports.uploadProductImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }
    const relativePath = `/products/${req.file.filename}`;
    res.json({ imageUrl: relativePath });
  } catch (err) {
    res.status(500).json({ message: "Failed to upload image", error: err.message });
  }
};
