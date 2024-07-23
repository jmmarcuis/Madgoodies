import React from "react";
import Modal from "react-modal";
import ReceiptPrint from "./ReceiptPrint";

const OnlineSalesRecordModal = ({ isOpen, onRequestClose, orderDetails }) => {
  
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
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Order Details Modal"
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <div className="order-modal-content">
        <h2>Order Details</h2>
        {orderDetails && (
          <>
            <p><strong>Order ID:</strong> {orderDetails.orderID}</p>
            <p><strong>Name:</strong> {orderDetails.firstName} {orderDetails.lastName}</p>
            <p><strong>Address:</strong> {orderDetails.address}, {orderDetails.apartment}, {orderDetails.city}, {orderDetails.province}, {orderDetails.zipCode}</p>
            <p><strong>Contact Number:</strong> {orderDetails.contactNumber}</p>
            <p><strong>Date:</strong> {new Date(orderDetails.orderDate).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {orderDetails.orderStatus}</p>
            <p><strong>Total Amount:</strong> ${orderDetails.totalAmount.toFixed(2)}</p>
            
            <h4>Items:</h4>
            <ul>
              {orderDetails.orderItems.map(item => (
                <li key={item.orderItemID}>
                  {item.productName} - 
                  {item.packageQuantity 
                    ? `${(item.quantity / item.packageQuantity).toFixed(2)} pack/s` 
                    : item.quantity}{" "}
                  {item.packageQuantity 
                    ? `(${item.packageQuantity} per pack)` 
                    : ""}
                  {` - ${item.price.toFixed(2)} each`}
                </li>
              ))}
            </ul>
          </>
        )}
        <div id="receipt-to-print" style={{ display: 'none' }}>
          <ReceiptPrint orderDetails={orderDetails} />
        </div>
        <div className="button-group">
          <button className="confirm-button" onClick={handlePrint}>Print Receipt</button>
          <button className="cancel-button" onClick={onRequestClose}>Cancel</button>
        </div>
      </div>
    </Modal>
  );
};

export default OnlineSalesRecordModal;
