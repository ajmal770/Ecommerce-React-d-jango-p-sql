import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const imageUrl = product.images?.length > 0 
    ? `http://localhost:8000${product.images[0].image}` 
    : 'https://placehold.co/400x300/e2e8f0/475569?text=No+Image';

  return (
    <div className="card product-card">
      <div className="product-image-container">
        <img src={imageUrl} alt={product.name} className="product-image" />
      </div>
      <div className="product-details">
        <h3 className="product-name" title={product.name}>{product.name}</h3>
        <p className="product-price">₹{product.price}</p>
        <div className="product-actions">
          <Link to={`/product/${product.id}`} className="btn btn-outline detail-btn">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;