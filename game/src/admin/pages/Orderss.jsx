import React, { useEffect, useState } from "react";
import { api } from "../../api/Axios";
import "../css/orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);

  // Fetch orders from users.payments
  const fetchOrders = async () => {
    try {
      const res = await api.get("/users");

      // Extract all payments (orders)
      const allOrders = res.data.flatMap((user) =>
        (user.payments || []).map((order) => ({
          ...order,
          userName: user.username || user.email
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
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="4">No orders found</td>
            </tr>
          ) : (
            orders.map((o, index) => (
              <tr key={o.id || index}>
                <td>{o.orderId || o.id}</td>
                <td>{o.userName}</td>
                <td>₹{o.totalAmount}</td>
                <td>{o.status || "Paid"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Orders;