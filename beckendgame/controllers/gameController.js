const Game = require("../models/Game");


exports.getGames = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 12 } = req.query;

  const filter = {};
  if (search) filter.title = { $regex: search, $options: 'i' };
  if (category) filter.category = { $regex: `^${category}$`, $options: 'i' };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Game.countDocuments(filter);
    const games = await Game.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      games,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch games", error: err.message });
  }
};


exports.getGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: "Game not found" });
    res.json(game);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch game", error: err.message });
  }
};


exports.addGame = async (req, res) => {
  try {
    const game = await Game.create(req.body);
    res.status(201).json(game);
  } catch (err) {
    res.status(500).json({ message: "Failed to add game", error: err.message });
  }
};

exports.updateGame = async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!game) return res.status(404).json({ message: "Game not found" });
    res.json(game);
  } catch (err) {
    res.status(500).json({ message: "Failed to update game", error: err.message });
  }
};

exports.deleteGame = async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);
    if (!game) return res.status(404).json({ message: "Game not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete game", error: err.message });
  }
};

exports.uploadImage = async (req, res) => {
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