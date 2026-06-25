const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getProfile,
  updateProfile,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

router.use(authMiddleware);

router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.get("/", getUsers);
router.get("/:id", getUser);
router.patch("/:id", updateUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
