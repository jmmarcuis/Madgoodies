import React from 'react';
import '../Component Styles/RecieptPrint.css';  

const ReceiptPrint = ({ orderDetails }) => {
  if (!orderDetails || !Array.isArray(orderDetails) || orderDetails.length === 0) {
    return null;
  }

  const getProperty = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  const totalAmount = orderDetails.reduce((sum, item) => {
    const price = getProperty(item, 'price') || getProperty(item, 'Price') || 0;
    const quantity = getProperty(item, 'quantity') || getProperty(item, 'Quantity') || 1;
    return sum + (price * quantity);
  }, 0);

  return (
    <div className="receipt-80mm">
      <div className="receipt-header">
        <h1>MadGoodies</h1>
        <p>123 Store Street, City, Country</p>
        <p>Phone: (123) 456-7890</p>
        <div className="receipt-divider">--------------------------------</div>
      </div>
      <div className="receipt-body">
        <p>Date: {new Date().toLocaleString()}</p>
        <p>Order #: {Math.floor(Math.random() * 1000000)}</p>
        <div className="receipt-divider">--------------------------------</div>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {orderDetails.map((item, index) => {
              const productName = getProperty(item, 'productName') || getProperty(item, 'ProductName') || 'Unknown Product';
              const price = getProperty(item, 'price') || getProperty(item, 'Price') || 0;
              const quantity = getProperty(item, 'quantity') || getProperty(item, 'Quantity') || 1;
              return (
                <tr key={index}>
                  <td>{productName}</td>
                  <td>{quantity}</td>
                  <td>PHP {price.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="receipt-divider">--------------------------------</div>
        <div className="receipt-total">
          <p>Total: PHP{totalAmount.toFixed(2)}</p>
        </div>
      </div>
      <div className="receipt-footer">
        <div className="receipt-divider">--------------------------------</div>
        <p>Thank you for your purchase!</p>
        <p>Please come again</p>
      </div>
    </div>
  );
};

 export default ReceiptPrint;