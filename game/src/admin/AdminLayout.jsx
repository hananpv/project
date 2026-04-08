import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import "./css/layout.css";

function AdminLayout() {
  return (
    <div className="admin-container">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Section */}
      <div className="admin-main">
        <Header />

        {/* Pages load here */}
        <div className="admin-content">
          <Outlet />
        </div>
      </div>

    </div>
  );
}

export default AdminLayout;