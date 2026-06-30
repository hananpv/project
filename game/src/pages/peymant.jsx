import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { api, getImageUrl } from '../api/Axios';
import '../css/payment.css';
import { toast } from 'react-toastify';




function Payment() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();

  const [method, setMethod] = useState("card");
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: ""
  });
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    cardHolderName: "",
    cardExpiry: "",
    upiId: ""
  });

  if (!cart?.length) return <div className="payment-empty">No items to pay</div>;

  const totalAmount = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const handlePayment = async () => {
    if (
      !address.name ||
      address.phone.length !== 10 ||
      !address.address ||
      !address.city ||
      !address.state ||
      !address.zipCode
    ) {
      return toast.error("Please fill all address details");
    }

    if (method === "card") {
      if (!paymentDetails.cardNumber || !paymentDetails.cardHolderName || !paymentDetails.cardExpiry) {
        return toast.error("Please fill all card details");
      }
      const cleanCard = paymentDetails.cardNumber.replace(/\s/g, "");
      if (cleanCard.length < 15 || cleanCard.length > 19 || !/^\d+$/.test(cleanCard)) {
        return toast.error("Invalid card number format");
        
      }
      if (!/^\d{2}\/\d{2}$/.test(paymentDetails.cardExpiry)) {
        return toast.error("Expiry must be in MM/YY format");
      }
    } else if (method === "upi") {
      if (!paymentDetails.upiId || !paymentDetails.upiId.includes("@")) {
        return toast.error("Please enter a valid UPI ID (e.g. user@bank)");
      }
    }

    try {
      await api.post('/orders', {
        paymentMethod: method,
        address,
        paymentDetails: method === "cod" ? {} : paymentDetails,
      });
      clearCart();
      toast.success("Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order");
    }
  };

  return (
    <div className="payment-container">

      <h1 className="payment-title">Checkout</h1>

      {/* Items */}
      <div className="payment-items">
        {cart.map(i => (
          <div key={i.id} className="payment-item">
            <img src={getImageUrl(i.image)} alt={i.title} />
            <div className="payment-left">
              <p className="payment-name">{i.title}</p>
              <p className="payment-sub">₹{i.price} × {i.quantity}</p>
            </div>
            <div className="payment-right">₹{i.price * i.quantity}</div>
          </div>
        ))}
      </div>

      {/* Address */}
      <div className="payment-section">
        <h3>Delivery Address</h3>
        <div className="address-grid">
          <input placeholder="Full Name" value={address.name}
            onChange={e => setAddress({ ...address, name: e.target.value })} />

          <input placeholder="Phone Number (10 digits)" maxLength={10} value={address.phone}
            onChange={e => setAddress({ ...address, phone: e.target.value.replace(/\D/g, "") })} />

          <input placeholder="Street Address / Building" value={address.address}
            onChange={e => setAddress({ ...address, address: e.target.value })} />

          <input placeholder="City" value={address.city}
            onChange={e => setAddress({ ...address, city: e.target.value })} />

          <input placeholder="State" value={address.state}
            onChange={e => setAddress({ ...address, state: e.target.value })} />

          <input placeholder="Zip / Postal Code" value={address.zipCode}
            onChange={e => setAddress({ ...address, zipCode: e.target.value.replace(/\D/g, "") })} />
        </div>
      </div>

      {/* Payment */}
      <div className="payment-section">
        <h3>Payment Method</h3>

        <div className="payment-methods-selector">
          {["card", "upi", "cod"].map(m => (
            <label key={m} className={`payment-method-option ${method === m ? 'selected' : ''}`}>
              <input type="radio" name="p" value={m}
                checked={method === m}
                onChange={e => setMethod(e.target.value)} />
              <span>{m === "cod" ? "Cash On Delivery (COD)" : m.toUpperCase()}</span>
            </label>
          ))}
        </div>

        {method === "card" && (
          <div className="payment-inputs card-inputs">
            <input 
              placeholder="Card Number (16 digits)" 
              maxLength={19} 
              value={paymentDetails.cardNumber}
              onChange={e => {
                let val = e.target.value.replace(/\D/g, "");
                let formatted = val.match(/.{1,4}/g)?.join(" ") || val;
                setPaymentDetails({ ...paymentDetails, cardNumber: formatted });
              }} 
            />
            <div className="card-sub-inputs">
              <input 
                placeholder="Cardholder Name" 
                value={paymentDetails.cardHolderName}
                onChange={e => setPaymentDetails({ ...paymentDetails, cardHolderName: e.target.value })} 
              />
              <input 
                placeholder="Expiry (MM/YY)" 
                maxLength={5} 
                value={paymentDetails.cardExpiry}
                onChange={e => {
                  let val = e.target.value.replace(/\D/g, "");
                  if (val.length > 2) {
                    val = val.slice(0, 2) + "/" + val.slice(2, 4);
                  }
                  setPaymentDetails({ ...paymentDetails, cardExpiry: val });
                }} 
              />
            </div>
          </div>
        )}

        {method === "upi" && (
          <div className="payment-inputs upi-inputs">
            <input 
              placeholder="UPI ID (e.g. username@upi)" 
              value={paymentDetails.upiId}
              onChange={e => setPaymentDetails({ ...paymentDetails, upiId: e.target.value })} 
            />
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
