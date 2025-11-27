import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import moengage from "@moengage/web-sdk";

const Header = () => {
  const { currentUser, logout, cart } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    	moengage.destroy_session();
        

    logout();
    navigate('/login');
  };

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <h1>ShopEasy</h1>
        </Link>
        
        <nav className="nav">
          {currentUser ? (
            <>
              <span className="welcome">Welcome, {currentUser.name}</span>
              <Link to="/cart" className="cart-link">
                Cart ({cartItemsCount})
              </Link>
              <button onClick={handleLogout} className="btn btn-outline">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;