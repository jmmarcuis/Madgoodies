import React, { useState } from "react";
import "../Component Styles/CartItem.css"; // We'll define styles in this file
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const CartItem = ({
  name,
  price,
  imageUrl,
  initialQuantity = 1,
  onQuantityChange,
  onRemove,  stock 
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleIncrease = () => {
    if (quantity + 1 > stock) {
      // Warn user and set quantity to max stock
      toast.warn(`Quantity exceeds available stock (${stock}) for ${name}`);
      setQuantity(stock);
    } else {
      setQuantity((prevQuantity) => {
        const newQuantity = prevQuantity + 1;
        onQuantityChange(newQuantity);
        return newQuantity;
      });
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => {
        const newQuantity = prevQuantity - 1;
        onQuantityChange(newQuantity);
        return newQuantity;
      });
    }
  };

  return (
    <div className="cart-item">
      <img src={imageUrl} alt={name} className="cart-item-image" />
      <div className="item-details">
        <h3>{name}</h3>
        <p className="price">PHP {price.toFixed(2)}</p>
        <div className="quantity-control">
          <button onClick={handleDecrease} className="quantity-btn">
            −
          </button>
          <span className="quantity">{quantity}</span>
          <button onClick={handleIncrease} className="quantity-btn">
            +
          </button>
        </div>
      </div>
      <button onClick={onRemove} className="remove-btn">
        ×
      </button>
    </div>
  );
};

export default CartItem;
