const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdminMiddleware");
const { getGames, getGame, addGame, updateGame, deleteGame, uploadImage } = require("../controllers/gameController");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/", getGames);
router.get("/:id", getGame);
router.post("/upload", authMiddleware, isAdmin, upload.single("image"), uploadImage);
router.post("/", authMiddleware, isAdmin, addGame);
router.put("/:id", authMiddleware, isAdmin, updateGame);
router.delete("/:id", authMiddleware, isAdmin, deleteGame);

module.exports = router;

