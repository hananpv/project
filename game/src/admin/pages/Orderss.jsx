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
                <td>Rs {o.total}</td>
                <td>{o.items?.length || 0}</td>
                <td>{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "N/A"}</td>
                <td>{o.status || "pending"}</td>
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

            <p><strong>Order ID:</strong> {viewOrder._id}</p>
            <p><strong>User:</strong> {viewOrder.userId?.username || viewOrder.userId?.name || "User"}</p>
            <p><strong>Email:</strong> {viewOrder.userId?.email || "N/A"}</p>
            <p><strong>Total:</strong> Rs {viewOrder.total}</p>
            <p><strong>Status:</strong> {viewOrder.status || "pending"}</p>

            <h4>Game Details</h4>
            {viewOrder.items?.length > 0 ? (
              viewOrder.items.map((item) => (
                <div key={item.gameId || item.title} className="order-item">
                  <div className="order-item-info">
                    <p><strong>Name:</strong> {item.title}</p>
                    <p><strong>Price:</strong> Rs {item.price}</p>
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

            <p><strong>Date:</strong> {viewOrder.createdAt || "N/A"}</p>

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
