import React, { useState } from 'react';
import axios from 'axios';
import "../Eshop Component Styles/OrderFormPage.css";

const OrderForm: React.FC = () => {
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderID, setOrderID] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://localhost:7162/api/order', {
        address,
        paymentMethod,
        items: JSON.parse(localStorage.getItem('cart') || '[]')
      });
      setOrderID(response.data.orderID);
      setOrderPlaced(true);
      localStorage.removeItem('cart'); // Clear cart after placing order
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  return (
    <div className="order-form-container">
      {orderPlaced ? (
        <div>
          <h2>Order Placed Successfully!</h2>
          <p>Your order ID: {orderID}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h2>Shipping Information</h2>
          <label>
            Address:
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </label>
          <h2>Payment Method</h2>
          <label>
            <input
              type="radio"
              value="cash"
              checked={paymentMethod === 'cash'}
              onChange={() => setPaymentMethod('cash')}
            />
            Cash
          </label>
          <label>
            <input
              type="radio"
              value="gcash"
              checked={paymentMethod === 'gcash'}
              onChange={() => setPaymentMethod('gcash')}
            />
            GCash
          </label>
          <button type="submit">Place Order</button>
        </form>
      )}
    </div>
  );
};

export default OrderForm;
