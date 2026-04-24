import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";
import Footer from "../components/Footer";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    secondName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    gender: "",
    role: "customer",
    terms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form submitting...");

    if (formData.password !== formData.confirmPassword) {
      return;
    }

    if (!formData.terms) {
      return;
    }

    try {
      const payload = {
        username: formData.firstName + "_" + formData.phone,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        first_name: formData.firstName,
        last_name: formData.secondName,
      };

      console.log("Sending Data:", payload);

      await axios.post("http://127.0.0.1:8000/api/register/", payload);

      console.log("API SUCCESS");

      navigate("/login");
    } catch (error) {
      console.error("API ERROR:", error);

      if (error.response) {
        console.log("Backend Error:", error.response.data);
      } else {
        console.log("Server not responding!");
      }
    } finally {
    }
  };

  return (
    <>
      <div className="register-container">
        <div className="box-img">
          <img
            src="https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/advisor/wp-content/uploads/2022/08/Image_-_E-Commerce_Website_.jpeg.jpg"
            alt="Register"
          />
        </div>

        <div className="box-form">
          <h1>Register</h1>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="secondName"
              placeholder="Second Name"
              value={formData.secondName}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="customer">User</option>
              <option value="admin">Admin</option>
            </select>

            <div className="gender-box">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={formData.gender === "Male"}
                  onChange={handleChange}
                />
                Male
              </label>

              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={formData.gender === "Female"}
                  onChange={handleChange}
                />
                Female
              </label>
            </div>

            <div className="terms-box">
              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
              />
              <span>Accept Terms</span>
            </div>
          </form>

          <button
            onClick={() => navigate("/login")}
            style={{ marginTop: "10px" }}
          >
            Go to Login
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Register;
