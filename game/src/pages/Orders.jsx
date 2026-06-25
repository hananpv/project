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

  if (loading) return <div className="orders-empty">Loading orders...</div>;
  if (!orders.length) return <div className="orders-empty">No orders yet</div>;

  return (
    <div className="orders-container">
      <h1 className="orders-title">Your Orders</h1>

      {orders.map((order) => (
        <div key={order._id || order.id} className="order-card">
          <div className="order-header">
            <h3 className="order-id">Order ID: {order._id || order.id}</h3>
            <span className={`order-status ${order.status?.toLowerCase()}`}>
              {order.status}
            </span>
          </div>

          <p className="order-date">
            {order.createdAt ? new Date(order.createdAt).toLocaleString() : "No date"}
          </p>

          <div className="order-items">
            {order.items?.map((item, index) => (
              <div key={`${order._id}-${item.gameId || index}`} className="order-item">
                <div className="order-item-info">
                  <span className="order-item-title">
                    {item.title} x {item.quantity || 1}
                  </span>

                  <span className="order-item-price">
                    Rs {item.price}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="order-total">
            <span>Total</span>
            <span>Rs {order.total}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Orders;
