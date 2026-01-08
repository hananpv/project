
import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
     
        <div className="footer-main">
        
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-main">PIXELVAULT</span>
              <span className="logo-sub">GAME STORE</span>
            </div>
            <p className="footer-description">
              Your ultimate destination for premium gaming experiences. 
              Discover, play, and connect with gamers worldwide.
            </p>
            
          </div>

        
          <div className="footer-links">
            <h3>Quick Links</h3>
            <Link to="/games">Browse Games</Link>
            <Link to="/new-releases">New Releases</Link>
            <Link to="/top-sellers">Top Sellers</Link>
            <Link to="/upcoming">Upcoming Games</Link>
            <Link to="/sales">Sales & Deals</Link>
          </div>

          <div className="footer-links">
            <h3>Support</h3>
            <h5>NUMBER:1111111111</h5>
             <h5>EMAIL:pixel@gmail.com</h5>
          </div>

         
          <div className="footer-links">
            <h3>PIXELVAULT</h3>
            <Link to="/about">About Us</Link>
            
          </div>
        </div>

      
        <div className="footer-bottom">
          <div className="contact-info">
            <div className="contact-item">
              <span className="contact-label">Email:</span>
              <span className="contact-value">support@pixelvault.example.com</span>
            </div>
            <div className="contact-item">
              <span className="contact-label">Phone:</span>
              <span className="contact-value">+1 (555) 123-4567</span>
            </div>
            <div className="contact-item">
              <span className="contact-label">Address:</span>
              <span className="contact-value">123 Gaming Street, Virtual City, VC 10101</span>
            </div>
          </div>

          <div className="footer-bottom-content">
            <div className="copyright">
              © {new Date().getFullYear()} PIXELVAULT Game Store. All rights reserved.
            </div>
            <div className="footer-legal">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/cookies">Cookie Policy</Link>
              <Link to="/legal">Legal</Link>
              <Link to="/sitemap">Sitemap</Link>
            </div>
            <div className="footer-info">
              <span>Made with ❤️ for gamers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;