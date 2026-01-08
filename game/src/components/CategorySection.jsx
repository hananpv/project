
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/catogory.css'
const CategorySection = () => {
  const navigate = useNavigate();
  
  const categories = [
    {
      name: "Battle Ground",
    
      description: "Competitive multiplayer combat arenas",
      image: "products/bba.jpg"
    },
    {
      name: "Open World",
 
      description: "Explore vast virtual worlds freely",
      image: "products/stt.jpg"
    },
    {
      name: "Story Mode",
   
      description: "Immersive narrative experiences",
      image: "products/storymod.jpg"
    },
    {
      name: "Car Games",
      
      description: "High-speed racing and driving",
      image: "products/racing.jpg"
    }
  ];

  const handleCategoryClick = (categoryName) => {
    // Navigate to games page with category parameter
    navigate(`/games?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <section className="categories-section">
      <div className="section-header">
        <h2 className='hed'>Browse by Category</h2>
        <a href="/games" className="view-all">All Categories →</a>
      </div>
      <div className="categories-grid">
        {categories.map(category => (
          <div key={category.name} className="category-card">
            <div className="category-image">
              <img src={category.image} alt={category.name} />
              {/* <div className="category-overlay">
                <div className="category-icon">{category.icon}</div>
                <h3>{category.name}</h3>
              </div> */}
            </div>
            <div className="category-content">
              <p>{category.description}</p>
              {/* Update the button to use handleCategoryClick */}

              <button 
                className="explore-btn"
                onClick={() => handleCategoryClick(category.name)}
              >
                Explore Games
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;