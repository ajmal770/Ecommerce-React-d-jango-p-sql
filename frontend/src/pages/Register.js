import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', phone_number: '' });
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = e => setFormData({...formData, [e.target.name]: e.target.value});

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/login');
            alert('Registration successful! Please login.');
        } catch (err) {
            setError('Registration failed. Please check inputs.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Create Account</h2>
                {error && <p className="error-msg">{error}</p>}
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Username</label>
                        <input type="text" name="username" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Phone Number</label>
                        <input type="text" name="phone_number" onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block">Register</button>
                </form>
                <p className="auth-footer">Already have an account? <Link to="/login">Login</Link></p>
            </div>
        </div>
    );
};
export default Register;