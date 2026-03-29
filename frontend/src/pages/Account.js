import React, { useState, useEffect } from "react";
import "./Account.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

function Account() {
  const [activeTab, setActiveTab] = useState("profile");
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    role: "customer"
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const fetchData = async () => {
      try {
        const [profileRes, ordersRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/profile/", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get("http://127.0.0.1:8000/api/my-orders/", {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        setUserData(profileRes.data);
        setOrders(ordersRes.data);
      } catch (err) {
        console.error("Error fetching account data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.patch("http://127.0.0.1:8000/api/update-profile/", userData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage("Profile updated successfully! ✅");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Failed to update profile. ❌");
    }
  };

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="loading">Loading Account...</div>;

  return (
    <div className="account-page-wrapper">
      <Navbar />
      
      <div className="account-hero"></div>

      <div className="account-main-content">
        <aside className="account-sidebar">
          <div className="account-profile-summary">
            <div className="account-avatar-large">
              {(userData.username || "G").charAt(0).toUpperCase()}
            </div>
            <h3 className="account-name-label">{userData.username}</h3>
            <span className="account-role-tag">{userData.role}</span>
          </div>

          <ul className="account-nav-list">
            <li 
              className={`account-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab("profile")}
            >
              👤 Profile Overview
            </li>
            <li 
              className={`account-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab("orders")}
            >
              📦 My Orders
            </li>
            <li className="account-nav-item">💳 Payments</li>
            <li className="account-nav-item">🔒 Security</li>
            <li className="account-nav-item" onClick={() => { window.location.href = "/logout"; }}>🚪 Logout</li>
          </ul>
        </aside>

        <section className="account-details-panels">
          {message && <div className="product-message" style={{ margin: "0 0 20px 0" }}>{message}</div>}

          {activeTab === "profile" && (
            <div className="account-panel">
              <h2>Personal Information</h2>
              <form onSubmit={handleUpdateProfile}>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">First Name</span>
                    <input 
                      className="info-value" 
                      name="first_name"
                      value={userData.first_name || ""} 
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="info-item">
                    <span className="info-label">Last Name</span>
                    <input 
                      className="info-value" 
                      name="last_name"
                      value={userData.last_name || ""} 
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="info-item">
                    <span className="info-label">Email Address</span>
                    <input 
                      className="info-value" 
                      name="email"
                      value={userData.email || ""} 
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="info-item">
                    <span className="info-label">User Role</span>
                    <span className="info-value" style={{ background: '#eee', cursor: 'not-allowed' }}>{userData.role}</span>
                  </div>
                </div>
                
                <div className="account-actions">
                  <button type="submit" className="edit-btn">Save Changes</button>
                  <button type="button" className="logout-secondary-btn" onClick={() => { window.location.href = "/logout"; }}>Logout</button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="account-panel">
              <h2>Order History</h2>
              {orders.length === 0 ? (
                <p>You haven't placed any orders yet.</p>
              ) : (
                <div className="order-list">
                  {orders.map(order => (
                    <div key={order.id} className="info-value" style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Order #{order.id} - {new Date(order.created_at).toLocaleDateString()}</span>
                      <span style={{ fontWeight: 'bold' }}>₹{order.total_amount} ({order.status})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="account-panel">
            <h2>Account Security</h2>
            <p style={{ color: '#666', fontSize: '14px' }}>Keep your account secure by updating your password and enabling two-factor authentication.</p>
            <div className="account-actions">
              <button className="edit-btn" style={{ background: '#333' }}>Change Password</button>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}

export default Account;