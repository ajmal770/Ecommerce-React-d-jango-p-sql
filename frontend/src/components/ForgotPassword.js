import React, { useState } from "react";
import axios from "axios";
import "./ForgotPassword.css";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1); // step 1 = enter email, step 2 = reset password
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Step 1: Send email → backend resets password directly (ForgotPasswordView)
  // The backend /api/forgot-password/ accepts { email, password } and resets directly
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/forgot-password/", {
        email: email,
        password: newPassword,
      });
      setSuccessMsg(res.data.msg || "Password reset successful!");
      setTimeout(() => navigate("/login"), 2500);
    } catch (error) {
      const errMsg = error.response?.data?.error || "Error resetting password. Check your email.";
      alert(errMsg);
    }
    setLoading(false);
  };

  return (
    <div className="forgot-container">
      <div className="forgot-box">
        <h2>Reset Password</h2>

        {successMsg ? (
          <div className="forgot-success">
            <div className="forgot-success-icon">✔</div>
            <p>{successMsg}</p>
            <p className="forgot-redirect">Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Enter your registered email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              name="password"
              placeholder="New Password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>

            <p className="forgot-back">
              Remember your password?{" "}
              <span onClick={() => navigate("/login")}>Login</span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;