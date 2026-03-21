import React from "react";
import "./Account.css";

function Account() {
  return (
    <div className="account-container">
      <h1 className="account-title">Account Details</h1>

      <div className="account-card">
        <p><strong>Name:</strong> User</p>
        <p><strong>Email:</strong> user@email.com</p>
        <p><strong>Phone:</strong> 1234567890</p>
      </div>
    </div>
  );
}

export default Account;