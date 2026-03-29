import React, { useState } from "react";
import "./AddProduct.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function AddProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    old_price: "",
    img: "",
    category: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://127.0.0.1:8000/api/admin/products/",
        {
          name: formData.name,
          price: parseFloat(formData.price),
          old_price: formData.old_price ? parseFloat(formData.old_price) : null,
          img: formData.img,
          category: formData.category,
          stock: 10,
          description: formData.name,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Product added successfully!");
      setFormData({ name: "", price: "", old_price: "", img: "", category: "" });
    } catch (error) {
      console.error("Error adding product:", error);
      if (error.response && error.response.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
      } else if (error.response && error.response.data) {
        setMessage("Failed to add product: " + JSON.stringify(error.response.data));
      } else {
        setMessage("Failed to add product. Make sure you are an admin.");
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="add-product-container">
        <h2>Add New Product</h2>
        {message && <div className="product-message">{message}</div>}
        <form className="add-product-form" onSubmit={handleSubmit}>
          <label>Product Name</label>
          <input
            type="text"
            name="name"
            placeholder="e.g. Hammer"
            required
            value={formData.name}
            onChange={handleChange}
          />

          <label>Price (₹)</label>
          <input
            type="number"
            name="price"
            placeholder="e.g. 299"
            required
            value={formData.price}
            onChange={handleChange}
          />

          <label>Old Price (₹) [Optional]</label>
          <input
            type="number"
            name="old_price"
            placeholder="e.g. 499"
            value={formData.old_price}
            onChange={handleChange}
          />

          <label>Image URL</label>
          <input
            type="text"
            name="img"
            placeholder="e.g. https://example.com/image.jpg"
            required
            value={formData.img}
            onChange={handleChange}
          />

          <label>Category</label>
          <input
            type="text"
            name="category"
            placeholder="e.g. tool, part, clearance"
            required
            value={formData.category}
            onChange={handleChange}
          />

          <button type="submit">Add Product</button>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default AddProduct;
