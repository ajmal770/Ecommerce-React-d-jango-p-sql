import React from 'react'
import "./Footer.css"
function Footer() {
  return (
    <div>
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
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 YourShop</p>
        </div>
      </footer>
    </div>
  )
}

export default Footer
