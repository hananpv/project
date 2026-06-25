import React, { useEffect, useState } from "react";
import { api } from "../api/Axios";
import { useAuth } from "../context/AuthContext";
import "../css/profile.css";

function Profile() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const { data } = await api.get('/orders');
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load profile orders:', error);
      }
    };

    loadOrders();
  }, []);

  if (!user) return <div className="loading">Loading profile...</div>;

  const tier = (user.tier || "bronze").toLowerCase();
  const totalSpent = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);

  return (
    <div className="profile-container">
      <h1 className="profile-title">My Profile</h1>

      <div className="profile-card user-card">
        <h2>{user.username || user.name}</h2>
        <p>{user.email}</p>
        <small>User ID: {user.id}</small>
        <small>Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</small>
      </div>

      <div className={`membership-card ${tier}`}>
        <div>
          <h3>Membership</h3>
          <p className="tier-desc">
            {tier === "diamond"
              ? "All premium benefits unlocked"
              : tier === "gold"
              ? "Priority access & discounts"
              : "Basic access"}
          </p>
        </div>

        <div className="tier-badge">
          {tier === "diamond"
            ? "Diamond"
            : tier === "gold"
            ? "Gold"
            : "Bronze"}
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat-box">
          <p>Total Orders</p>
          <h2>{orders.length}</h2>
        </div>

        <div className="stat-box">
          <p>Total Spent</p>
          <h2>Rs {totalSpent}</h2>
        </div>

        <div className="stat-box">
          <p>Membership</p>
          <h2>{tier.toUpperCase()}</h2>
        </div>
      </div>

      <div className="profile-orders">
        <h3>Recent Orders</h3>

        {orders.length === 0 ? (
          <p className="empty">No orders yet</p>
        ) : (
          orders.slice(0, 5).map((order) => (
            <div key={order._id || order.id} className="order-card">
              <div className="order-top">
                <span>#{order._id || order.id}</span>
                <span className={`status ${order.status?.toLowerCase() || "pending"}`}>
                  {order.status || "Pending"}
                </span>
              </div>

              <div className="order-items">
                {order.items?.map((item) => (
                  <div key={item.gameId || item.title} className="order-item">
                    <span>{item.title}</span>
                    <span>Rs {item.price} x {item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="order-bottom">
                <span>Total</span>
                <strong>Rs {order.total}</strong>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Profile;
