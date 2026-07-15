import React, { useEffect, useState } from "react";
import { api } from "../../api/Axios";
import {
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
  LineChart, Line,
  BarChart, Bar,
} from "recharts";
import "../css/dashboard.css";

const PIE_COLORS = ["#6366f1", "#22c55e", "#f59e0b"];
const BAR_COLOR = "#6366f1";

function Dashboard() {
  const [data, setData] = useState({
    users: 0,
    products: 0,
    orders: 0,
    revenue: 0,
    pieData: [],
    revenueData: [],
    topGames: [],
    ordersByStatus: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/admin/stats");
      setData(res.data);
    } catch (err) {
      console.error("Dashboard Error:", err);
      setError("Failed to load dashboard data. Make sure you are logged in as admin.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loader"></div>;
  if (error) return <div className="dashboard-error">{error}</div>;

  return (
    <div className="dashboard">
      <h2 className="title"> Admin Dashboard</h2>

      {/* STAT CARDS */}
      <div className="dashboard-cards">
        {[
          { label: "Users", value: data.users, cls: "gradient1" },
          { label: "Products", value: data.products, cls: "gradient2" },
          { label: "Orders", value: data.orders, cls: "gradient3" },
          { label: "Revenue", value: `₹${Number(data.revenue).toLocaleString("en-IN")}`, cls: "gradient4" }
        ].map((item, i) => (
          <div key={i} className={`card ${item.cls}`}>
            <h3>{item.label}</h3>
            <p>{item.value}</p>
          </div>
        ))}
      </div>

      {/* CHARTS */}
      <div className="charts">

        {/* DONUT PIE CHART */}
        <div className="chart-box enhanced">
          <h3>Distribution Overview</h3>

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
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          {/* LEGEND */}
          <div className="legend">
            {data.pieData.map((item, i) => (
              <div key={i} className="legend-item">
                <span
                  className="dot"
                  style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                ></span>
                {item.name} ({item.value})
              </div>
            ))}
          </div>
        </div>

        {/* ORDERS BY STATUS PIE */}
        {data.ordersByStatus && data.ordersByStatus.length > 0 && (
          <div className="chart-box enhanced">
            <h3>Orders by Status</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={data.ordersByStatus}
                  dataKey="count"
                  nameKey="status"
                  outerRadius={100}
                  innerRadius={50}
                  paddingAngle={5}
                  label={({ status, percent }) =>
                    `${status} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {data.ordersByStatus.map((_, index) => (
                    <Cell
                      key={index}
                      fill={["#6366f1", "#f59e0b", "#22c55e", "#3b82f6", "#ef4444"][index % 5]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* REVENUE TREND LINE CHART */}
        <div className="chart-box full-width">
          <h3>Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.revenueData}>
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip formatter={(val) => `₹${val.toLocaleString("en-IN")}`} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#39945a"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* TOP GAMES BAR CHART */}
        {data.topGames && data.topGames.length > 0 && (
          <div className="chart-box full-width">
            <h3>Top Games by Sales</h3>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={data.topGames} margin={{ top: 10, right: 20, left: 0, bottom: 60 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill={BAR_COLOR} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;
