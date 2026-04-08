import React from "react";
import { useAuth } from "../context/AuthContext";
import "../css/profile.css";

function Profile() {
  const { user } = useAuth();

  if (!user) return <div className="loading">Loading profile...</div>;

  const payments = user.payments || [];

  return (
    <div className="profile-container">

      {/* 🏷 Title */}
      <h1 className="profile-title">My Profile</h1>

      {/* 👤 User Info */}
      <div className="profile-card user-card">
        <h2>{user.username}</h2>
        <p>{user.email}</p>
      </div>

      {/* 🏆 Membership Tier */}
      <div className={`membership-card ${user.tier || "bronze"}`}>
        <h3>Membership</h3>
        <div className="tier-badge">
          {user.tier === "diamond"
            ? "💎 Diamond"
            : user.tier === "gold"
            ? "🥇 Gold"
            : "🥉 Bronze"}
        </div>
      </div>

      {/* 📊 Stats */}
      <div className="profile-stats">
        <div className="stat-box">
          <p>Total Orders</p>
          <h2>{payments.length}</h2>
        </div>
      </div>

      {/* 📦 Orders */}
      <div className="profile-orders">
        <h3>Recent Orders</h3>

        {payments.length === 0 ? (
          <p className="empty">No orders yet</p>
        ) : (
          payments
            .slice()
            .reverse()
            .map((order) => (
              <div
                key={order.id || order.orderId}
                className="order-card"
              >

                {/* 🔝 Order Top */}
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

                {/* 🧾 Order Items */}
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

                {/* 💰 Order Total */}
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