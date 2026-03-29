import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Checkout.css";
import Navbar from "../components/Navbar";

const STEPS = ["Address", "Order Summary", "Payment"];

function Checkout() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [step, setStep] = useState(0);
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState(localStorage.getItem("address") || "");
  const [location, setLocation] = useState(localStorage.getItem("location") || "");
  const [phone, setPhone] = useState(localStorage.getItem("phone") || "");
  const [loading, setLoading] = useState(false);

  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");

  useEffect(() => {
    const fetchCart = async () => {
      const localCart = JSON.parse(localStorage.getItem("cart")) || [];
      if (!token) { setCart(localCart); return; }
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/cart/", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const apiCart = res.data;
        const merged = [...apiCart];
        localCart.forEach(localItem => {
          const inApi = apiCart.some(a => a.product.id === localItem.product.id);
          if (!inApi) merged.push(localItem);
        });
        setCart(merged);
      } catch {
        setCart(localCart);
      }
    };
    fetchCart();
  }, [token]);

  const getPrice = (item) => {
    const p = item.product?.price;
    return typeof p === "string" ? parseFloat(p.replace(/[₹,]/g, "")) : parseFloat(p || 0);
  };

  const total = cart.reduce((acc, item) => acc + getPrice(item) * item.quantity, 0);
  const delivery = cart.length > 0 ? 50 : 0;
  const discount = total > 0 ? Math.floor(total * 0.1) : 0;
  const grandTotal = total + delivery - discount;

  // When Continue is clicked on Address step → open payment modal
  const handleContinue = () => {
    if (step === 0) {
      if (!address || !location) {
        alert("Please fill delivery address and location");
        return;
      }
      localStorage.setItem("address", address);
      localStorage.setItem("location", location);
      if (phone) localStorage.setItem("phone", phone);
      // Open payment modal instead of going to next step
      setShowPaymentModal(true);
      return;
    }
    if (step < STEPS.length - 1) setStep(step + 1);
  };

  const [isSuccess, setIsSuccess] = useState(false);

  const handlePlaceOrder = async () => {
    if (!token) { alert("Please login to place an order"); navigate("/login"); return; }
    setLoading(true);

    const RAZORPAY_CONFIGURED = false;

    if (!RAZORPAY_CONFIGURED) {
      await new Promise(res => setTimeout(res, 1000));
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated"));
      setShowPaymentModal(false);
      setLoading(false);
      setIsSuccess(true);
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/checkout/",
        { address, location },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { razorpay_order_id, amount, order_id } = response.data;

      const options = {
        key: "your_razorpay_key",
        amount: amount * 100,
        currency: "INR",
        name: "Bat Store",
        description: "Order Payment",
        order_id: razorpay_order_id,
        handler: async function (rzpResponse) {
          try {
            await axios.post("http://127.0.0.1:8000/api/payment-success/", {
              order_id: order_id,
              razorpay_payment_id: rzpResponse.razorpay_payment_id,
              razorpay_order_id: rzpResponse.razorpay_order_id,
              razorpay_signature: rzpResponse.razorpay_signature
            }, { headers: { Authorization: `Bearer ${token}` } });
            localStorage.removeItem("cart");
            window.dispatchEvent(new Event("cartUpdated"));
            setShowPaymentModal(false);
            setIsSuccess(true);
          } catch {
            alert("Payment verification failed. Contact support.");
          }
        },
        prefill: { name: localStorage.getItem("username") || "", contact: phone },
        theme: { color: "#2874f0" }
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      alert("Checkout failed: " + (err.response?.data?.error || "Unknown error"));
    }
    setLoading(false);
  };



  return (
    <>
      <Navbar />
      <div className="checkout-page">
        {/* Stepper */}
        <div className="checkout-stepper">
          {STEPS.map((s, i) => (
            <React.Fragment key={i}>
              <div className={`step-item ${i < step ? "done" : i === step ? "active" : ""}`}>
                <div className="step-circle">{i < step ? "✔" : i + 1}</div>
                <span>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`step-line ${i < step ? "done" : ""}`} />}
            </React.Fragment>
          ))}
        </div>

        {isSuccess ? (
          <div className="order-success-screen">
            <div className="success-icon">✅</div>
            <h1>Order Placed Successfully!</h1>
            <p>Thank you for your purchase. A confirmation message has been sent to:</p>
            <div className="success-email">{localStorage.getItem("email") || "your registered email"}</div>
            <button className="btn-continue" onClick={() => navigate("/")} style={{ marginTop: '20px' }}>
              Back to Home
            </button>
          </div>
        ) : (
          <div className="checkout-body">
            {/* LEFT PANEL */}
            <div className="checkout-left">

              {/* STEP 1: ADDRESS */}
              {step === 0 && (
                <div className="checkout-card">
                  <h3>📦 Delivery Address</h3>
                  <div className="field-group">
                    <label>Full Address</label>
                    <input
                      type="text"
                      placeholder="House No, Street, Area"
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                    />
                  </div>
                  <div className="field-group">
                    <label>City / Location</label>
                    <input
                      type="text"
                      placeholder="City, State, PIN"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                    />
                  </div>
                  <div className="field-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                    />
                  </div>
                  <button className="btn-continue" onClick={handleContinue}>Continue</button>
                </div>
              )}

              {/* STEP 2: ORDER SUMMARY */}
              {step === 1 && (
                <div className="checkout-card">
                  <h3>🛒 Order Summary</h3>
                  <div className="deliver-to">
                    <span>Deliver to: <strong>{localStorage.getItem("username") || "You"}</strong></span>
                    <span className="address-tag">HOME</span>
                    <p className="address-text">{address}, {location}</p>
                    {phone && <p className="phone-text">📞 {phone}</p>}
                  </div>
                  <div className="order-items">
                    {cart.map((item, i) => (
                      <div key={i} className="order-item-row">
                        <img
                          src={item.product?.images?.[0]?.image_url || item.product?.img || "https://via.placeholder.com/80"}
                          alt={item.product?.name}
                        />
                        <div className="order-item-info">
                          <p className="item-name">{item.product?.name}</p>
                          <p className="item-qty">Qty: {item.quantity}</p>
                          <p className="item-price">₹{(getPrice(item) * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="btn-continue" onClick={handleContinue}>Continue</button>
                </div>
              )}

              {/* STEP 3: PAYMENT (inline fallback) */}
              {step === 2 && (
                <div className="checkout-card payment-card">
                  <h3>💳 Complete Payment</h3>
                  <button className="btn-pay" onClick={handlePlaceOrder} disabled={loading}>
                    {loading ? "Processing..." : `Pay ₹${grandTotal}`}
                  </button>
                </div>
              )}
            </div>

            {/* RIGHT PANEL - Price Summary */}
            <div className="checkout-right">
              <div className="price-summary">
                <h4>PRICE DETAILS</h4>
                <div className="price-row"><span>Price ({cart.length} items)</span><span>₹{total.toFixed(2)}</span></div>
                <div className="price-row"><span>Discount (10%)</span><span className="free">-₹{discount}</span></div>
                <div className="price-row"><span>Delivery Charges</span><span className={delivery === 0 ? "free" : ""}>{delivery === 0 ? "FREE" : `₹${delivery}`}</span></div>
                <hr />
                <div className="price-row total-row"><span>Total Amount</span><span>₹{grandTotal.toFixed(2)}</span></div>
                {total > 500 && <p className="savings-text">🎉 You save ₹{discount} on this order!</p>}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ============ PAYMENT MODAL ============ */}
      {showPaymentModal && (
        <div className="pm-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="pm-modal" onClick={e => e.stopPropagation()}>

            {/* Modal Header */}
            <div className="pm-header">
              <button className="pm-back" onClick={() => setShowPaymentModal(false)}>← Back</button>
              <h2>Complete Payment</h2>
              <span className="pm-secure">🔒 100% Secure</span>
            </div>

            <div className="pm-body">
              {/* LEFT: Payment options */}
              <div className="pm-left">

                {/* Saved options label */}
                <div className="pm-section-label">
                  <span className="pm-label-icon">🕐</span> Saved Payment Options
                </div>

                {/* Card Option */}
                <div
                  className={`pm-option ${paymentMethod === "card" ? "pm-selected" : ""}`}
                  onClick={() => setPaymentMethod("card")}
                >
                  <span className="pm-radio">{paymentMethod === "card" && <span className="pm-radio-dot" />}</span>
                  <span className="pm-opt-icon">💳</span>
                  <div className="pm-opt-text">
                    <strong>Credit / Debit / ATM Card</strong>
                    <p>Add and pay securely</p>
                    <p className="pm-offer">Get up to 5% cashback • 2 offers available</p>
                  </div>
                </div>

                {/* If card selected, show card fields */}
                {paymentMethod === "card" && (
                  <div className="pm-card-fields">
                    <div className="pm-card-preview">
                      <div className="pm-card-display">
                        <div className="pm-card-chip">💳</div>
                        <div className="pm-card-num">{cardNumber || "•••• •••• •••• ••••"}</div>
                        <div className="pm-card-meta">
                          <span>{localStorage.getItem("username") || "Card Holder"}</span>
                          <span>MM/YY</span>
                        </div>
                      </div>
                    </div>
                    <input
                      className="pm-input"
                      placeholder="Card Number (16 digits)"
                      maxLength={19}
                      value={cardNumber}
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 16);
                        setCardNumber(val.replace(/(.{4})/g, "$1 ").trim());
                      }}
                    />
                    <div className="pm-row">
                      <input className="pm-input" placeholder="MM / YY" maxLength={5} />
                      <input
                        className="pm-input"
                        placeholder="CVV"
                        maxLength={3}
                        type="password"
                        value={cvv}
                        onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                      />
                    </div>
                  </div>
                )}

                {/* Gift Card */}
                <div className="pm-section-label" style={{ marginTop: 16 }}>
                  <span className="pm-label-icon">🎁</span> Have a Flipkart Gift Card?
                </div>

                {/* UPI */}
                <div
                  className={`pm-option ${paymentMethod === "upi" ? "pm-selected" : ""}`}
                  onClick={() => setPaymentMethod("upi")}
                >
                  <span className="pm-radio">{paymentMethod === "upi" && <span className="pm-radio-dot" />}</span>
                  <span className="pm-opt-icon">📱</span>
                  <div className="pm-opt-text">
                    <strong>UPI</strong>
                    <p>Google Pay, PhonePe, Paytm</p>
                  </div>
                  <span className="pm-unavail-tag">Available</span>
                </div>

                {/* EMI */}
                <div
                  className={`pm-option ${paymentMethod === "emi" ? "pm-selected" : ""}`}
                  onClick={() => setPaymentMethod("emi")}
                >
                  <span className="pm-radio">{paymentMethod === "emi" && <span className="pm-radio-dot" />}</span>
                  <span className="pm-opt-icon">📋</span>
                  <div className="pm-opt-text">
                    <strong> EMI</strong>
                    <p>Easy monthly installments</p>
                  </div>
                  <span className="pm-unavail-tag pm-unavail">Unavailable</span>
                </div>

                {/* COD */}
                <div
                  className={`pm-option ${paymentMethod === "cod" ? "pm-selected" : ""}`}
                  onClick={() => setPaymentMethod("cod")}
                >
                  <span className="pm-radio">{paymentMethod === "cod" && <span className="pm-radio-dot" />}</span>
                  <span className="pm-opt-icon">💵</span>
                  <div className="pm-opt-text">
                    <strong>Cash on Delivery</strong>
                    <p>Pay when delivered</p>
                  </div>
                  <span className="pm-unavail-tag">Available</span>
                </div>

                {/* Net Banking */}
                <div
                  className={`pm-option ${paymentMethod === "netbanking" ? "pm-selected" : ""}`}
                  onClick={() => setPaymentMethod("netbanking")}
                >
                  <span className="pm-radio">{paymentMethod === "netbanking" && <span className="pm-radio-dot" />}</span>
                  <span className="pm-opt-icon">🏦</span>
                  <div className="pm-opt-text">
                    <strong>Net Banking</strong>
                    <p>All major banks supported</p>
                  </div>
                  <span className="pm-unavail-tag">Available</span>
                </div>

              </div>

              {/* RIGHT: Price summary + Pay button */}
              <div className="pm-right">
                <div className="pm-summary-box">
                  <div className="pm-summary-row">
                    <span>MRP (incl. of all taxes)</span>
                    <span>₹{total.toFixed(0)}</span>
                  </div>
                  <div className="pm-summary-row pm-fees-row">
                    <span>Fees <span className="pm-fees-icon">▲</span></span>
                  </div>
                  <div className="pm-summary-row pm-sub-row">
                    <span>Platform Fee</span>
                    <span>₹7</span>
                  </div>
                  <div className="pm-summary-row pm-discount-header">
                    <span>Discounts <span className="pm-fees-icon">▲</span></span>
                  </div>
                  <div className="pm-summary-row pm-sub-row pm-green">
                    <span>MRP Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                  <div className="pm-summary-row pm-sub-row pm-green">
                    <span>Coupons for you</span>
                    <span>-₹{Math.floor(grandTotal * 0.05)}</span>
                  </div>
                  <div className="pm-summary-divider" />
                  <div className="pm-summary-row pm-total-row">
                    <span>Total Amount</span>
                    <span className="pm-total-amt">₹{(grandTotal - Math.floor(grandTotal * 0.05) + 7).toFixed(0)}</span>
                  </div>
                  <div className="pm-summary-row pm-cashback-row">
                    <span>Cashback</span>
                    <span className="pm-cashback-amt">₹7</span>
                  </div>
                </div>

                {/* Cashback banner */}
                <div className="pm-cashback-banner">
                  <span className="pm-axis-logo">A</span>
                  <div>
                    <strong>5% Cashback</strong>
                    <p>Claim now with payment offers</p>
                  </div>
                  <span className="pm-info-icon">ℹ</span>
                </div>

                <button
                  className="pm-pay-btn"
                  onClick={handlePlaceOrder}
                  disabled={loading}
                >
                  {loading ? "Processing..." : `Pay ₹${(grandTotal - Math.floor(grandTotal * 0.05) + 7).toFixed(0)}`}
                </button>

                <p className="pm-terms">
                  By proceeding, you agree to our <span>Terms & Conditions</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Checkout;
