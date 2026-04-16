import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { api } from '../api/Axios';
import '../css/payment.css';
import { toast } from 'react-toastify';




function Payment() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { cart, clearCart } = useCart();

  const [method, setMethod] = useState("card");
  const [address, setAddress] = useState({ name: "", phone: "", address: "" });

  if (!cart?.length) return <div className="payment-empty">No items to pay</div>;

  const totalAmount = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const handlePayment = async () => {
    if (!address.name || address.phone.length !== 10 || !address.address)
      return toast.error("Fill all details");

   const payment = {
  id: Date.now(),

  date: new Date().toISOString(), //  ADD THIS

  items: cart.map(({ id, title, price, quantity }) => ({
    id,
    title,
    price,
    quantity
  })),

  totalAmount,
  paymentMethod: method,
  address,
  status: method === "cod" ? "Pending" : "Paid"
};

    try {
      const res = await api.patch(`/users/${user.id}`, {
        ...user,
        cart: [],
        payments: [...(user.payments || []), payment]
      });

      updateUser(res.data);
      clearCart();
      toast.success("Order placed!");
      navigate("/orders");
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <div className="payment-container">

      <h1 className="payment-title">Checkout</h1>

      {/* Items */}
      <div className="payment-items">
        {cart.map(i => (
          <div key={i.id} className="payment-item">
            <img src={i.image} alt={i.title} />
            <div className="payment-left">
              <p>{i.title}</p>
              <p>₹{i.price} × {i.quantity}</p>
            </div>
            <div className="payment-right">₹{i.price * i.quantity}</div>
          </div>
        ))}
      </div>

      {/* Address */}
      <div className="payment-section">
        <h3>Delivery Address</h3>

        <input placeholder="Name"
          onChange={e => setAddress({ ...address, name: e.target.value })} />

        <input placeholder="Phone" maxLength={10}
          onChange={e => setAddress({ ...address, phone: e.target.value.replace(/\D/g, "") })} />

        <textarea placeholder="Address"
          onChange={e => setAddress({ ...address, address: e.target.value })} />
      </div>

      {/* Payment */}
      <div className="payment-section">
        <h3>Payment</h3>

        {["card", "upi", "cod"].map(m => (
          <label key={m}>
            <input type="radio" name="p" value={m}
              checked={method === m}
              onChange={e => setMethod(e.target.value)} />
            {m.toUpperCase()}
          </label>
        ))}

        {method !== "cod" && (
          <div className="payment-inputs">
            <input placeholder={method === "upi" ? "UPI ID" : "Card Number"} />
          </div>
        )}
      </div>

      {/* Total */}
      <div className="payment-total">
        <span>Total</span>
        <span>₹{totalAmount}</span>
      </div>

      <button className="pay-btn" onClick={handlePayment}>
        Place Order
      </button>

    </div>
  );
}

export default Payment;