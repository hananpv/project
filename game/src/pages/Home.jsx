
import React, { useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import FeaturedGames from '../components/FeaturedGames';
import CategorySection from '../components/CategorySection';
import SpecialOffers from '../components/SpecialOffers';
import '../css/Home.css';

const Home = () => {
  // Create floating particles
  useEffect(() => {
    const particles = document.querySelectorAll('.particle');
    particles.forEach(particle => {
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
    });
  }, []);

  return (
    <div className="home-page">
      {/* Decorative Elements */}
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      
      <div className="glow-orb glow-orb-1"></div>
      <div className="glow-orb glow-orb-2"></div>
      
      {/* Scroll Progress Indicator */}
      <div className="scroll-progress"></div>

      {/* Content Sections */}
      <div className="section-container">
        <HeroSection />
        <div className="section-divider"></div>
        <FeaturedGames />
        <div className="section-divider"></div>
        <CategorySection />
        <div className="section-divider"></div>
        <SpecialOffers />
        <div className="section-divider"></div>
       
      </div>
    </div>
  );
};

export default Home;