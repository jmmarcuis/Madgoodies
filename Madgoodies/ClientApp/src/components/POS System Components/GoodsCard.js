import React, { useState } from "react";
import "../Component Styles/GoodsCard.css";

const GoodsCard = ({ id, productName, price, stock, imageUrl, onAddToCart, isDisabled }) => {
  const handleClick = () => {
    if (!isDisabled) {
      onAddToCart();
    }
  };

  return (
    <div className={`goods-card ${isDisabled ? 'disabled' : ''}`} onClick={handleClick}>
      <div className="card-image">
        <img src={imageUrl} alt={productName} />
      </div>
      <div className="card-details">
        <h3>{productName}</h3>
        <p><strong>Price:</strong> PHP {price.toFixed(2)}</p>
        <p><strong>Stock:</strong> {stock}</p>
      </div>
    </div>
  );
};

export default GoodsCard;
