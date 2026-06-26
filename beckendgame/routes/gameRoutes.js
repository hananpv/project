const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const {
  getGames,
  getGame,
  addGame,
  updateGame,
  deleteGame,
} = require("../controllers/gameController");

router.get("/", getGames);

router.get("/:id", getGame);

router.post("/", authMiddleware, addGame);

router.put("/:id", authMiddleware, updateGame);

router.delete("/:id", authMiddleware, deleteGame);
 
module.exports = router;
