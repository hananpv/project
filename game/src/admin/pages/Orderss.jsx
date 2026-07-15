import React, { useEffect, useState } from "react";
import { api } from "../../api/Axios";
import "../css/orders.css";

const STATUSES = ["Placed", "Processing", "Shipped", "Delivered", "Cancelled"];
const STATUS_COLORS = { Placed: "#6366f1", Processing: "#f59e0b", Shipped: "#3b82f6", Delivered: "#22c55e", Cancelled: "#ef4444" };

function Orders() {
  const [orders, setOrders] = useState([]);
  const [viewOrder, setViewOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchOrders = async () => {
    try { const res = await api.get("/admin/orders"); setOrders(Array.isArray(res.data) ? res.data : []); }
    catch (err) { console.error("Error fetching orders:", err); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const openView = (order) => { setViewOrder(order); setSelectedStatus(order.orderStatus || "Placed"); };

  const updateStatus = async () => {
    if (!viewOrder || !selectedStatus) return;
    try {
      setUpdating(true);
      await api.patch(`/admin/orders/${viewOrder._id}/status`, { orderStatus: selectedStatus });
      setOrders((prev) => prev.map((o) => (o._id === viewOrder._id ? { ...o, orderStatus: selectedStatus } : o)));
      setViewOrder({ ...viewOrder, orderStatus: selectedStatus });
      alert("Order status updated!");
    } catch { alert("Failed to update status"); }
    finally { setUpdating(false); }
  };

  const maskCard = (num) => num ? `**** **** **** ${num.replace(/\s/g, "").slice(-4)}` : "";

  return (
    <div className="orders">
      <h2>Orders</h2>

      <table>
        <thead>
          <tr><th>Order ID</th><th>User</th><th>Email</th><th>Total</th><th>Items</th><th>Date</th><th>Status</th><th>Action</th></tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr><td colSpan="8">No orders found</td></tr>
          ) : orders.map((o) => (
            <tr key={o._id}>
              <td>{o._id}</td>
              <td>{o.userId?.username || o.userId?.name || "User"}</td>
              <td>{o.userId?.email || "N/A"}</td>
              <td>₹{o.total}</td>
              <td>{o.items?.length || 0}</td>
              <td>{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "N/A"}</td>
              <td><span className="status-badge" style={{ background: STATUS_COLORS[o.orderStatus] || "#6b7280" }}>{o.orderStatus || "Placed"}</span></td>
              <td><button onClick={() => openView(o)}>View</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {viewOrder && (
        <div className="modal" onClick={() => setViewOrder(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Order Details</h3>

            <div className="modal-details-grid">
              <div className="modal-details-section">
                <p><strong>Order ID:</strong> {viewOrder._id}</p>
                <p><strong>User:</strong> {viewOrder.userId?.username || viewOrder.userId?.name || "User"}</p>
                <p><strong>Email:</strong> {viewOrder.userId?.email || "N/A"}</p>
                <p><strong>Total:</strong> ₹{viewOrder.total}</p>
                <p><strong>Status:</strong> <span className="status-badge" style={{ background: STATUS_COLORS[viewOrder.orderStatus] || "#6b7280" }}>{viewOrder.orderStatus || "Placed"}</span></p>
                <p><strong>Date:</strong> {viewOrder.createdAt ? new Date(viewOrder.createdAt).toLocaleString() : "N/A"}</p>
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
                <p><strong>Method:</strong> {viewOrder.paymentMethod === "cod" ? "Cash On Delivery" : viewOrder.paymentMethod?.toUpperCase()}</p>
                {viewOrder.paymentMethod === "card" && viewOrder.paymentDetails && (
                  <>
                    <p><strong>Card:</strong> {maskCard(viewOrder.paymentDetails.cardNumber)}</p>
                    <p><strong>Holder:</strong> {viewOrder.paymentDetails.cardHolderName}</p>
                    <p><strong>Expiry:</strong> {viewOrder.paymentDetails.cardExpiry}</p>
                  </>
                )}
                {viewOrder.paymentMethod === "upi" && viewOrder.paymentDetails && (
                  <p><strong>UPI ID:</strong> {viewOrder.paymentDetails.upiId}</p>
                )}
                <p><strong>Payment Status:</strong> {viewOrder.paymentStatus?.toUpperCase() || "PENDING"}</p>
              </div>
            </div>

            {/* Update Status */}
            <div className="status-update-section">
              <h4>Update Order Status</h4>
              <div className="status-update-row">
                <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <button className="update-status-btn" onClick={updateStatus} disabled={updating || selectedStatus === viewOrder.orderStatus}>
                  {updating ? "Updating..." : "Update Status"}
                </button>
              </div>
            </div>

            {/* Game Items */}
            <h4>Game Details</h4>
            {viewOrder.items?.length > 0 ? viewOrder.items.map((item) => (
              <div key={item.gameId || item.title} className="order-item">
                <div className="order-item-info">
                  <p><strong>Name:</strong> {item.title}</p>
                  <p><strong>Price:</strong> ₹{item.price}</p>
                  <p><strong>Qty:</strong> {item.quantity}</p>
                </div>
                {item.image && <div className="order-img-box"><img src={item.image} alt={item.title} /></div>}
              </div>
            )) : <p>No items</p>}

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
