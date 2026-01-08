import React from 'react';
import { useAuth } from '../context/AuthContext';
import '../css/orders.css';

function Orders() {
  const { user } = useAuth();

  if (!user || user.payments.length === 0) {
    return <div className="orders-empty">No orders yet</div>;
  }

  return (
    <div className="orders-container">
      <h1 className="orders-title">Your Orders</h1>

      {user.payments.map(order => (
        <div key={order.orderId} className="order-card">
          
          <div className="order-header">
            <h3 className="order-id">Order ID: {order.orderId}</h3>
            <span className="order-status">{order.status}</span>
          </div>

          <p className="order-date">
            {new Date(order.date).toLocaleString()}
          </p>

          <div className="order-items">
            {order.items.map(item => (
              <div key={item.id} className="order-item">

                {/* ✅ IMAGE */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="order-item-image"
                />

                <div className="order-item-info">
                  <span className="order-item-title">
                    {item.title} × {item.quantity}
                  </span>
                  <span className="order-item-price">
                    ₹{item.price * item.quantity}
                  </span>
                </div>

              </div>
            ))}
          </div>

          <div className="order-total">
            <span>Total</span>
            <span>₹{order.totalAmount}</span>
          </div>

        </div>
      ))}
    </div>
  );
}

export default Orders;
