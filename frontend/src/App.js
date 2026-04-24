import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RegisterAdmin from "./pages/RegisterAdmin";
import AdminLogin from "./pages/AdminLogin";
import Logout from "./pages/Logout";
import ProductCard from "./components/ProductCard";
import ForgotPassword from "./components/ForgotPassword";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register-admin" element={<RegisterAdmin />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* ✅ FIXED CART ROUTE */}
      <Route path="/cart" element={<ProductCard />} />
    </Routes>
  );
}

export default App;