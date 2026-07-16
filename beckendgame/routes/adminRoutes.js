const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdminMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Import separated controllers
const { getStats } = require("../controllers/adminStatsController");
const { getAllOrders, updateOrderStatus } = require("../controllers/adminOrderController");
const { getProducts, addProduct, updateProduct, deleteProduct, uploadProductImage } = require("../controllers/adminProductController");
const { getUsers, updateUser, deleteUser } = require("../controllers/adminUserController");

const router = express.Router();

// All admin routes require auth + admin role
router.use(authMiddleware, isAdmin);

// Dashboard
router.get("/stats", getStats);

// Orders
router.get("/orders", getAllOrders);
router.patch("/orders/:id/status", updateOrderStatus);

// Products
router.get("/products", getProducts);
router.post("/products", addProduct);
router.post("/products/upload", upload.single("image"), uploadProductImage);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

// Users
router.get("/users", getUsers);
router.patch("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

module.exports = router;
