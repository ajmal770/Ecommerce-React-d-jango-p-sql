import React, { useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import './Checkout.css';

const Checkout = () => {
    const { token, user } = useContext(AuthContext);
    const { cart, fetchCart } = useContext(CartContext);
    const navigate = useNavigate();

    useEffect(() => {
        // dynamically load Razorpay script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        }
    }, []);

    const cartItems = cart?.items || [];
    const totalAmount = cartItems.reduce((acc, item) => acc + (item.product_details.price * item.quantity), 0);

    const handleCheckout = async () => {
        try {
            // 1. Create order on backend
            const { data } = await axios.post('http://localhost:8000/api/orders/checkout/', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // 2. Open Razorpay Interface
            const options = {
                key: 'test_key', // This is a dummy key, ideally from env vars
                amount: data.amount * 100,
                currency: data.currency,
                name: 'ProHardware Outlet',
                description: 'Purchase Tools & Spares',
                order_id: data.razorpay_order_id,
                handler: async function (response) {
                    try {
                        await axios.post('http://localhost:8000/api/orders/verify-payment/', {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature
                        }, { headers: { Authorization: `Bearer ${token}` } });
                        
                        alert('Payment Successful! An invoice has been generated.');
                        fetchCart(); // Clear local cart
                        navigate('/'); 
                    } catch (error) {
                        alert('Payment Verification Failed');
                    }
                },
                prefill: {
                    name: user?.username || 'Customer',
                    email: user?.email || '',
                    contact: user?.phone_number || ''
                },
                theme: {
                    color: '#3b82f6'
                }
            };
            
            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response){
                alert(response.error.description);
            });
            rzp1.open();
            
        } catch (err) {
            console.error('Checkout error:', err);
            alert(err.response?.data?.error || 'Failed to initiate checkout.');
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="checkout-container card text-center">
                <h2>No items to checkout</h2>
                <button className="btn btn-outline" onClick={() => navigate('/')}>Return to Shop</button>
            </div>
        );
    }

    return (
        <div className="checkout-container">
            <div className="checkout-card card">
                <h1>Checkout Summary</h1>
                <div className="checkout-items">
                    {cartItems.map(item => (
                        <div key={item.id} className="checkout-row">
                            <span className="checkout-item-name">{item.product_details.name} (x{item.quantity})</span>
                            <span className="checkout-item-price">₹{item.product_details.price * item.quantity}</span>
                        </div>
                    ))}
                </div>
                <hr className="checkout-divider" />
                <div className="checkout-total">
                    <span>Total Amount Payable:</span>
                    <span className="total-amount">₹{totalAmount}</span>
                </div>
                
                <div className="payment-action">
                    <p className="secure-badge">🔒 Secure checkout via Razorpay</p>
                    <button className="btn btn-primary btn-block pay-btn" onClick={handleCheckout}>
                        Pay ₹{totalAmount} Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
