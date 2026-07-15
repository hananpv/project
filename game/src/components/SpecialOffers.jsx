
import React from 'react';
import '../css/SpecialOffers.css';
const SpecialOffers = () => {

  return (
    <section className="offers-section">
      <div className="section-header">
        <h2 className='hed'>Special Offers</h2>
        <a href="/deals" className="view-all">View All Deals →</a>
      </div>
      <div className="offers-container">
        <div className="offer-banner primary-offer">
          <div className="offer-content">
            <span className="offer-tag">UP TO 70% OFF</span>
            <h3>Summer Sale Extravaganza</h3>
            <p>Don't miss out on our biggest sale of the year!</p>
            <button className="shop-now-btn">Shop Now</button>
          </div>
          <div className="offer-space"></div>
        </div>
        <div className="offer-banner secondary-offer">
          <div className="offer-content">
            <span className="offer-tag">NEW RELEASE</span>
            <h3>Pre-order Now Available</h3>
            <p>Get exclusive bonuses with early pre-orders</p>
            <button className="shop-now-btn">Pre-order</button>
          </div>
          <div className="offer-space"></div>
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;