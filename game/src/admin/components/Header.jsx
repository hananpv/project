import React from "react";
import "../css/header.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Header() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout(); 
    localStorage.removeItem("user"); // clear storage
    navigate("/login"); // redirect
  };

  return (
    <div className="admin-header">
      <h1>Admin Panel</h1>

      <div className="header-right">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Header;