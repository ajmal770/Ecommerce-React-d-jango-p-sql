import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./ProductCard.css";
import { useNavigate } from "react-router-dom";

function ProductCart() {
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState("");
  const [popup, setPopup] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // LOAD DATA FROM API
  const fetchCart = useCallback(async () => {
    const localCart = JSON.parse(localStorage.getItem("cart")) || [];

    if (!token) {
      setCart(localCart);
      return;
    }

    try {
      const response = await axios.get("http://127.0.0.1:8000/api/cart/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const apiCart = response.data;
      
      // Merge: show local items that aren't in the API yet (like hardcoded items)
      const merged = [...apiCart];
      localCart.forEach(localItem => {
        const alreadyInApi = apiCart.some(apiItem => apiItem.product.id === localItem.product.id);
        if (!alreadyInApi) {
          merged.push(localItem);
        }
      });
      
      setCart(merged);
    } catch (err) {
      console.log("API Error fetching cart, falling back to local:", err);
      setCart(localCart);
    }
  }, [token]);

  useEffect(() => {
    fetchCart();
    const savedAddress = localStorage.getItem("address") || "";
    const savedLocation = localStorage.getItem("location") || "";
    setAddress(savedAddress);
    setLocation(savedLocation);
  }, [fetchCart]);

  // SAVE CONFIGS LOCAL
  useEffect(() => {
    localStorage.setItem("address", address);
    localStorage.setItem("location", location);
  }, [address, location]);

  // UPDATE QTY
  const updateQuantity = async (item, type) => {
    let newQty = item.quantity;
    if (type === "inc") newQty += 1;
    else if (newQty > 1) newQty -= 1;
    else return;

    // Handle local items
    if (!token || (typeof item.id === 'string' && item.id.startsWith('local-'))) {
      let localCart = JSON.parse(localStorage.getItem("cart")) || [];
      let updated = localCart.map(i => i.product.id === item.product.id ? { ...i, quantity: newQty } : i);
      localStorage.setItem("cart", JSON.stringify(updated));
      window.dispatchEvent(new Event("cartUpdated"));
      fetchCart();
      return;
    }

    try {
      await axios.put("http://127.0.0.1:8000/api/cart/", 
        { cart_item_id: item.id, quantity: newQty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    } catch (err) {
      console.log("API Error updating qty:", err);
    }
  };

  // DELETE ITEM
  const removeItem = async (cartItemId) => {
    // Handle local items
    if (!token || (typeof cartItemId === 'string' && cartItemId.startsWith('local-'))) {
      let localCart = JSON.parse(localStorage.getItem("cart")) || [];
      let updated = localCart.filter(i => `local-${i.product.id}` !== cartItemId && i.id !== cartItemId);
      localStorage.setItem("cart", JSON.stringify(updated));
      window.dispatchEvent(new Event("cartUpdated"));
      fetchCart();
      return;
    }

    try {
      await axios.delete("http://127.0.0.1:8000/api/cart/", {
        headers: { Authorization: `Bearer ${token}` },
        data: { cart_item_id: cartItemId }
      });
      fetchCart();
    } catch (err) {
      console.log("API Error removing item:", err);
    }
  };

  // TOTAL CALCULATION
  const total = cart.reduce((acc, item) => {
    const price = typeof item.product.price === 'string' 
      ? parseFloat(item.product.price.replace(/[₹,]/g, ""))
      : parseFloat(item.product.price);
    return acc + price * item.quantity;
  }, 0);

  const delivery = cart.length > 0 ? 50 : 0;

  // PLACE ORDER - navigate to checkout page
  const placeOrder = () => {
    navigate("/checkout");
  };

  return (
    <div className="cart-container">
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
        <div className="cart-items">
          <h2>🛒 Cart Items</h2>
          {cart.length === 0 ? (
            <p>No items added</p>
          ) : (
            cart.map((item, i) => (
              <div className="cart-item" key={i}>
                <img src={item.product.images?.[0]?.image_url || item.product.img} alt={item.product.name} />
                <div>
                  <h4>{item.product.name}</h4>
                  <p>₹{item.product.price}</p>
                  <div className="qty">
                    <button onClick={() => updateQuantity(item, "dec")}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item, "inc")}>+</button>
                  </div>
                  <button className="delete-btn" onClick={() => removeItem(item.id)}>Remove ❌</button>
                </div>
              </div>
            ))
          )}
        </div>

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

      {popup && (
        <div className="popup">
          <div className="popup-box">
            <h2>✅ Order Placed Successfully!</h2>
            <p>Your invoice is being generated...</p>
            <button onClick={() => setPopup(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductCart;