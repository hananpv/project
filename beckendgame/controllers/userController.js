const User = require("../models/User");

const userResponse = (user) => ({
  id: user._id.toString(),
  _id: user._id,
  name: user.name,
  username: user.username || user.name,
  email: user.email,
  role: user.role,
  isBlocked: user.isBlocked,
  tier: user.tier,
  createdAt: user.createdAt,
});

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(userResponse(user));
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile", error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, username, email, isBlocked, tier, role } = req.body;
    const update = {};

    if (name) update.name = name;
    if (username) update.username = username;
    if (email) update.email = email.toLowerCase();
    if (typeof isBlocked === "boolean") update.isBlocked = isBlocked;
    if (tier) update.tier = tier;
    if (role) update.role = role;

    const user = await User.findByIdAndUpdate(req.user.id, update, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(userResponse(user));
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile", error: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users.map(userResponse));
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(userResponse(user));
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user", error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, username, email, isBlocked, tier, role } = req.body;
    const update = {};

    if (name) update.name = name;
    if (username) update.username = username;
    if (email) update.email = email.toLowerCase();
    if (typeof isBlocked === "boolean") update.isBlocked = isBlocked;
    if (tier) update.tier = tier;
    if (role) update.role = role;

    const user = await User.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(userResponse(user));
  } catch (err) {
    res.status(500).json({ message: "Failed to update user", error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user", error: err.message });
  }
};
