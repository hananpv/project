
import React from 'react';
import "../css/featuredgames.css"
const FeaturedGames = () => {
  const featuredGames = [
    {
      id: 1,
      title: "Cyberpunk 2077",
      category: "Open World",
      price: "$49.99",
      rating: 4.5,
      image: "products/cuberpunk.jpg"
    },
    {
      id: 2,
      title: "The Witcher 2",
      category: "Story Mode",
      price: "$39.99",
      rating: 4.9,
      image: "products/witcher 2.jpg"
    },
    {
      id: 3,
      title: "Battlefield 2042",
      category: "Battle Ground",
      price: "$59.99",
      rating: 4.8,
      image: "products/battlefield 2042.jpg"
    },
    {
      id: 4,
      title: "Forza Horizon 4",
      category: "Car Games",
      price: "₹2000",
      rating: 4.7,
      image: "products/forza horizen 4.jpg"
    }
  ];

  return (
    <section className="featured-section">
      <div className="section-header">
        <h2 className='hed'>Featured Games</h2>
        <a href="/games" className="view-all">View All →</a>
      </div>
      <div className="games-grid">
        {featuredGames.map(game => (
          <div key={game.id} className="game-card">
            <div className="game-image">
              <img src={game.image} alt={game.title} />
              <div className="game-badge">{game.category}</div>
            </div>
            <div className="game-info">
              <h3>{game.title}</h3>
              <div className="game-meta">
                <span className="game-category">{game.category}</span>
                <span className="game-rating">⭐ {game.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedGames;