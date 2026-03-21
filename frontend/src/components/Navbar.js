import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, token, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cartItemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🔧</span>
          ProHardware
        </Link>
        <ul className="navbar-links">
          <li><Link to="/">Products</Link></li>
          {user?.is_admin && (
            <li><Link to="/admin-dashboard" className="admin-link">Admin Panel</Link></li>
          )}
          {token ? (
            <>
              <li>
                <Link to="/cart" className="cart-link">
                  🛒 <span className="cart-badge">{cartItemCount}</span>
                </Link>
              </li>
              <li className="user-greeting">Hi, {user?.username}</li>
              <li><button onClick={handleLogout} className="btn btn-outline" style={{padding: '0.4rem 1rem'}}>Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login" className="btn btn-outline" style={{padding: '0.4rem 1rem'}}>Login</Link></li>
              <li><Link to="/register" className="btn btn-primary" style={{padding: '0.4rem 1rem'}}>Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;