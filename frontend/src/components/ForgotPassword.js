import React, { useState } from "react";
import axios from "axios";
import "./ForgotPassword.css";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Password match check
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/forgot-password/",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      alert(res.data.msg);
      navigate("/login");

    } catch (error) {
      console.error(error.response?.data);
      alert(error.response?.data?.error || "Error resetting password");
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-box">
        <h2>Reset Password</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            required
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="New Password"
            required
            onChange={handleChange}
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            required
            onChange={handleChange}
          />

          <button type="submit">Reset Password</button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;