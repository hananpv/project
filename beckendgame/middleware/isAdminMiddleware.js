const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    // req.user is already set by authMiddleware
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const user = await User.findById(req.user.id).select("role");

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: "Authorization check failed", error: err.message });
  }
};

