import React from "react";

const OnlineRecieptPrint = ({ orderDetails }) => {
  if (!orderDetails) return null;

  return (
    <div className="receipt-print">
      <h3>Order #{orderDetails.orderID}</h3>
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
              ? `${(item.quantity / item.packageQuantity)} pack/s` 
              : item.quantity}{" "}
            {item.packageQuantity 
              ? `(${item.packageQuantity} per pack)` 
              : ""}
            {` - ${item.price.toFixed(2)} each`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OnlineRecieptPrint;
