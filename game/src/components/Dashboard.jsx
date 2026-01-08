
import React from 'react';
import '../css/Dashboard.css';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
  
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    window.location.href = '/login';
  };
  
  return (
    <div className="dashboard-container">
      <div className="dashboard-wrapper">
        <header className="dashboard-header">
          <div className="dashboard-logo">
            <div className="dashboard-logo-main">PIXELVAULT</div>
            <div className="dashboard-logo-sub">GAME STORE</div>
          </div>
          
          <div className="dashboard-user-info">
            <div className="user-details">
              <div className="user-name">{user.username || 'Gamer'}</div>
              <div className="user-email">{user.email || 'Not set'}</div>
            </div>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </header>
        
        <div className="dashboard-content">
          <h1 className="dashboard-title">
            Welcome back, {user.username || 'Gamer'}! 🎮
          </h1>
          <p className="dashboard-subtitle">
            Ready to explore new games and continue your gaming journey.
          </p>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-number">0</div>
              <div className="stat-label">Games Library</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">🏆</div>
              <div className="stat-number">0</div>
              <div className="stat-label">Achievements</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-number">$0.00</div>
              <div className="stat-label">Wallet</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-number">0</div>
              <div className="stat-label">Friends</div>
            </div>
          </div>
          
          <div className="quick-actions">
            <h2 className="actions-title">Quick Actions</h2>
            <div className="actions-buttons">
              <button className="action-button">Browse Games</button>
              <button className="action-button">View Library</button>
              <button className="action-button">Add Funds</button>
              <button className="action-button">Settings</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;