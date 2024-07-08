import React from 'react';

const ReportCard = ({ stats }) => (
  <div className="report-card">
    <div className="stat-box">
      <span className="stat-value">{stats.totalRevenue.toFixed(2)}</span>
      <span className="stat-label">Total Revenue</span>
    </div>
    <div className="stat-box">
      <span className="stat-value">{stats.totalOrders}</span>
      <span className="stat-label">Total Orders</span>
    </div>
    <div className="stat-box">
      <span className="stat-value">{stats.pendingOrders}</span>
      <span className="stat-label">Pending Orders</span>
    </div>
    <div className="stat-box">
      <span className="stat-value">{stats.completedOrders}</span>
      <span className="stat-label">Completed Orders</span>
    </div>
    <div className="stat-box">
      <span className="stat-value">{stats.cancelledOrders}</span>
      <span className="stat-label">Cancelled Orders</span>
    </div>
    <div className="stat-box">
      <span className="stat-value">{stats.refundedOrders}</span>
      <span className="stat-label">Refunded Orders</span>
    </div>
  </div>
);

export default ReportCard;
