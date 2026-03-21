import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-brand">
          <h3>ProHardware</h3>
          <p>Your trusted source for professional grade tools and spare parts.</p>
        </div>
        <div className="footer-links">
          <p>&copy; {new Date().getFullYear()} ProHardware. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
