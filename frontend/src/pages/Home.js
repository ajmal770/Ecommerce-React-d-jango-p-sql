import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/store/products/');
        setProducts(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Professional Grade Hardware</h1>
        <p>Premium tools and authentic spare parts for all your projects.</p>
      </div>

      <div className="products-section">
        <h2 className="section-title">Latest Products</h2>
        {loading ? (
          <div className="loader">Loading products...</div>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
