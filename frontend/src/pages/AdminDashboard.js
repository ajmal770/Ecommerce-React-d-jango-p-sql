import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { user, token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && !user.is_admin) {
            navigate('/');
        }
    }, [user, navigate]);

    useEffect(() => {
        const fetchData = async () => {
            if (!token) return;
            try {
                const resProducts = await axios.get('http://localhost:8000/api/store/products/');
                setProducts(resProducts.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching admin data:', err);
                setLoading(false);
            }
        };
        fetchData();
    }, [token]);

    if (!user || !user.is_admin) return null;

    if (loading) return <div className="loader">Loading admin dashboard...</div>;

    return (
        <div className="admin-container">
            <h1 className="admin-title">Admin Dashboard</h1>
            
            <div className="admin-section card">
                <div className="section-header">
                    <h2>Product Management</h2>
                    <button className="btn btn-primary">Add New Product</button>
                </div>
                
                <div className="table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id}>
                                    <td>#{product.id}</td>
                                    <td>{product.name}</td>
                                    <td>₹{product.price}</td>
                                    <td>
                                        <span className={`stock-badge ${product.stock > 0 ? 'good' : 'bad'}`}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn btn-outline btn-sm" style={{marginRight: '0.5rem'}}>Edit</button>
                                        <button className="btn btn-outline btn-sm" style={{color: 'red', borderColor: 'red'}}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="admin-section card" style={{marginTop: '2rem'}}>
                <h2>Recent Orders</h2>
                <p className="placeholder-text">Order management functionality will be implemented here.</p>
            </div>
        </div>
    );
};

export default AdminDashboard;
