import React from "react";
import { useNavigate } from "react-router-dom";
import "./Footer.css";

function Footer() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user session
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Navigate to logout page
    navigate("/logout");
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>About</h4>
          <p>About Us</p>
          <p>Careers</p>
        </div>

        <div className="footer-section">
          <h4>Help</h4>
          <p>Payments</p>
          <p>Shipping</p>
          <p>Returns</p>
        </div>

        <div className="footer-section">
          <h4>Policy</h4>
          <p>Terms of Use</p>
          <p>Privacy</p>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: support@shop.com</p>
          <p>Phone: +91 98765 43210</p>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 YourShop</p>
      </div>
    </footer>
  );
}

export default Footer;