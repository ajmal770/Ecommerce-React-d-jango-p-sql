import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import './Cart.css';

const Cart = () => {
    const { cart, fetchCart } = useContext(CartContext);
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    const updateQuantity = async (productId, quantityDiff) => {
        try {
            await axios.post('http://localhost:8000/api/orders/cart/', 
                { product_id: productId, quantity: quantityDiff },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchCart();
        } catch (err) {
            console.error('Error updating cart:', err);
        }
    };

    const cartItems = cart?.items || [];
    const totalAmount = cartItems.reduce((acc, item) => acc + (item.product_details.price * item.quantity), 0);

    if (cartItems.length === 0) {
        return (
            <div className="empty-cart-container">
                <h2>Your Cart is Empty</h2>
                <p>Looks like you haven't added any products yet.</p>
                <Link to="/" className="btn btn-primary" style={{marginTop: '1rem'}}>Browse Products</Link>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <h1 className="cart-title">Shopping Cart</h1>
            <div className="cart-content">
                <div className="cart-items">
                    {cartItems.map(item => (
                        <div key={item.id} className="cart-item card">
                            <div className="item-image-container">
                                {item.product_details.images?.length > 0 ? (
                                    <img src={`http://localhost:8000${item.product_details.images[0].image}`} alt={item.product_details.name} />
                                ) : (
                                    <div className="placeholder-image">No Image</div>
                                )}
                            </div>
                            <div className="item-details">
                                <h3><Link to={`/product/${item.product_details.id}`}>{item.product_details.name}</Link></h3>
                                <p className="item-price">₹{item.product_details.price}</p>
                            </div>
                            <div className="item-quantity">
                                <button className="qty-btn" onClick={() => updateQuantity(item.product_details.id, -1)}>-</button>
                                <span>{item.quantity}</span>
                                <button className="qty-btn" onClick={() => updateQuantity(item.product_details.id, 1)}>+</button>
                            </div>
                            <div className="item-total">
                                ₹{item.product_details.price * item.quantity}
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="cart-summary card">
                    <h3>Order Summary</h3>
                    <div className="summary-row">
                        <span>Items ({cartItems.reduce((acc, item) => acc + item.quantity, 0)}):</span>
                        <span>₹{totalAmount}</span>
                    </div>
                    <div className="summary-row">
                        <span>Shipping:</span>
                        <span>Free</span>
                    </div>
                    <hr className="summary-divider"/>
                    <div className="summary-row total">
                        <span>Total:</span>
                        <span>₹{totalAmount}</span>
                    </div>
                    <button className="btn btn-primary btn-block checkout-btn" onClick={() => navigate('/checkout')}>
                        Proceed to Checkout
                    </button>
                    <Link to="/" className="continue-shopping">Continue Shopping</Link>
                </div>
            </div>
        </div>
    );
};

export default Cart;
