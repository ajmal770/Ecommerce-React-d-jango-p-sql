import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [location, setLocation] = useState("Fetching...");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate(); // ✅ correct place

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation(
            "Location: " +
              pos.coords.latitude.toFixed(2) +
              ", " +
              pos.coords.longitude.toFixed(2)
          );
        },
        () => {
          setLocation("Location Blocked");
        }
      );
    } else {
      setLocation("Not Supported");
    }
  }, []);

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleSearch = () => {
    if (search.trim() === "") {
      showMessage("Please enter a product 🔍");
    } else {
      showMessage(`You searched: ${search}`);
    }
  };

  return (
    <>
      {message && <div className="custom-message">{message}</div>}

      <nav className="navbar">
        <div className="logo" onClick={() => showMessage("Home clicked")}>
          Bat Store
        </div>

        <ul className="nav-links">
          <li onClick={() => showMessage("Home")}>Home</li>
          <li onClick={() => showMessage("Products")}>Products</li>
          <li onClick={() => showMessage("Offers")}>Offers</li>
          <li onClick={() => showMessage("More")}>More</li>
        </ul>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        <div className="nav-right">
          <div className="location">{location}</div>

          {/* ✅ LOGIN NAVIGATION FIX */}
          <div
            className="account"
            onClick={() => navigate("/login")}
            style={{ cursor: "pointer" }}
          >
            👤 Login
          </div>

          <div className="cart" onClick={() => showMessage("Cart")}>
            🛒 Cart
          </div>
        </div>
      </nav>

      <div className="category-bar">
        <ul>
          <li onClick={() => showMessage("For You")}>For You</li>
          <li onClick={() => showMessage("Electronics")}>Electronics</li>
          <li onClick={() => showMessage("Robotics")}>Robotics</li>
          <li onClick={() => showMessage("Hardware")}>Hardware</li>
          <li onClick={() => showMessage("Beauty")}>Beauty</li>
          <li onClick={() => showMessage("Food")}>Food</li>
          <li onClick={() => showMessage("Books")}>Books</li>
          <li onClick={() => showMessage("Furniture")}>Furniture</li>
        </ul>
      </div>
    </>
  );
}

export default Navbar;