import React, { useEffect, useState } from "react";
import { api } from "../../api/Axios";
import "../css/orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [viewOrder, setViewOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/users");

      const allOrders = res.data.flatMap((user) =>
        (user.payments || []).map((order) => ({
          ...order,
          userName: user.username || user.email,
          email: user.email,
        }))
      );

      setOrders(allOrders);
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
            orders.map((o, index) => (
              <tr key={o.id || index}>
                <td>{o.orderId || o.id}</td>
                <td>{o.userName}</td>
                <td>{o.email}</td>
                <td>₹{o.totalAmount}</td>
                <td>{o.items?.length || 0}</td>
                <td>
                  {o.date
                    ? new Date(o.date).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>{o.status || "Paid"}</td>

                <td>
                  <button onClick={() => setViewOrder(o)}>
                    View
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/*  MODAL */}
      {viewOrder && (
        <div className="modal" onClick={() => setViewOrder(null)}>
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Order Details</h3>

            <p><strong>Order ID:</strong> {viewOrder.orderId || viewOrder.id}</p>
            <p><strong>User:</strong> {viewOrder.userName}</p>
            <p><strong>Email:</strong> {viewOrder.email}</p>
            <p><strong>Total:</strong> ₹{viewOrder.totalAmount}</p>
            <p><strong>Status:</strong> {viewOrder.status || "Paid"}</p>

            <h4>Game Details</h4>

            {viewOrder.items?.length > 0 ? (
              viewOrder.items.map((item, i) => (
                <div key={i} className="order-item">

                  {/* TEXT */}
                  <div className="order-item-info">
                    <p><strong>Name:</strong> {item.name}</p>
                    <p><strong>Price:</strong> ₹{item.price}</p>
                    <p><strong>Category:</strong> {item.category}</p>
                    <p><strong>Rating:</strong> {item.rating}</p>
                    <p><strong>Description:</strong> {item.description}</p>
                  </div>

                  {/* IMAGE */}
                  {item.image && (
                    <div className="order-img-box">
                      <img src={item.image} alt={item.name} />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>No items</p>
            )}

            <h4>Payment Details</h4>
            <p><strong>Method:</strong> {viewOrder.paymentMethod || "N/A"}</p>
            <p><strong>Date:</strong> {viewOrder.date || "N/A"}</p>

            <div className="modal-actions">
              <button onClick={() => setViewOrder(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;