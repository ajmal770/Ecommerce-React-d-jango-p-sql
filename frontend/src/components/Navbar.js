import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [location, setLocation] = useState("Fetching...");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  const navigate = useNavigate();

  // Load user
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const username = localStorage.getItem("username");
    if (token) {
      setUser({ name: username, role: role });
    } else {
      setUser(null);
    }
  }, []);

  // Load cart count
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(cart.length);
    };
    updateCartCount();
    // Listen for storage changes (cross-tab) AND custom cartUpdated event (same tab)
    window.addEventListener("storage", updateCartCount);
    window.addEventListener("cartUpdated", updateCartCount);
    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  // Location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setLocation(
            "Location: " +
              pos.coords.latitude.toFixed(2) +
              ", " +
              pos.coords.longitude.toFixed(2)
          ),
        () => setLocation("Location Blocked")
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
    if (search.trim() === "") showMessage("Please enter a product 🔍");
    else showMessage(`You searched: ${search}`);
  };

  const handleAccountClick = () => {
    if (user) {
      navigate("/account");
    } else navigate("/login");
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  return (
    <>
      {message && <div className="custom-message">{message}</div>}

      <nav className="navbar">
        <div className="logo" onClick={() => navigate("/")}>
          Bat Store
        </div>

        <ul className="nav-links">
          <li onClick={() => navigate("/")}>Home</li>
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
          {user && user.role === "admin" && (
            <div className="admin-add-product" onClick={() => navigate("/add-product")}>
              ➕ Add Product
            </div>
          )}
          <div className="location">{location}</div>
          <div className="account" onClick={handleAccountClick}>
            👤 {user ? user.name : "Login"}
          </div>
          <div className="cart" onClick={handleCartClick}>
            🛒 Cart ({cartCount})
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