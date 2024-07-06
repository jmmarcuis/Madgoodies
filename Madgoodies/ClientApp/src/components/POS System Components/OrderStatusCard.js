import React from 'react';
import PropTypes from 'prop-types';
import '../Component Styles/OrderStatusCard.css';

const OrderStatusCard = ({ order, onSelect, isSelected }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return '#9E9E9E'; // Orange
      case 'Completed':
        return '#4CAF50'; // Green
      case 'Cancelled':
        return '#F44336'; // Red
      case 'Refunded':
        return '#2196F3'; // Blue
      default:
        return '#9E9E9E'; // Grey
    }
  };

  return (
    <div className={`order-status-card ${isSelected ? 'selected' : ''}`} onClick={onSelect}>
      <div className="order-status-card-left">
        <h4>Order No. {order.orderID}</h4>
        <p>Number of items: {order.orderDetails.length}</p>
      </div>
      <div className="order-status-card-right">
        <p className="price">PHP {order.totalAmount.toFixed(2)}</p>
        <span className="order-status" style={{ backgroundColor: getStatusColor(order.orderStatus) }}>
          {order.orderStatus}
        </span>
      </div>
    </div>
  );
};

OrderStatusCard.propTypes = {
  order: PropTypes.shape({
    orderID: PropTypes.number.isRequired,
    orderDetails: PropTypes.arrayOf(
      PropTypes.shape({
        productID: PropTypes.number.isRequired,
        productName: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        price: PropTypes.number.isRequired,
      })
    ).isRequired,
    totalAmount: PropTypes.number.isRequired,
    orderDate: PropTypes.string.isRequired,
    orderStatus: PropTypes.string.isRequired,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
};

export default OrderStatusCard;