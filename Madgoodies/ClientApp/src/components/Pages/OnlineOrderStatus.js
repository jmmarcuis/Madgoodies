import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { HubConnectionBuilder } from "@microsoft/signalr";
import OnlineOrderStatusCard from "../POS System Components/OnlineOrderStatusCard";
import "../Component Styles/OrderStatus.css";
import Modal from "react-modal";

const OnlineOrderStatus = () => {
  const [hubConnection, setHubConnection] = useState(null);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [filter, setFilter] = useState("Pending");

  const fetchOrdersWithDetails = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://localhost:7162/api/OnlineOrder/filtered?status=${filter}`
      );
      console.log("API response:", response.data);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    }
  }, [filter]);

  useEffect(() => {
    fetchOrdersWithDetails();
  }, [fetchOrdersWithDetails]);

  const openModal = (status) => {
    setPendingStatus(status);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setPendingStatus(null);
  };

  const handleOrderSelect = async (order) => {
    try {
      const response = await axios.get(
        `https://localhost:7162/api/OnlineOrder/${order.orderID}`
      );
      setSelectedOrder(response.data);
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error("Failed to fetch order details");
    }
  };

  const handleStatusChange = async () => {
    if (selectedOrder && pendingStatus) {
      try {
        await axios.put(
          `https://localhost:7162/api/OnlineOrder/${selectedOrder.orderID}/status`,
          JSON.stringify(pendingStatus),
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        fetchOrdersWithDetails();
        closeModal();
        toast.success(`Order status updated to ${pendingStatus}`);
      } catch (error) {
        console.error("Error updating order status:", error);
        toast.error("Failed to update order status");
      }
    }
  };

  const ongoingOrders = orders.filter(
    (order) => order.orderStatus === "Pending"
  );

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
  }, [fetchOrdersWithDetails]);

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
        {orders.map((order) => (
          <OnlineOrderStatusCard
            key={order.orderID}
            order={order}
            onSelect={() => handleOrderSelect(order)}
            isSelected={
              selectedOrder && selectedOrder.orderID === order.orderID
            }
          />
        ))}
      </div>
      <div className="orderstatus-bar">
        <div className="orderstatus-bar-flex">
          <h3>Order #{selectedOrder ? selectedOrder.orderID : ""}</h3>
        </div>
        {selectedOrder && selectedOrder.orderItems && (
          <div className="order-details">
            <p>
              <strong>Name:</strong> {selectedOrder.firstName}{" "}
              {selectedOrder.lastName}
            </p>
            <p>
              <strong>Address:</strong> {selectedOrder.address},{" "}
              {selectedOrder.apartment}, {selectedOrder.city},{" "}
              {selectedOrder.province}, {selectedOrder.zipCode}
            </p>
            <p>
              <strong>Contact:</strong> {selectedOrder.contactNumber}
            </p>
            <p>
              <strong>Total Amount:</strong> PHP{" "}
              {selectedOrder.totalAmount.toFixed(2)}
            </p>
            <p>
              <strong>Status:</strong> {selectedOrder.orderStatus}
            </p>
            <h4>Order Items:</h4>
            <div className="orderstatus-items">
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
  {selectedOrder.orderItems.map((item, index) => (
    <tr key={index}>
      <td>{item.productName}</td>
      <td>
        {item.packageQuantity 
          ? `${(item.quantity / item.packageQuantity)} pack/s` 
          : item.quantity}{" "}
        {item.packageQuantity 
          ? `(${item.packageQuantity} per pack)` 
          : ""}
      </td>
      <td>PHP {item.price.toFixed(2)}</td>
    </tr>
  ))}
</tbody>
              </table>
            </div>
          </div>
        )}
        <div className="orderstatus-button-container-flex">
          <button
            className="CompleteOrderButton"
            onClick={() => openModal("Completed")}
          >
            Complete
          </button>
          <button
            className="CancelOrderButton"
            onClick={() => openModal("Cancelled")}
          >
            Cancel
          </button>
          <button
            className="RefundOrderButton"
            onClick={() => openModal("Refunded")}
          >
            Refund
          </button>
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
        <p>
          Are you sure you want to change the status of Order #
          {selectedOrder?.orderID} to {pendingStatus}?
        </p>
        <div className="button-group ">
          <button className="confirm-button" onClick={handleStatusChange}>
            Yes, Change Status
          </button>
          <button className="cancel-button" onClick={closeModal}>
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default OnlineOrderStatus;
