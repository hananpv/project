import React from "react";
import "../css/dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard">
      <h2>Dashboard</h2>

      <div className="dashboard-cards">
        <div className="card">
          <h3>Total Users</h3>
          <p>120</p>
        </div>

        <div className="card">
          <h3>Total Products</h3>
          <p>45</p>
        </div>

        <div className="card">
          <h3>Total Orders</h3>
          <p>80</p>
        </div>

        <div className="card">
          <h3>Revenue</h3>
          <p>₹25,000</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;