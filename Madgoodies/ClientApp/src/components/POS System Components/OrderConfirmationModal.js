import React from "react";
import Modal from "react-modal";
import axios from "axios";
import { toast } from "react-toastify";
import "../Component Styles/OrderConfirmationModal.css"

Modal.setAppElement("#root"); // Set the root element for accessibility

const OrderConfirmationModal = ({ isOpen, onRequestClose, cartItems, onConfirmOrder }) => {
  const confirmOrder = async () => {
    try {
      const response = await axios.post("https://localhost:7162/api/orders/confirm", {
        totalAmount: cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
        isFulfilled: false,
        orderDetails: cartItems.map(item => ({
          productId: item.productID,
          quantity: item.quantity,
          price: item.price
        }))
      });
      toast.success(response.data);
      onConfirmOrder(); // Callback to handle post-confirmation actions (e.g., clear cart)
      onRequestClose(); // Close the modal
    } catch (error) {
      toast.error(`Failed to confirm order: ${error.message}`);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Confirm Order Modal"
      className="modal-content"
    >
      <h2>Confirm Order</h2>
      <div>
        <h3>Order Summary:</h3>
        <ul>
          {cartItems.map(item => (
            <li key={item.productID}>
              {item.productName} - Quantity: {item.quantity}
            </li>
          ))}
        </ul>
        <p>Total: ₱{cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</p>
      </div>
      <div>
        <button onClick={confirmOrder}>Confirm Order</button>
        <button onClick={onRequestClose}>Cancel</button>
      </div>
    </Modal>
  );
};

export default OrderConfirmationModal;
