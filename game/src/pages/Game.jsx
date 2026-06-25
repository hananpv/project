import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/wishListContext';
import '../css/game.css';
import { api, getImageUrl, normalizeGame } from "../api/Axios";
import { useLocation } from 'react-router-dom';

function Game() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const { addToCart } = useCart();
  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist
  } = useWishlist();


  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const selectedCategory = searchParams.get('category');


  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await api.get('/games');
        setGames(Array.isArray(res.data) ? res.data.map(normalizeGame) : []); 
      } catch (error) {
        console.error('Failed to load games:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);
  
  const filteredGames = selectedCategory
    ? games.filter(
        game =>
          game.category &&
          game.category.toLowerCase() === selectedCategory.toLowerCase()
      )
    : games;

  if (loading) {
    return <h2 style={{ textAlign: 'center' }}>Loading games...</h2>;
  }

  return (
    <>


      <input
        type="text"
        placeholder="Search games..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="simple-search"
      />

      <div className="games-container">
        {filteredGames
          .filter(game =>
            game.title.toLowerCase().includes(search.toLowerCase())
          )
          .map((game, index) => {
            if (!game?.id) return null;

            const wishlisted = isInWishlist(game.id);

            return (
              <div className="game-card" key={index}>
                <div className="game-image">
                  <img
                    src={getImageUrl(game.image)}
                    alt={game.title}
                  />
 
                  <button
                    className={`wishlist-btn ${wishlisted ? 'active' : ''}`}
                    onClick={() =>
                      wishlisted
                        ? removeFromWishlist(game.id)
                        : addToWishlist(game)
                    } 
                  >
                    {wishlisted ? '♥' : '♡'}
                      </button>
                </div>

                <div className="game-info">
                  <h3 className="game-title">{game.title}</h3>

                  <p className="game-meta">
                    {game.developer} • {game.year}
                  </p>

                  <p className="game-meta">
                    🎮 {game.platform} | ⭐ {game.rating}
                  </p>

                  <p className="game-description">
                    {game.description}
                  </p>

                  <p className="game-price">₹{game.price}</p>

                  <div className="game-actions">
                    <button
                      className="add-to-cart-btn"
                      onClick={() => addToCart(game)}
                    >
                      Add to Cart
                    </button>

                    <button
                      className="buy-now-btn"
                      onClick={() => addToCart(game)}
                    >
                      Buy Now
                    </button>.
                                                                                                                                                                                                                                                                                                                                                                                         
            
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
}

export default Game;
