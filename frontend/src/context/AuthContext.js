import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            axios.get('http://localhost:8000/api/users/profile/', {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => {
                setUser(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                logout();
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = async (email, password) => {
        const res = await axios.post('http://localhost:8000/api/users/login/', { email, password });
        localStorage.setItem('token', res.data.access);
        setToken(res.data.access);
    };

    const register = async (userData) => {
        await axios.post('http://localhost:8000/api/users/register/', userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
