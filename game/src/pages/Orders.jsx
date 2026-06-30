import React, { useEffect, useState } from 'react';
import { api } from '../api/Axios';
import '../css/orders.css';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const { data } = await api.get('/orders');
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load orders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const formatCardNumber = (num) => {
    if (!num) return "";
    const clean = num.replace(/\s/g, "");
    return `**** **** **** ${clean.slice(-4)}`;
  };

  if (loading) return <div className="orders-empty">Loading orders...</div>;
  if (!orders.length) return <div className="orders-empty">No orders yet</div>;

  return (
    <div className="orders-container">
      <h1 className="orders-title">Your Orders</h1>

      {orders.map((order) => {
        const currentStatus = order.orderStatus || "Placed";
        return (
          <div key={order._id || order.id} className="order-card">
            <div className="order-header">
              <h3 className="order-id">Order ID: {order._id || order.id}</h3>
              <span className={`order-status ${currentStatus.toLowerCase()}`}>
                {currentStatus}
              </span>
            </div>

            <p className="order-date">
              Ordered on: {order.createdAt ? new Date(order.createdAt).toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' }) : "No date"}
            </p>

            <div className="order-items">
              {order.items?.map((item, index) => (
                <div key={`${order._id}-${item.gameId || index}`} className="order-item">
                  <div className="order-item-info">
                    <span className="order-item-title">
                      {item.title} x {item.quantity || 1}
                    </span>

                    <span className="order-item-price">
                      ₹{item.price * (item.quantity || 1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-info-sections">
              {order.address && (
                <div className="order-info-box">
                  <h4>Shipping Address</h4>
                  <p><strong>Name:</strong> {order.address.name}</p>
                  <p><strong>Phone:</strong> {order.address.phone}</p>
                  <p><strong>Address:</strong> {order.address.address}</p>
                  <p><strong>Location:</strong> {order.address.city}, {order.address.state} - {order.address.zipCode}</p>
                </div>
              )}

              <div className="order-info-box">
                <h4>Payment Details</h4>
                <p><strong>Method:</strong> {order.paymentMethod === "cod" ? "Cash On Delivery (COD)" : order.paymentMethod?.toUpperCase()}</p>
                {order.paymentMethod === "card" && order.paymentDetails && (
                  <>
                    <p><strong>Card Number:</strong> {formatCardNumber(order.paymentDetails.cardNumber)}</p>
                    <p><strong>Holder Name:</strong> {order.paymentDetails.cardHolderName}</p>
                  </>
                )}
                {order.paymentMethod === "upi" && order.paymentDetails && (
                  <p><strong>UPI ID:</strong> {order.paymentDetails.upiId}</p>
                )}
                <p>
                  <strong>Payment Status:</strong>{" "}
                  <span className={`payment-status-badge ${order.paymentStatus?.toLowerCase()}`}>
                    {order.paymentStatus || "pending"}
                  </span>
                </p>
              </div>
            </div>

            <div className="order-total">
              <span>Total</span>
              <span>₹{order.total}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Orders;
