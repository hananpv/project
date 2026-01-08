
import React from 'react';

import '../css/About.css'
const About = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <h1 className="hero-title">About <span className="highlight">PIXELVAULT</span></h1>
          <p className="hero-subtitle">Redefining Gaming Experiences Since 2023</p>
          <div className="hero-decoration">
            <div className="pixel-dot"></div>
            <div className="pixel-dot"></div>
            <div className="pixel-dot"></div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-header">
            <h2>Our Gaming Vision</h2>
            <div className="section-divider"></div>
          </div>
          
          <div className="mission-content">
            <div className="mission-card">
              <div className="mission-icon">🎮</div>
              <h3>Game Distribution</h3>
              <p>We curate and sell the finest collection of games across all genres, from AAA titles to indie gems.</p>
            </div>
            
            <div className="mission-card">
              <div className="mission-icon">🚀</div>
              <h3>Pre-Play & Pre-Sales</h3>
              <p>Get exclusive early access and special offers with our premium pre-play and pre-sale programs.</p>
            </div>
            
            <div className="mission-card">
              <div className="mission-icon">💡</div>
              <h3>Game Development</h3>
              <p>Currently developing our own gaming experiences that will redefine entertainment standards.</p>
              <span className="construction-badge">Under Construction</span>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="roadmap-section">
        <div className="container">
          <div className="roadmap-header">
            <h2>Our Development Journey</h2>
            <p className="roadmap-subtitle">Building the Future of Gaming</p>
          </div>
          
          <div className="roadmap-timeline">
            <div className="timeline-item current">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h4>2023 - 2024</h4>
                <h3>Platform Establishment</h3>
                <p>Launching PIXELVAULT as a premier game distribution platform</p>
              </div>
            </div>
            
            <div className="timeline-item upcoming">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h4>2024 - 2025</h4>
                <h3>In-House Development</h3>
                <p>Developing our first original game titles</p>
              </div>
            </div>
            
            <div className="timeline-item future">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h4>2025+</h4>
                <h3>Game Release</h3>
                <p>Launching our exclusive game franchises worldwide</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Section */}
      <section className="office-section">
        <div className="container">
          <div className="office-content">
            <div className="office-info">
              <h2>Our Roots</h2>
              <div className="location-card">
                <div className="location-icon">📍</div>
                <div className="location-details">
                  <h3>Kerala, India</h3>
                  <p className="location-description">
                    Based in God's Own Country, we're blending traditional craftsmanship with cutting-edge technology 
                    to create gaming experiences that resonate globally.
                  </p>
                  <div className="location-tags">
                    <span className="tag">🎯 Innovation Hub</span>
                    <span className="tag">🌴 Tropical Creativity</span>
                    <span className="tag">🎮 Gaming Culture</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="office-visual">
              <div className="map-visual">
                <div className="map-dot"></div>
                <div className="map-rings">
                  <div className="ring"></div>
                  <div className="ring"></div>
                  <div className="ring"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Thank You Section */}
      <section className="thankyou-section">
        <div className="container">
          <div className="thankyou-content">
            <div className="thankyou-icon">✨</div>
            <h2>Thank You for Visiting!</h2>
            <p className="thankyou-message">
              Your support fuels our passion for gaming. We're committed to delivering exceptional 
              gaming experiences and building a community that celebrates the art of play.
            </p>
            <div className="thankyou-actions">
              <a href="/games" className="action-btn primary">Browse Games</a>
              <a href="/contact" className="action-btn secondary">Contact Us</a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <div className="construction-note">
        <div className="construction-icon">🚧</div>
        <p>PIXELVAULT Game Development - Exciting Things Coming Soon!</p>
        <div className="pulse-animation"></div>
      </div>
    </div>
  );
};

export default About;