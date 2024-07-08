import React from "react";
import Modal from "react-modal";
import ReceiptPrint from  "./ReceiptPrint";


const SaleRecordOrderModal = ({ isOpen, onRequestClose, orderDetails }) => {
  if (
    !orderDetails ||
    !Array.isArray(orderDetails) ||
    orderDetails.length === 0
  ) {
    return null;
  }

  const getProperty = (obj, path) => {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  };

  const totalAmount = orderDetails.reduce((sum, item) => {
    const price = getProperty(item, "price") || getProperty(item, "Price") || 0;
    const quantity =
      getProperty(item, "quantity") || getProperty(item, "Quantity") || 1;
    return sum + price * quantity;
  }, 0);

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
        <div id="receipt-to-print" style={{ display: 'none' }}>
          <ReceiptPrint orderDetails={orderDetails} />
        </div>
        <div className="order-summary">
          <ul>
            {orderDetails.map((item, index) => {
              const productName =
                getProperty(item, "productName") ||
                getProperty(item, "ProductName") ||
                "Unknown Product";
              const price =
                getProperty(item, "price") || getProperty(item, "Price") || 0;
              const quantity =
                getProperty(item, "quantity") ||
                getProperty(item, "Quantity") ||
                1;
              const productId =
                getProperty(item, "productId") ||
                getProperty(item, "ProductID") ||
                index;

              return (
                <li key={productId}>
                  {productName} - {price.toFixed(2)} x {quantity}
                </li>
              );
            })}
          </ul>
          <p className="total">Total Amount: {totalAmount.toFixed(2)}</p>
        </div>
        <div className="button-group">
          <button className="confirm-button" onClick={handlePrint} >Print Reciept</button>

          <button className="cancel-button" onClick={onRequestClose}>
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SaleRecordOrderModal;
