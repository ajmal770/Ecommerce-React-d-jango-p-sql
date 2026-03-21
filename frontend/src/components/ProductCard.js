import React from "react";
import "./ProductCard.css";

function ProductCard({ product }) {
  // ✅ Prevent crash
  if (!product) return null;

  return (
    <div className="pc-card">

      {/* SAVE TAG */}
      {product.save && <div className="pc-save">{product.save}</div>}

      {/* IMAGE */}
      <div className="pc-img-box">
        <img src={product.img} alt={product.name} />
      </div>

      {/* TITLE */}
      <h3 className="pc-title">{product.name}</h3>

      {/* PRICE */}
      <div className="pc-price">
        {product.tag && <span className="pc-from">{product.tag}</span>}
        <span className="pc-new">{product.price}</span>
        {product.oldPrice && (
          <span className="pc-old">{product.oldPrice}</span>
        )}
      </div>

      {/* REVIEW */}
      <div className="pc-review">
        ★★★★★ <span>No reviews</span>
      </div>

      {/* BUTTON */}
      <button className="pc-btn">Add To Cart</button>
    </div>
  );
}

export default ProductCard;