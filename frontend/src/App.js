import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./pages/Logout";
import Account from "./pages/Account";
import ProductCard from "./components/ProductCard";
import ForgotPassword from "./components/ForgotPassword";
import Checkout from "./pages/Checkout";
import AddProduct from "./pages/AddProduct";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/account" element={<Account />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/add-product" element={<AddProduct />} />

      {/* ✅ FIXED CART ROUTE */}
      <Route path="/cart" element={<ProductCard />} />
      <Route path="/checkout" element={<Checkout />} />
    </Routes>
  );
}

export default App;