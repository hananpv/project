import React from "react";
import "../css/HeroSection.css";
import { useNavigate } from "react-router-dom";
import heroVideo from '../assets/_720P.mp4';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="hero-section">

      {/* Video Background */}
      <video
        className="hero-video"
        autoPlay
        loop
        muted
        playsInline
      >
<source src={heroVideo} type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="hero-overlay"></div>

      {/* Content */}
      <div className="hero-content">
        <h1 className="hero-title">PIXELVAULT</h1>

        <div className="hero-buttons">
          <button
            className="btn-primary"
            onClick={() => navigate("/games")}
          >
            Browse Games
          </button>

          <button
            className="btn-secondary"
            onClick={() => navigate("/about")}
          >
            Learn More
          </button>
        </div>
      </div>

    </section>
  );
};

export default HeroSection;
