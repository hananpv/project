const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getOrders, getOrder, createOrder } = require("../controllers/orderController");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getOrders);
router.get("/:id", getOrder);
router.post("/", createOrder);

module.exports = router;
