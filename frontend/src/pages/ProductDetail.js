import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/store/products/${id}/`);
        setProduct(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="loader">Loading details...</div>;
  if (!product) return <div className="loader">Product not found</div>;

  const imageUrl = product.images?.length > 0 
    ? `http://localhost:8000${product.images[0].image}` 
    : 'https://placehold.co/600x400/e2e8f0/475569?text=No+Image';

  return (
    <div className="product-detail-container">
      <div className="product-main card">
        <div className="product-gallery">
          <img src={imageUrl} alt={product.name} className="main-image" />
        </div>
        <div className="product-info-panel">
          <h1>{product.name}</h1>
          <p className="price">₹{product.price}</p>
          <div className="stock-info">
            {product.stock > 0 ? (
              <span className="in-stock">✓ In Stock ({product.stock} available)</span>
            ) : (
              <span className="out-of-stock">✗ Out of Stock</span>
            )}
          </div>
          <div className="description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>
          
          <button 
            className="btn btn-primary add-to-cart-btn" 
            onClick={() => addToCart(product.id)}
            disabled={product.stock <= 0}
          >
            Add to Cart
          </button>
        </div>
      </div>

      <div className="spare-parts-section">
        <h2>Genuine Spare Parts</h2>
        <p className="spares-subtitle">Compatible spare parts for {product.name}</p>
        
        {product.spare_parts && product.spare_parts.length > 0 ? (
          <div className="spare-parts-list">
            {product.spare_parts.map(part => (
              <div key={part.id} className="spare-part-card card">
                <div className="part-info">
                  <h4>{part.name}</h4>
                  <p>{part.description || 'Genuine replacement part'}</p>
                </div>
                <div className="part-action">
                  <span className="part-price">₹{part.price}</span>
                  <button className="btn btn-outline btn-sm">Contact to Order</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-spares card">
            <p>No spare parts listed for this product currently.</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default ProductDetail;
