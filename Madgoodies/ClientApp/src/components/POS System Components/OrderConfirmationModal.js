import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import { toast } from "react-toastify";
import "../Component Styles/OrderConfirmationModal.css";
import MadGoodiesQR from "../Images/MadgoodiesQR.jpg";
import ReceiptPrint from  "./ReceiptPrint";

Modal.setAppElement("#root");

const OrderConfirmationModal = ({
  isOpen,
  onRequestClose,
  cartItems,
  onConfirmOrder,
}) => {
  const [isGcashModalOpen, setGcashModalOpen] = useState(false);
  const [isConfirmTransactionModalOpen, setConfirmTransactionModalOpen] =
    useState(false);

  const confirmOrder = async () => {
    try {
      const response = await axios.post(
        "https://localhost:7162/api/orders/confirm",
        {
          totalAmount: cartItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
          ),
          orderStatus: "Pending", // Initially set to Pending
          orderDetails: cartItems.map((item) => ({
            productName: item.productName,
            productId: item.productID,
            quantity: item.quantity,
            price: item.price,
          })),
        }
      );
      toast.success(response.data);
      onConfirmOrder();
      onRequestClose();
      setGcashModalOpen(false); // Close GCash modal if it was open
      setConfirmTransactionModalOpen(false); // Close confirmation modal if it was open
    } catch (error) {
      toast.error(`Failed to confirm order: ${error.message}`);
    }
  };

  const openGcashModal = () => {
    setGcashModalOpen(true);
  };

  const closeGcashModal = () => {
    setGcashModalOpen(false);
  };

  const openConfirmTransactionModal = () => {
    setConfirmTransactionModalOpen(true);
  };

  const closeConfirmTransactionModal = () => {
    setConfirmTransactionModalOpen(false);
  };

  const handlePrint = () => {
    const printContent = document.getElementById('receipt-to-print');
    const windowUrl = 'about:blank';
    const uniqueName = new Date().getTime();
    const windowName = 'Print' + uniqueName;
    const printWindow = window.open(windowUrl, windowName, 'left=50000,top=50000,width=0,height=0');

    printWindow.document.write('<html><head><title>Print Receipt</title>');
    printWindow.document.write('<link rel="stylesheet" href="ReceiptPrint.css" type="text/css" />');
    printWindow.document.write('</head><body>');
    printWindow.document.write(printContent.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };



  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="Confirm Order Modal"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h2>Check Out</h2>
        <div className="order-summary">
          <h3>Order Summary:</h3>
          <div id="receipt-to-print" style={{ display: 'none' }}>
          <ReceiptPrint orderDetails={  cartItems} />
        </div>
          <ul>
            {cartItems.map((item) => (
              <li key={item.productID}>
                <span className="product-name">{item.productName}</span>
                <span className="product-quantity">{item.quantity}</span>
                <span className="product-price">
                  PHP {(item.price * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
          <p className="total">
            Total: PHP{" "}
            {cartItems
              .reduce((total, item) => total + item.price * item.quantity, 0)
              .toFixed(2)}
          </p>
        </div>
        <div className="button-group">
          <button
            className="confirm-button"
            onClick={openConfirmTransactionModal}
          >
            Confirm Order
          </button>
          <button className="confirm-gcash-button" onClick={openGcashModal}>
            Pay with GCash
          </button>
          <button className="cancel-button" onClick={onRequestClose}>
            Cancel
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isGcashModalOpen}
        onRequestClose={closeGcashModal}
        contentLabel="GCash Payment Modal"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h2>GCash Payment</h2>
        <div className="qr-code">
          <img
            className="GcashQrImage"
            src={MadGoodiesQR}
            alt="GCash QR Code"
          />
        </div>
        <div className="disclaimer">
          <p className="warning">
            ⚠️ Ensure the payment is confirmed on the GCash app before
            proceeding.
          </p>{" "}
           
        </div>
        <div className="button-group">
          <button
            className="confirm-payment-button"
            onClick={openConfirmTransactionModal}
          >
            Confirm Payment
          </button>
          <button className="cancel-button" onClick={closeGcashModal}>
            Cancel
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isConfirmTransactionModalOpen}
        onRequestClose={closeConfirmTransactionModal}
        contentLabel="Confirm Transaction Modal"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h2>Confirm Transaction</h2>
        <p>Are you sure you want to confirm this transaction?</p>
        <div className="button-group">
          <button className="confirm-button" onClick={confirmOrder}>
            Yes, Confirm
          </button>
          <button className="confirm-and-print-button" onClick={handlePrint}>
            Print Reciept
          </button>
          <button
            className="cancel-button"
            onClick={closeConfirmTransactionModal}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </>
  );
};

export default OrderConfirmationModal;
