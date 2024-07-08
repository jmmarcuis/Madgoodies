import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle,
  faTrash,
  faSortUp,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Component Styles/SalesRecord.css";
import Modal from "react-modal";
import DatePicker from "react-datepicker"; // Make sure to install this package
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import ReportCard from "../POS System Components/ReportCard";
import { HubConnectionBuilder } from "@microsoft/signalr";
import SaleRecordOrderModal from "../POS System Components/SaleRecordOrderModal";

const SalesRecord = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [sortBy, setSortBy] = useState("OrderID");
  const [sortOrder, setSortOrder] = useState("asc");

  const [dateRange, setDateRange] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [hubConnection, setHubConnection] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    refundedOrders: 0,
  });

  useEffect(() => {
    fetchOrders();
  }, []);

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

  useEffect(() => {
    fetchMoreData();
  }, []);

  const fetchMoreData = async () => {
    try {
      const response = await axios.get("https://localhost:7162/api/good/all");
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "https://localhost:7162/api/Orders/withdetails"
      );
      setOrders(response.data);

      // Calculate statistics
      const newStats = response.data.reduce(
        (acc, order) => {
          acc.totalRevenue += order.totalAmount;
          acc.totalOrders++;
          switch (order.orderStatus) {
            case "Pending":
              acc.pendingOrders++;
              break;
            case "Completed":
              acc.completedOrders++;
              break;
            case "Cancelled":
              acc.cancelledOrders++;
              break;
            case "Refunded":
              acc.refundedOrders++;
              break;
          }
          return acc;
        },
        {
          totalRevenue: 0,
          totalOrders: 0,
          pendingOrders: 0,
          completedOrders: 0,
          cancelledOrders: 0,
          refundedOrders: 0,
        }
      );

      setStats(newStats);
      console.log("Orders with details:", response.data);
    } catch (error) {
      console.error("There was an error fetching the orders!", error);
      toast.error("Failed to fetch orders");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (column) => {
    const isAsc = sortBy === column && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortBy(column);
  };

  const filterOrdersByDate = (orders) => {
    const currentDate = new Date();
    switch (dateRange) {
      case "7days":
        const sevenDaysAgo = new Date(
          currentDate.setDate(currentDate.getDate() - 7)
        );
        return orders.filter(
          (order) => new Date(order.OrderDate) >= sevenDaysAgo
        );
      case "1month":
        const oneMonthAgo = new Date(
          currentDate.setMonth(currentDate.getMonth() - 1)
        );
        return orders.filter(
          (order) => new Date(order.OrderDate) >= oneMonthAgo
        );
      case "6months":
        const sixMonthsAgo = new Date(
          currentDate.setMonth(currentDate.getMonth() - 6)
        );
        return orders.filter(
          (order) => new Date(order.OrderDate) >= sixMonthsAgo
        );
      case "1year":
        const oneYearAgo = new Date(
          currentDate.setFullYear(currentDate.getFullYear() - 1)
        );
        return orders.filter(
          (order) => new Date(order.OrderDate) >= oneYearAgo
        );
      case "custom":
        return orders.filter((order) => {
          const orderDate = new Date(order.OrderDate);
          return (
            (!startDate || orderDate >= startDate) &&
            (!endDate || orderDate <= endDate)
          );
        });
      default:
        return orders;
    }
  };

  const filterAndSortOrders = () => {
    let filteredOrders = [...orders];

    filteredOrders = filterOrdersByDate(filteredOrders);

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

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await axios.put("https://localhost:7162/api/Orders/status", {
        OrderID: orderId,
        NewStatus: newStatus,
      });
      toast.success("Order status updated successfully");
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
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

  const handleOpenModal = async (orderId) => {
    try {
      const response = await axios.get(`https://localhost:7162/api/Orders/${orderId}`);
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

  return (
    <>
      <div className="SalesRecordContainer">
        <div className="SalesRecord-StatisticsCard">
          <ReportCard stats={stats} />
        </div>
        <div className="SalesRecordFlexContainer">
          <div className="SalesRecord-DateOptions">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="7days">Last 7 Days</option>
              <option value="1month">Last Month</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
              <option value="custom">Custom Range</option>
            </select>
            {dateRange === "custom" && (
              <div>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  placeholderText="Start Date"
                />
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  placeholderText="End Date"
                />
              </div>
            )}
          </div>

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
                    onClick={() => handleOpenModal(order.orderID)}
                    icon={faInfoCircle}
                  />
                  <FontAwesomeIcon
                    className="salerecord-action-icon"
                    icon={faTrash}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {renderPagination()}
      </div>
      <SaleRecordOrderModal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        orderDetails={selectedOrderDetails}      />
      <ToastContainer />
    </>
  );
};

export default SalesRecord;
