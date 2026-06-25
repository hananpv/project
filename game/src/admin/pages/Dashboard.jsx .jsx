import React, { useEffect, useState } from "react";
import { api } from "../../api/Axios";
import {
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  LineChart, Line
} from "recharts";
import "../css/dashboard.css";

function Dashboard() {
  const [data, setData] = useState({
    users: 0,
    products: 0,
    orders: 0,
    revenue: 0,
    pieData: [],
    revenueData: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, productsRes, ordersRes] = await Promise.all([
        api.get("/users"),
        api.get("/games"),
        api.get("/orders"),
      ]);

      const users = usersRes.data;
      const products = productsRes.data;
      const orders = ordersRes.data;

      //  revenue
      const revenue = orders.reduce(
        (sum, o) => sum + Number(o.total || 0),
        0
      );

      //  revenue trend
      const revenueMap = {};
      orders.forEach(o => {
        if (!o.createdAt) return;
        const d = new Date(o.createdAt).toLocaleDateString();
        revenueMap[d] = (revenueMap[d] || 0) + Number(o.total || 0);
      });

      const revenueData = Object.entries(revenueMap).map(([date, revenue]) => ({
        date,
        revenue
      }));

      //  pie data
      const pieData = [
        { name: "Users", value: users.length },
        { name: "Orders", value: orders.length }
      ];

      setData({
        users: users.length,
        products: products.length,
        orders: orders.length,
        revenue,
        pieData,
        revenueData
      });

    } catch (err) {
      console.error("Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loader"></div>;

  return (
    <div className="dashboard">
      <h2 className="title"> Admin Dashboard</h2>

      {/*  CARDS */}
      <div className="dashboard-cards">
        {[
          { label: "Users", value: data.users, cls: "gradient1" },
          { label: "Products", value: data.products, cls: "gradient2" },
          { label: "Orders", value: data.orders, cls: "gradient3" },
          { label: "Revenue", value: `₹${data.revenue}`, cls: "gradient4" }
        ].map((item, i) => (
          <div key={i} className={`card ${item.cls}`}>
            <h3>{item.label}</h3>
            <p>{item.value}</p>
          </div>
        ))}
      </div>

      {/*  CHARTS */}
      <div className="charts">

        {/*  ENHANCED PIE (DONUT) */}
        <div className="chart-box enhanced">
          <h3> Distribution Overview</h3>

          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={data.pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                innerRadius={50}
                paddingAngle={5}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {data.pieData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={["#6366f1", "#22c55e", "#f59e0b"][index % 3]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          {/*  LEGEND */}
          <div className="legend">
            {data.pieData.map((item, i) => (
              <div key={i} className="legend-item">
                <span
                  className="dot"
                  style={{  
                    background: ["#6366f1", "#22c55e", "#f59e0b"][i % 3]
                  }}
                ></span>
                {item.name} ({item.value})
              </div>
            ))}
          </div>
        </div>

        {/*  LINE CHART */}
        <div className="chart-box full-width">
          <h3>Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.revenueData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#39945a"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
