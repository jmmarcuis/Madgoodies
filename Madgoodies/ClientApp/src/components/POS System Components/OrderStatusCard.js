import React from 'react';
import PropTypes from 'prop-types';
import '../Component Styles/OrderStatusCard.css';

const OrderStatusCard = ({ order, onSelect, isSelected, isOnlineOrder }) => {
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
        {isOnlineOrder ? (
          <>
             <span className="card-span">Online Order</span>
          </>
        ) : (
          <>
             <span className="card-span">Physical Order</span>
          </>
        )}
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

OrderStatusCard.propTypes = {
  order: PropTypes.shape({
    orderID: PropTypes.number.isRequired,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    totalAmount: PropTypes.number.isRequired,
    orderStatus: PropTypes.string.isRequired,
    orderDetails: PropTypes.arrayOf(
      PropTypes.shape({
        productID: PropTypes.number,
        productName: PropTypes.string,
        quantity: PropTypes.number,
        price: PropTypes.number,
      })
    ),
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  isOnlineOrder: PropTypes.bool.isRequired,
};

export default OrderStatusCard;
