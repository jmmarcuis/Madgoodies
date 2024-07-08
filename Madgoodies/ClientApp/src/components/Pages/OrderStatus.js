import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { HubConnectionBuilder } from "@microsoft/signalr";
import OrderStatusCard from "../POS System Components/OrderStatusCard";
import "../Component Styles/OrderStatus.css";
import Modal from 'react-modal';

const OrderStatus = () => {
    const [hubConnection, setHubConnection] = useState(null);
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filter, setFilter] = useState("Pending");
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [pendingStatus, setPendingStatus] = useState(null);

  useEffect(() => {
    const newHubConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:7162/FetchHub")
      .build();
    setHubConnection(newHubConnection);
    newHubConnection
      .start()
      .then(() => {
        console.log("SignalR Connected");
       })
      .catch((err) => {
        console.error("SignalR Connection Error: ", err);
        toast.error("Failed to connect to SignalR");
      });
    newHubConnection.on("ReceiveMessage", (message) => {
      console.log("Received message from SignalR:", message);
      fetchOrdersWithDetails();
    });
    newHubConnection.onclose(() => {
       console.log("Disconnected from SignalR");
    });
    return () => {
      newHubConnection.stop();
    };
  }, []);
  useEffect(() => {
    fetchOrdersWithDetails();
  }, []);
  const fetchOrdersWithDetails = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7162/api/orders/withdetails"
      );
      console.log("Orders with details:", response.data);
      setOrders(response.data);
    } catch (error) {
      console.error(
        "Error fetching orders with details:",
        error.response ? error.response.data : error.message
      );
      toast.error("Failed to fetch orders");
    }
  };
  const openModal = (status) => {
    setPendingStatus(status);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setPendingStatus(null);
  };
  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
  };

  const handleStatusChange = async () => {
    if (!selectedOrder || !pendingStatus) return;

    try {
        await axios.put(`https://localhost:7162/api/orders/status`, {
            orderID: selectedOrder.orderID,
            newStatus: pendingStatus
        });
        fetchOrdersWithDetails(); // Refresh orders after status change
        toast.success(`Order ${selectedOrder.orderID} status changed to ${pendingStatus}`);
        closeModal();
    } catch (error) {
        console.error("Error updating order status:", error);
        toast.error("Failed to update order status");
    }
};
  const filteredOrders = orders.filter((order) => order.orderStatus === filter);
  

return (
    <div className="orderstatus-flex">
      <div className="orderstatus-catalogue-flex">
        <div className="orderstatus-filters">
          {["Pending", "Completed", "Cancelled", "Refunded"].map((status) => (
            <p
              key={status}
              className={filter === status ? "active" : ""}
              onClick={() => setFilter(status)}
            >
              {status}
            </p>
          ))}
        </div>
        {filteredOrders.map((order) => (
          <OrderStatusCard
            key={order.orderID}
            order={order}
            onSelect={() => handleOrderSelect(order)}
            isSelected={selectedOrder && selectedOrder.orderID === order.orderID}
          />
        ))}
      </div>
      <div className="orderstatus-bar">
        <div className="orderstatus-bar-flex">
          <h3>Order #{selectedOrder ? selectedOrder.orderID : ""}</h3>
        </div>
        <div className="orderstatus-items">
          {selectedOrder && (
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.orderDetails.map((item, index) => (
                  <tr key={index}>
                    <td>{item.productName}</td>
                    <td>{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="orderstatus-button-container-flex">
          <button className="CompleteOrderButton" onClick={() => openModal("Completed")}>Complete</button>
          <button className="CancelOrderButton" onClick={() => openModal("Cancelled")}>Cancel</button>
          <button className="RefundOrderButton" onClick={() => openModal("Refunded")}>Refund</button>
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Confirm Status Change"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h2>Confirm Transaction</h2>
        <p>Are you sure you want to change the status of Order #{selectedOrder?.orderID} to {pendingStatus}?</p>
        <div className="button-group ">
          <button className="confirm-button" onClick={handleStatusChange}>Yes, Change Status</button>
          <button className="cancel-button" onClick={closeModal}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
};

export default OrderStatus;
