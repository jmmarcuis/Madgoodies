import React from 'react';
import PropTypes from 'prop-types';
import '../Component Styles/OrderStatusCard.css';

const OnlineOrderStatusCard = ({ order, onSelect, isSelected }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return '#FFF3CD'; // Orange 
      case 'Completed':
        return '#D1E7DD'; // Green
      case 'Cancelled':
        return '#D1ECF1'; // Red
      case 'Refunded':
        return '#F8D7DA'; // Blue
      default:
        return '#9E9E9E'; // Grey
    }
  };

  return (
    <div className={`order-status-card ${isSelected ? 'selected' : ''}`} onClick={onSelect}>
      <div className="order-status-card-left">
        <h4>Order No. {order.orderID}</h4>
        <p>{order.firstName} {order.lastName}</p>
      </div>
      <div className="order-status-card-right">
        <p className="price">PHP {order.totalAmount.toFixed(2)}</p>
        <span className="order-status-card-span" style={{ backgroundColor: getStatusColor(order.orderStatus) }}>
          {order.orderStatus}
        </span>
      </div>
    </div>
  );
};

OnlineOrderStatusCard.propTypes = {
  order: PropTypes.shape({
    orderID: PropTypes.number.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    totalAmount: PropTypes.number.isRequired,
    orderStatus: PropTypes.string.isRequired,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
};

export default OnlineOrderStatusCard;