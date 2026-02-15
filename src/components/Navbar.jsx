import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ setIsLoggedIn, cartCount = 0, wishlistCount = 0 }) => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'User';

  const handleLogout = () => {
    // Clear ALL localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('cartItems');
    localStorage.removeItem('wishlistItems');
    
    // Update App.js state
    if (setIsLoggedIn) {
      setIsLoggedIn(false);
    }
    
    // Redirect to login
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark py-3">
      <div className="container">
        <Link className="navbar-brand fs-3 fw-bold" to="/home">
          🛒 DheeKart
        </Link>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto fs-5">
            <li className="nav-item px-2">
              <Link className="nav-link" to="/home">Home</Link>
            </li>
            <li className="nav-item px-2">
              <Link className="nav-link position-relative" to="/cart">
                Cart 
                {cartCount > 0 && (
                  <span className="badge bg-success ms-1 rounded-pill">{cartCount}</span>
                )}
              </Link>
            </li>
            <li className="nav-item px-2">
              <Link className="nav-link position-relative" to="/wishlist">
                Wishlist
                {wishlistCount > 0 && (
                  <span className="badge bg-danger ms-1 rounded-pill">{wishlistCount}</span>
                )}
              </Link>
            </li>
          </ul>
          
          {/* OPTION 1: FIXED DROPDOWN WITH LOGOUT BUTTON */}
          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle btn btn-link text-white fs-5"
                id="navbarDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ background: 'none', border: 'none' }}
              >
                👤 {userName}
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                <li>
                  <button 
                    className="dropdown-item text-danger fw-bold" 
                    onClick={handleLogout}
                  >
                    🚪 Logout
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;