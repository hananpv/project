import React, { useEffect, useState } from "react";
import { api } from "../../api/Axios";
import "../css/orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [viewOrder, setViewOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatCardNumber = (num) => {
    if (!num) return "";
    const clean = num.replace(/\s/g, "");
    return `**** **** **** ${clean.slice(-4)}`;
  };

  return (
    <div className="orders">
      <h2>Orders</h2>

      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User</th>
            <th>Email</th>
            <th>Total</th>
            <th>Items</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="8">No orders found</td>
            </tr>
          ) : (
            orders.map((o) => (
              <tr key={o._id}>
                <td>{o._id}</td>
                <td>{o.userId?.username || o.userId?.name || "User"}</td>
                <td>{o.userId?.email || "N/A"}</td>
                <td>₹{o.total}</td>
                <td>{o.items?.length || 0}</td>
                <td>{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "N/A"}</td>
                <td>{o.orderStatus || o.status || "Placed"}</td>
                <td>
                  <button onClick={() => setViewOrder(o)}>View</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {viewOrder && (
        <div className="modal" onClick={() => setViewOrder(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Order Details</h3>

            <div className="modal-details-grid">
              <div className="modal-details-section">
                <p><strong>Order ID:</strong> {viewOrder._id}</p>
                <p><strong>User Name:</strong> {viewOrder.userId?.username || viewOrder.userId?.name || "User"}</p>
                <p><strong>User Email:</strong> {viewOrder.userId?.email || "N/A"}</p>
                <p><strong>Total Amount:</strong> ₹{viewOrder.total}</p>
                <p><strong>Order Status:</strong> {viewOrder.orderStatus || viewOrder.status || "Placed"}</p>
                <p><strong>Order Date & Time:</strong> {viewOrder.createdAt ? new Date(viewOrder.createdAt).toLocaleString() : "N/A"}</p>
              </div>

              {viewOrder.address && (
                <div className="modal-details-section">
                  <h4>Shipping Address</h4>
                  <p><strong>Name:</strong> {viewOrder.address.name}</p>
                  <p><strong>Phone:</strong> {viewOrder.address.phone}</p>
                  <p><strong>Address:</strong> {viewOrder.address.address}</p>
                  <p><strong>Location:</strong> {viewOrder.address.city}, {viewOrder.address.state} - {viewOrder.address.zipCode}</p>
                </div>
              )}

              <div className="modal-details-section">
                <h4>Payment Info</h4>
                <p><strong>Method:</strong> {viewOrder.paymentMethod === "cod" ? "Cash On Delivery (COD)" : viewOrder.paymentMethod?.toUpperCase()}</p>
                {viewOrder.paymentMethod === "card" && viewOrder.paymentDetails && (
                  <>
                    <p><strong>Card Number:</strong> {formatCardNumber(viewOrder.paymentDetails.cardNumber)}</p>
                    <p><strong>Cardholder Name:</strong> {viewOrder.paymentDetails.cardHolderName}</p>
                    <p><strong>Card Expiry:</strong> {viewOrder.paymentDetails.cardExpiry}</p>
                  </>
                )}
                {viewOrder.paymentMethod === "upi" && viewOrder.paymentDetails && (
                  <p><strong>UPI ID:</strong> {viewOrder.paymentDetails.upiId}</p>
                )}
                <p><strong>Payment Status:</strong> {viewOrder.paymentStatus?.toUpperCase() || "PENDING"}</p>
              </div>
            </div>

            <h4>Game Details</h4>
            {viewOrder.items?.length > 0 ? (
              viewOrder.items.map((item) => (
                <div key={item.gameId || item.title} className="order-item">
                  <div className="order-item-info">
                    <p><strong>Name:</strong> {item.title}</p>
                    <p><strong>Price:</strong> ₹{item.price}</p>
                    <p><strong>Quantity:</strong> {item.quantity}</p>
                  </div>

                  {item.image && (
                    <div className="order-img-box">
                      <img src={item.image} alt={item.title} />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>No items</p>
            )}

            <div className="modal-actions">
              <button onClick={() => setViewOrder(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;
