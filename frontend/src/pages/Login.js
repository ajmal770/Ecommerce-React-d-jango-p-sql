import React, { useState } from "react";
import "./Login.css";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.type === "email" ? "email" : "password"]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login/", {
        email: formData.email,
        password: formData.password,
      });

      const { token, role, username, email } = response.data;
      localStorage.setItem("token", token.access);
      localStorage.setItem("role", role);
      
      
      const displayUsername = username.includes("_") ? username.split("_")[0] : username;
      const phone = username.includes("_") ? username.split("_")[1] : "N/A";
      
      localStorage.setItem("username", displayUsername);
      localStorage.setItem("email", email || "");
      localStorage.setItem("phone", phone);

      if (role === "admin") {
        navigate("/"); 
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login Error:", error);
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        alert("Login failed: Invalid email or password");
      } else {
        // The request was made but no response was received (e.g., server down)
        alert("Server not responding! Please ensure the backend is running.");
      }
    }
  };

  return (
    <>
      <div className="container" id="mainBox">
        <div className="img-box">
          <img
            src="https://img.freepik.com/premium-photo/set-new-power-tools-isolated-black-background-drill-puncher-electric-saw-jigsaw-circular-saw_154092-20249.jpg"
            alt="Login"
          />
        </div>

        <div className="login-box">
          <h1>Welcome Back</h1>

          <form className="login-form" onSubmit={handleSubmit}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              required
              value={formData.email}
              onChange={handleChange}
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              required
              value={formData.password}
              onChange={handleChange}
            />

            <div className="form-options">
              <label className="remember">
                <input type="checkbox" /> Remember me
              </label>

              <Link to="/forgot-password" className="forgot-link">
                Forgot Password?
              </Link>
              
            </div>

            <button type="submit">Login</button>

            <p className="signup-text">
              New user? <Link to="/register">Sign up</Link>
            </p>
          </form>
        </div>
      </div>
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
    </>
  );
}

export default Login;
