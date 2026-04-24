import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Footer from "../components/Footer";
import "./RegisterAdmin.css"; 

function RegisterAdmin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    navigate("/");
  };

  return (
    <>
      <div className="container" id="mainBox">
        
        <div className="img-box">
          <img
            src="https://png.pngtree.com/thumb_back/fh260/background/20220405/pngtree-admin-login-sign-on-a-table-log-in-background-table-photo-image_21904752.jpg"
            alt="Welcome Admin"
          />
        </div>

       
        <div className="login-box">
          <h1>Register Admin</h1>

          <form className="login-form" onSubmit={handleSubmit}>
            <label>Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <button type="submit">Complete Registration</button>

            <p className="signup-text">
  Already have an admin account? <Link to="/admin-login">Login here</Link>
</p>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default RegisterAdmin;