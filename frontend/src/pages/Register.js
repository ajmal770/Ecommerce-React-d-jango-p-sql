import React, { useState } from 'react';
import "./Register.css";

function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    secondName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    gender: "",
    terms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (!formData.terms) {
      alert("Please accept Terms & Conditions");
      return;
    }
    console.log(formData);
    alert("Registration Successful!");
  };

  return (
    <>
      <div className='register-container'>

        {/* Left Image Box */}
        <div className='box-img'>
          <img
            src="https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/advisor/wp-content/uploads/2022/08/Image_-_E-Commerce_Website_.jpeg.jpg"
            alt="Register"
          />
        </div>

        {/* Right Form Box */}
        <div className='box-form'>
          <h1>Register</h1>
          <form onSubmit={handleSubmit}>
            <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required />
            <input type="text" name="secondName" placeholder="Second Name" onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email ID" onChange={handleChange} required />
            <input type="tel" name="phone" placeholder="Phone Number" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required />

            {/* Gender */}
            <div className="gender">
              <label>
                <input type="radio" name="gender" value="Male" onChange={handleChange} /> Male
              </label>
              <label>
                <input type="radio" name="gender" value="Female" onChange={handleChange} /> Female
              </label>
            </div>

            {/* Terms */}
            <div className="terms">
              <input type="checkbox" name="terms" onChange={handleChange} />
              <span>I agree to Terms & Conditions</span>
            </div>

            <button type="submit">Register</button>
          </form>
        </div>
      </div>

      {/* Footer Section */}
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
    </>
  );
}

export default Register;