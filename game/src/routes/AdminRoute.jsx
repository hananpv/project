import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminRoute({ children }) {
  const { user } = useAuth();

  // 🔒 Not logged in OR not admin
  if (!user || user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
}

export default AdminRoute;