import React, { useEffect, useState, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/wishListContext';
import '../css/game.css';
import { api, getImageUrl } from '../api/Axios';
import { useLocation, useNavigate } from 'react-router-dom';

function Game() {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const getQueryParams = () => {
    const query = new URLSearchParams(location.search);
    return {
      urlSearch: query.get('search') || '',
      urlCategory: query.get('category') || '',
      urlPage: parseInt(query.get('page') || '1', 10),
    };
  };

  const { urlSearch, urlCategory, urlPage } = getQueryParams();

  const [searchInput, setSearchInput] = useState(urlSearch || urlCategory);
  const [search, setSearch] = useState(urlSearch);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [page, setPage] = useState(urlPage);
  const [games, setGames] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [showDropdown, setShowDropdown] = useState(false);

  // Suggestions: categories that match the typed input
  const categorySuggestions = allCategories.filter(cat =>
    cat.toLowerCase().includes(searchInput.toLowerCase()) && searchInput.length > 0
  );

  // Keep state in sync with URL
  useEffect(() => {
    const { urlSearch: s, urlCategory: c, urlPage: p } = getQueryParams();
    setSearch(s);
    setSelectedCategory(c);
    setSearchInput(c || s);
    setPage(p);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // Load all categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/games', { params: { limit: 1000 } });
        const unique = Array.from(
          new Set((data.games || []).map(g => g.category).filter(Boolean))
        );
        setAllCategories(unique);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch games whenever filters change
  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 12 };
        if (search) params.search = search;
        if (selectedCategory) params.category = selectedCategory;
        const { data } = await api.get('/games', { params });
        setGames(data.games || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error('Failed to fetch games', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, [page, search, selectedCategory]);

  const updateUrl = (s, cat, p) => {
    const params = new URLSearchParams();
    if (s) params.set('search', s);
    if (cat) params.set('category', cat);
    if (p && p !== 1) params.set('page', p);
    navigate({ pathname: location.pathname, search: params.toString() });
  };

  // When user types in the search box — do game title search
  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchInput(val);
    setShowDropdown(true);

    // If there was a category active, clear it and search by title
    setSelectedCategory('');
    setSearch(val);
    setPage(1);
    updateUrl(val, '', 1);
  };

  // When user picks a category from the dropdown
  const handleCategorySelect = (cat) => {
    setSearchInput(cat);
    setSelectedCategory(cat);
    setSearch('');
    setPage(1);
    setShowDropdown(false);
    updateUrl('', cat, 1);
  };

  // Clear everything
  const handleClear = () => {
    setSearchInput('');
    setSearch('');
    setSelectedCategory('');
    setPage(1);
    setShowDropdown(false);
    navigate({ pathname: location.pathname, search: '' });
  };

  const goToPage = (newPage) => {
    setPage(newPage);
    updateUrl(search, selectedCategory, newPage);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* ===== Unified Search Box ===== */}
      <div className="unified-search-wrapper" ref={searchRef}>
        <div className="unified-search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search games or categories..."
            value={searchInput}
            onChange={handleInputChange}
            onFocus={() => setShowDropdown(true)}
            className="unified-search-input"
          />
          {/* Show active filter type badge */}
          {selectedCategory && (
            <span className="search-mode-badge category-mode">Category</span>
          )}
          {search && !selectedCategory && (
            <span className="search-mode-badge title-mode">Games</span>
          )}
          {/* Clear button */}
          {searchInput && (
            <button className="search-clear-btn" onClick={handleClear}>✕</button>
          )}
        </div>

        {/* Dropdown suggestions */}
        {showDropdown && categorySuggestions.length > 0 && (
          <div className="search-dropdown">
            <div className="search-dropdown-label">Categories</div>
            {categorySuggestions.map(cat => (
              <div
                key={cat}
                className={`search-dropdown-item ${selectedCategory === cat ? 'active' : ''}`}
                onMouseDown={() => handleCategorySelect(cat)}
              >
                <span className="dropdown-item-icon">🏷️</span>
                <span>{cat}</span>
                {selectedCategory === cat && <span className="dropdown-check">✓</span>}
              </div>
            ))}
            {search && (
              <>
                <div className="search-dropdown-label" style={{ marginTop: '6px' }}>
                  Press Enter to search "{search}" in titles
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Active filter chips */}
      {(selectedCategory || search) && (
        <div className="active-filters">
          {selectedCategory && (
            <span className="filter-chip category-chip">
              🏷️ {selectedCategory}
              <button onClick={() => { setSelectedCategory(''); setSearchInput(''); updateUrl(search, '', page); }}>✕</button>
            </span>
          )}
          {search && !selectedCategory && (
            <span className="filter-chip title-chip">
              🔍 "{search}"
              <button onClick={handleClear}>✕</button>
            </span>
          )}
        </div>
      )}

      {/* ===== Games Grid ===== */}
      {loading ? (
        <h2 style={{ textAlign: 'center' }}>Loading games...</h2>
      ) : (
        <>
          <div className="games-container">
            {games.length === 0 ? (
              <h2 style={{ textAlign: 'center', width: '100%' }}>No games found.</h2>
            ) : (
              games.map(game => {
                if (!game?.id && !game?._id) return null;
                const gameId = game.id || game._id;
                const wishlisted = isInWishlist(gameId);
                return (
                  <div className="game-card" key={gameId}>
                    <div className="game-image">
                      <img src={getImageUrl(game.image)} alt={game.title} />
                      <button
                        className={`wishlist-btn ${wishlisted ? 'active' : ''}`}
                        onClick={() =>
                          wishlisted ? removeFromWishlist(gameId) : addToWishlist(game)
                        }
                      >
                        {wishlisted ? '♥' : '♡'}
                      </button>
                    </div>
                    <div className="game-info">
                      <h3 className="game-title">{game.title}</h3>
                      <p className="game-meta">{game.developer} • {game.year}</p>
                      <p className="game-meta">🎮 {game.platform} | ⭐ {game.rating}</p>
                      <p className="game-description">{game.description}</p>
                      <p className="game-price">₹{game.price}</p>
                      <div className="game-actions">
                        <button className="add-to-cart-btn" onClick={() => addToCart(game)}>
                          Add to Cart
                        </button>
                        <button className="buy-now-btn" onClick={() => addToCart(game)}>
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
              >
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  className={`page-btn ${p === page ? 'active' : ''}`}
                  onClick={() => goToPage(p)}
                >
                  {p}
                </button>
              ))}
              <button
                className="page-btn"
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default Game;