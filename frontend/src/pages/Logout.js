import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Logout.css";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear user session or token
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }, []);

  return (
    <div className="logout-container">
      <h2>✓ You have been logged out</h2>
      <p>Your session has been ended successfully. You have been signed out of your account.</p>
      <div className="logout-buttons">
        <button 
          className="login-again"
          onClick={() => navigate("/login")}
        >
          Login Again
        </button>
        
      </div>
    </div>
  );
}

export default Logout;