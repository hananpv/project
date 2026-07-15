const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdminMiddleware");
const {
  getProfile,
  updateProfile,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

// User profile routes (any authenticated user)
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);

// Admin-only user management routes
router.get("/", authMiddleware, isAdmin, getUsers);
router.get("/:id", authMiddleware, isAdmin, getUser);
router.patch("/:id", authMiddleware, isAdmin, updateUser);
router.put("/:id", authMiddleware, isAdmin, updateUser);
router.delete("/:id", authMiddleware, isAdmin, deleteUser);

module.exports = router;

