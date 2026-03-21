import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { token } = useContext(AuthContext);
    const [cart, setCart] = useState({ items: [] });

    const fetchCart = async () => {
        if (!token) return;
        try {
            const res = await axios.get('http://localhost:8000/api/orders/cart/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCart(res.data);
        } catch (err) {
            console.error('Error fetching cart:', err);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [token]);

    const addToCart = async (productId, quantity = 1) => {
        if (!token) return alert('Please login to add items to cart.');
        try {
            await axios.post('http://localhost:8000/api/orders/cart/', 
                { product_id: productId, quantity },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchCart();
            alert('Item added to cart!');
        } catch (err) {
            console.error('Error adding to cart:', err);
        }
    };

    return (
        <CartContext.Provider value={{ cart, fetchCart, addToCart }}>
            {children}
        </CartContext.Provider>
    );
};
