const User = require("../models/User");
const Game = require("../models/Game");
const Order = require("../models/Order");

// ========================
// DASHBOARD
// ========================

// GET /api/admin/stats
exports.getStats = async (req, res) => {
  try {
    const [usersCount, productsCount, stats] = await Promise.all([
      User.countDocuments({ role: { $ne: "admin" } }),
      Game.countDocuments(),
      Order.aggregate([
        {
          $facet: {
            revenue: [
              { $group: { _id: null, totalRevenue: { $sum: "$total" } } },
            ],
            revenueData: [
              {
                $group: {
                  _id: { $dateToString: { format: "%d/%m/%Y", date: "$createdAt" } },
                  revenue: { $sum: "$total" },
                },
              },
              { $sort: { _id: 1 } },
              { $limit: 14 },
            ],
            ordersByStatus: [
              { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
              { $project: { _id: 0, status: "$_id", count: 1 } },
            ],
            topGames: [
              { $unwind: "$items" },
              { $group: { _id: "$items.title", sales: { $sum: "$items.quantity" } } },
              { $sort: { sales: -1 } },
              { $limit: 8 },
              { $project: { _id: 0, name: "$_id", sales: 1 } },
            ],
            totalOrders: [{ $count: "count" }],
          },
        },
      ]),
    ]);

    const data = stats[0];
    const revenue = data.revenue.length ? data.revenue[0].totalRevenue : 0;
    const orders = data.totalOrders.length ? data.totalOrders[0].count : 0;

    res.json({
      users: usersCount,
      products: productsCount,
      orders,
      revenue,
      revenueData: data.revenueData.map((r) => ({ date: r._id, revenue: r.revenue })),
      pieData: [
        { name: "Users", value: usersCount },
        { name: "Orders", value: orders },
        { name: "Products", value: productsCount },
      ],
      topGames: data.topGames,
      ordersByStatus: data.ordersByStatus,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats", error: err.message });
  }
};

// ========================
// ORDERS
// ========================

// GET /api/admin/orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name username email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders", error: err.message });
  }
};

// PATCH /api/admin/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const validStatuses = ["Placed", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    ).populate("userId", "name username email");

    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to update order status", error: err.message });
  }
};

// ========================
// PRODUCTS (GAMES)
// ========================

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

// ========================
// USERS
// ========================

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

// GET /api/admin/users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users.map(userResponse));
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
};

// PATCH /api/admin/users/:id
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

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(userResponse(user));
  } catch (err) {
    res.status(500).json({ message: "Failed to update user", error: err.message });
  }
};

// DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user", error: err.message });
  }
};
