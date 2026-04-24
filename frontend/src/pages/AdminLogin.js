import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css"; // Make sure this file contains your CSS
import Footer from "../components/Footer";

function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Admin login data:", formData);
    // TODO: Add authentication logic

    // Navigate to home after login
    navigate("/");
  };

  return (
    <>
    <div id="mainBox">
      {/* Form Box */}
      <div className="login-box">
        <h2>Admin Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />

          <button type="submit">Login</button>
        </form>

        <p className="signup-text">
          Don't have an admin account? <a href="/register-admin">Register here</a>
        </p>
      </div>

      {/* Image Box */}
      <div className="img-box">
        <img
          src="https://w0.peakpx.com/wallpaper/293/964/HD-wallpaper-the-tuxedo-suit-tie.jpg"
          alt="Admin Login"
        />
      </div>
    </div>
    <Footer/>
    </>
  );
}

export default AdminLogin;