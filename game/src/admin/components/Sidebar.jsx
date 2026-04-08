import React from "react";
import { Link } from "react-router-dom";
import "../css/sidebar.css";


function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Admin</h2>

      <ul>
        <li><Link to="/admin">Dashboard</Link></li>
        <li><Link to="/admin/products">Products</Link></li>
        <li><Link to="/admin/users">Users</Link></li>
        <li><Link to="/admin/orderss">Orders</Link></li>
      </ul>
    </div>
  );
}

export default Sidebar;