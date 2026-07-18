const User = require("../models/User");
const Game = require("../models/Game");
const Order = require("../models/Order");

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
