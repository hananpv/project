import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../css/sidebar.css";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/admin" },
    { name: "Products", path: "/admin/products"},
    { name: "Users", path: "/admin/users"  },
    { name: "Orders", path: "/admin/orderss" },
  ];

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      
      {/* Header */}
      <div className="sidebar-header">
        <h2>{collapsed ? "A" : "Admin"}</h2>
        <button onClick={() => setCollapsed(!collapsed)}>
{collapsed ? (
  <img src="/forward-square-svgrepo-com.svg" width="20" />

) : (
  <img src="/back-square-svgrepo-com.svg" width="20" />)}      </button>
      </div>

      {/* Menu */}
      <ul>
        {menu.map((item, index) => (
          <li
            key={index}
            className={location.pathname === item.path ? "active" : ""}
          >
            <Link to={item.path}>
              <span className="icon">{item.icon}</span>
              {!collapsed && <span>{item.name}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;