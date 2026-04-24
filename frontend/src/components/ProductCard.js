import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./ProductCard.css";

function ProductCart() {
  const [cart, setCart] = useState([]);
  const [popup, setPopup] = useState(false);
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState("");

  // LOAD DATA
  useEffect(() => {
    try {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      const savedAddress = localStorage.getItem("address") || "";
      const savedLocation = localStorage.getItem("location") || "";

      setCart(storedCart);
      setAddress(savedAddress);
      setLocation(savedLocation);
    } catch (err) {
      console.log("LocalStorage error:", err);
    }
  }, []);

  // AUTO SAVE LOCAL
  useEffect(() => {
    localStorage.setItem("address", address);
  }, [address]);

  useEffect(() => {
    localStorage.setItem("location", location);
  }, [location]);

  // SAVE TO DJANGO (FIXED)
  const saveToDatabase = useCallback(async () => {
    try {
      await axios.post("http://127.0.0.1:8000/api/save-cart/", {
        items: cart,
        address: address,
        location: location,
      });
      console.log("Saved to DB");
    } catch (err) {
      console.log("API Error:", err);
    }
  }, [cart, address, location]);

  // AUTO SAVE TO DB (FIXED)
  useEffect(() => {
    if (cart.length > 0 && address && location) {
      saveToDatabase();
    }
  }, [cart, address, location, saveToDatabase]);

  // UPDATE QTY
  const updateQuantity = (index, type) => {
    let updated = [...cart];

    if (type === "inc") updated[index].quantity += 1;
    else if (updated[index].quantity > 1) updated[index].quantity -= 1;

    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // DELETE ITEM
  const removeItem = (index) => {
    let updated = cart.filter((_, i) => i !== index);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // TOTAL CALCULATION
  const total = cart.reduce((acc, item) => {
    const price = parseFloat(item.price.replace(/[₹,]/g, ""));
    return acc + price * item.quantity;
  }, 0);

  const delivery = cart.length > 0 ? 50 : 0;

  // PLACE ORDER
  const placeOrder = () => {
    setPopup(true);
    setCart([]);
    localStorage.removeItem("cart");
  };

  return (
    <div className="cart-container">

      {/* TOP */}
      <div className="top-section">
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Delivery Address"
        />

        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
        />
      </div>

      <div className="main-section">

        {/* LEFT */}
        <div className="cart-items">
          <h2>🛒 Cart Items</h2>

          {cart.length === 0 ? (
            <p>No items added</p>
          ) : (
            cart.map((item, i) => (
              <div className="cart-item" key={i}>
                <img src={item.img} alt={item.name} />

                <div>
                  <h4>{item.name}</h4>
                  <p>{item.price}</p>

                  <div className="qty">
                    <button onClick={() => updateQuantity(i, "dec")}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(i, "inc")}>+</button>
                  </div>

                  <button
                    className="delete-btn"
                    onClick={() => removeItem(i)}
                  >
                    Remove ❌
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* RIGHT */}
        <div className="summary">
          <h2>Order Summary</h2>

          <p>Items: {cart.length}</p>
          <p>MRP: ₹{total}</p>
          <p>Delivery: ₹{delivery}</p>

          <hr />

          <h3>Total: ₹{total + delivery}</h3>

          <button onClick={placeOrder}>Place Order</button>
        </div>
      </div>

      {/* POPUP */}
      {popup && (
        <div className="popup">
          <div className="popup-box">
            <h2>✅ Order Placed Successfully!</h2>
            <button onClick={() => setPopup(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductCart;