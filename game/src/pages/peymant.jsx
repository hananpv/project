import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/Axios';
import '../css/payment.css';

function Payment() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  if (!user || user.cart.length === 0) {
    return <div className="payment-empty">No items to pay</div>;
  }

  const totalAmount = user.cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePayment = async () => {
    const paymentData = {
      orderId: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
      items: user.cart,
      totalAmount,
      paymentMethod: 'Card',
      status: 'Paid'
    };

    const updatedUser = {
      ...user,
      cart: [],
      payments: [...user.payments, paymentData]
    };

    const res = await api.patch(`/users/${user.id}`, updatedUser);
    updateUser(res.data);

    alert('Payment successful!');
    navigate('/orders');
  };

  return (
    <div className="payment-container">
      <h1 className="payment-title">Payment</h1>

      {/* ORDER ITEMS WITH IMAGE */}
      <div className="payment-items">
        {user.cart.map(item => (
          <div key={item.id} className="payment-item">

            {/* ✅ IMAGE */}
            <img
              src={item.image}
              alt={item.title}
              className="payment-item-image"
            />

            <div className="payment-item-info">
              <span className="payment-item-title">
                {item.title} × {item.quantity}
              </span>
              <span className="payment-item-price">
                ₹{item.price * item.quantity}
              </span>
            </div>

          </div>
        ))}
      </div>

      {/* PAYMENT DETAILS */}
      <div className="payment-details">
        <h3>Payment Details</h3>

        <div className="detail-row">
          <span>Payment Method</span>
          <span>Card</span>
        </div>

        <div className="detail-row">
          <span>Card</span>
          <span>**** **** **** 1234</span>
        </div>

        <div className="detail-row">
          <span>Status</span>
          <span className="paid-status">Ready to Pay</span>
        </div>
      </div>

      {/* TOTAL */}
      <div className="payment-total">
        <span>Total</span>
        <span>₹{totalAmount}</span>
      </div>

      <button className="pay-btn" onClick={handlePayment}>
        Pay Now
      </button>
    </div>
  );
}

export default Payment;
 