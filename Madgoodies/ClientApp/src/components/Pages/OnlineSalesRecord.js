import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faTrash, faSortUp, faSortDown } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Component Styles/SalesRecord.css";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import ReportCard from "../POS System Components/ReportCard";
import { HubConnectionBuilder } from "@microsoft/signalr";
import OnlineSalesRecordModal from "../POS System Components/OnlineSalesRecordModal";

const SalesRecord = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [sortBy, setSortBy] = useState("OrderID");
  const [sortOrder, setSortOrder] = useState("asc");
  const [hubConnection, setHubConnection] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    refundedOrders: 0,
  });

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
      fetchOrders(); // Fetch data on receiving new message
    });

    return () => {
      newHubConnection.stop();
    };
  }, []);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("https://localhost:7162/api/OnlineOrder/all");
      setOrders(response.data);
      calculateStats(response.data); // Calculate stats after fetching orders
      setIsLoading(false);
    } catch (error) {
      console.error("There was an error fetching orders!", error);
      toast.error("Failed to fetch orders");
      setIsLoading(false);
    }
  };

  const calculateStats = (orders) => {
    let totalRevenue = 0;
    let totalOrders = orders.length;
    let pendingOrders = 0;
    let completedOrders = 0;
    let cancelledOrders = 0;
    let refundedOrders = 0;

    orders.forEach(order => {
      totalRevenue += order.totalAmount || 0;
      switch (order.orderStatus) {
        case "Pending":
          pendingOrders++;
          break;
        case "Completed":
          completedOrders++;
          break;
        case "Cancelled":
          cancelledOrders++;
          break;
        case "Refunded":
          refundedOrders++;
          break;
        default:
          break;
      }
    });

    setStats({
      totalRevenue,
      totalOrders,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      refundedOrders
    });
  };

  const handleSort = (column) => {
    const isAsc = sortBy === column && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortBy(column);
  };

  const filterAndSortOrders = () => {
    let filteredOrders = [...orders];

    if (searchQuery) {
      filteredOrders = filteredOrders.filter(
        (order) =>
          order.orderID.toString().includes(searchQuery) ||
          (order.orderStatus &&
            order.orderStatus.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    filteredOrders.sort((a, b) => {
      const factor = sortOrder === "asc" ? 1 : -1;
      if (sortBy === "OrderID") {
        return factor * (a.orderID - b.orderID);
      } else if (sortBy === "OrderDate") {
        return factor * (new Date(a.orderDate) - new Date(b.orderDate));
      } else if (sortBy === "TotalAmount") {
        return factor * ((a.totalAmount || 0) - (b.totalAmount || 0));
      } else if (sortBy === "OrderStatus") {
        return (
          factor * (a.orderStatus || "").localeCompare(b.orderStatus || "")
        );
      }
      return 0;
    });

    return filteredOrders;
  };
  const filteredOrders = filterAndSortOrders();

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  const renderPagination = () => {
    const pageNumbers = [];
    for (
      let i = 1;
      i <= Math.ceil(filteredOrders.length / ordersPerPage);
      i++
    ) {
      pageNumbers.push(i);
    }

    return (
      <div className="pagination">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={currentPage === number ? "active" : ""}
          >
            {number}
          </button>
        ))}
      </div>
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return { backgroundColor: "#FFF3CD", borderColor: "#FFECB5" };
      case "Completed":
        return { backgroundColor: "#D1E7DD", borderColor: "#BAE6BD" };
      case "Refunded":
        return { backgroundColor: "#D1ECF1", borderColor: "#BEE5EB" };
      case "Cancelled":
        return { backgroundColor: "#F8D7DA", borderColor: "#F5C2C7" };
      default:
        return {};
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({ html: "#salesTable" });
    doc.save("sales_record.pdf");
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.table_to_sheet(document.getElementById("salesTable"));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sales Record");
    XLSX.writeFile(wb, "sales_record.xlsx");
  };

  const exportToCSV = () => {
    const ws = XLSX.utils.table_to_sheet(document.getElementById("salesTable"));
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "sales_record.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleOpenInfoModal = async (orderId) => {
    try {
      const response = await axios.get(
        `https://localhost:7162/api/OnlineOrder/${orderId}`
      );
      console.log("Order details received:", response.data); // Log the data
      setSelectedOrderDetails(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("There was an error fetching the order details!", error);
      toast.error("Failed to fetch order details");
    }
  };

  const handleCloseModal = () => {
    setSelectedOrderDetails(null);
    setIsModalOpen(false);
  };

  const handleDeleteModal = (orderId) => {
    setOrderToDelete(orderId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteOrder = async () => {
    if (orderToDelete) {
      try {
        await axios.delete(
          `https://localhost:7162/api/OnlineOrder/${orderToDelete}`
        );
        toast.success("Order deleted successfully");
        fetchOrders(); // Refresh the order list
        setIsDeleteModalOpen(false);
        setOrderToDelete(null);
      } catch (error) {
        console.error("There was an error deleting order", error);
        toast.error("Failed to delete order");
      }
    }
  };

  return (
    <>
      <div className="SalesRecordContainer">
        <div className="SalesRecord-StatisticsCard">
          <ReportCard stats={stats} />
        </div>
        <div className="SalesRecordFlexContainer">
          <div className="export-buttons">
            <button className="export-button" onClick={exportToPDF}>
              Export to PDF
            </button>
            <button className="export-button" onClick={exportToExcel}>
              Export to Excel
            </button>
            <button className="export-button" onClick={exportToCSV}>
              Export to CSV
            </button>
            <button className="export-button" onClick={handlePrint}>
              Print
            </button>
          </div>
        </div>

        <table id="salesTable" className="SalesRecordTable">
          <thead>
            <tr>
              <th onClick={() => handleSort("OrderID")}>
                ID{" "}
                {sortBy === "OrderID" &&
                  (sortOrder === "asc" ? (
                    <FontAwesomeIcon icon={faSortUp} />
                  ) : (
                    <FontAwesomeIcon icon={faSortDown} />
                  ))}
              </th>
              <th onClick={() => handleSort("OrderDate")}>
                Date{" "}
                {sortBy === "OrderDate" &&
                  (sortOrder === "asc" ? (
                    <FontAwesomeIcon icon={faSortUp} />
                  ) : (
                    <FontAwesomeIcon icon={faSortDown} />
                  ))}
              </th>
              <th onClick={() => handleSort("TotalAmount")}>
                Total Amount
                {sortBy === "TotalAmount" &&
                  (sortOrder === "asc" ? (
                    <FontAwesomeIcon icon={faSortUp} />
                  ) : (
                    <FontAwesomeIcon icon={faSortDown} />
                  ))}
              </th>
              <th onClick={() => handleSort("OrderStatus")}>
                Status
                {sortBy === "OrderStatus" &&
                  (sortOrder === "asc" ? (
                    <FontAwesomeIcon icon={faSortUp} />
                  ) : (
                    <FontAwesomeIcon icon={faSortDown} />
                  ))}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr key={order.OrderID}>
                <td data-label="Order ID">{order.orderID}</td>
                <td data-label="Date">
                  {new Date(order.orderDate).toLocaleString()}
                </td>
                <td data-label="Total Amount">
                  {order.totalAmount.toFixed(2)}
                </td>
                <td data-label="Status">
                  <span
                    className="order-status"
                    style={{
                      backgroundColor: getStatusColor(order.orderStatus)
                        .backgroundColor,
                      borderColor: getStatusColor(order.orderStatus)
                        .borderColor,
                    }}
                  >
                    {order.orderStatus}
                  </span>
                </td>

                <td data-label="Actions">
                  <FontAwesomeIcon
                    className="salerecord-action-icon"
                    onClick={() => handleOpenInfoModal(order.orderID)}
                    icon={faInfoCircle}
                  />
                  <FontAwesomeIcon
                    className="salerecord-action-icon"
                    onClick={() => handleDeleteModal(order.orderID)}
                    icon={faTrash}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {renderPagination()}
      </div>
      <OnlineSalesRecordModal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        orderDetails={selectedOrderDetails}
      />
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        contentLabel="Confirm Delete"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete this order?</p>
        <div className="button-group">
          <button className="confirm-button" onClick={handleDeleteOrder}>
            Yes, Delete Order
          </button>
          <button
            className="cancel-button"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Cancel
          </button>
        </div>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default SalesRecord;
