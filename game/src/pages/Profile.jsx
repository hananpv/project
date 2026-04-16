import React from "react";
import { useAuth } from "../context/AuthContext";
import "../css/profile.css";

function Profile() {
  const { user } = useAuth();

  if (!user) return <div className="loading">Loading profile...</div>;

  const payments = user.payments || [];

  //  FIX tier issue
  const tier = (user.tier || "bronze").toLowerCase();

  //  total spent
  const totalSpent = payments.reduce(
    (sum, p) => sum + (p.totalAmount || 0),
    0
  );

  return (
    <div className="profile-container">

      <h1 className="profile-title">My Profile</h1>

      {/*  User Info */}
      <div className="profile-card user-card">
        <h2>{user.username}</h2>
        <p>{user.email}</p>
        <small>User ID: {user.id}</small>
        <small>
          Joined: {user.createdAt || "2024"}
        </small>
      </div>

      {/*  Membership */}
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
            ? "💎 Diamond"
            : tier === "gold"
            ? "🥇 Gold"
            : "🥉 Bronze"}
        </div>
      </div>

      {/*  Stats */}
      <div className="profile-stats">
        <div className="stat-box">
          <p>Total Orders</p>
          <h2>{payments.length}</h2>
        </div>

        <div className="stat-box">
          <p>Total Spent</p>
          <h2>₹{totalSpent}</h2>
        </div>

        <div className="stat-box">
          <p>Membership</p>
          <h2>{tier.toUpperCase()}</h2>
        </div>
      </div>

      {/*  Orders */}
      <div className="profile-orders">
        <h3>Recent Orders</h3>

        {payments.length === 0 ? (
          <p className="empty">No orders yet</p>
        ) : (
          payments
            .slice()
            .reverse()
            .map((order) => (
              <div key={order.id || order.orderId} className="order-card">

                <div className="order-top">
                  <span>#{order.orderId || order.id}</span>
                  <span
                    className={`status ${
                      order.status?.toLowerCase() || "pending"
                    }`}
                  >
                    {order.status || "Pending"}
                  </span>
                </div>

                <div className="order-items">
                  {order.items?.map((item) => (
                    <div key={item.id} className="order-item">
                      <span>{item.title}</span>
                      <span>
                        ₹{item.price} × {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="order-bottom">
                  <span>Total</span>
                  <strong>₹{order.totalAmount}</strong>
                </div>

              </div>
            ))
        )}
      </div>

    </div>
  );
}

export default Profile;