import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Madgoodieslogo from "./Images/madgoodies.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Component Styles/PosSystem.css";
import Cart from "./Pages/Cart";
import OrderStatus from "./Pages/OrderStatus";
import Inventory from "./Pages/Inventory";
import SalesRecord from "./Pages/SalesRecord";
import Admin from "./Pages/Admin"

const PosSystem = () => {
  const navigate = useNavigate();
  const [activeComponent, setActiveComponent] = useState("inventory");
  const [goods, setGoods] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  useEffect(() => {
    const isAuthenticated = checkAuthentication();
    if (!isAuthenticated) {
      toast.error("Unauthorized Access not Allowed");
      navigate("/poslogin");
    }
  }, [navigate]);

  const checkAuthentication = () => {
    const jwtToken = localStorage.getItem("jwtToken");
    return jwtToken !== null;
  };

  const switchComponent = (component) => {
    setActiveComponent(component);
  };

  const renderActiveComponent = () => {
    const filteredGoods = goods.filter((good) =>
      good.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    switch (activeComponent) {
      case "cart":
        return <Cart />;
      case "sales":
        return <OrderStatus />;
      case "inventory":
        return <Inventory />;
      case "salesrecord":
        return <SalesRecord/>;
      case "admin":
        return <Admin/>;
      default:
        return null;
    }
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/");
  };

  return (
    <div className={`PosDashboard ${isSidebarVisible ? "sidebar-visible" : "sidebar-hidden"}`}>
      <div className={`PosSidePanel ${isSidebarVisible ? "visible" : "hidden"}`}>
        <button className="toggle-sidebar-button" onClick={toggleSidebar}>
          {isSidebarVisible ? "◀" : "☰"}
        </button>
        {isSidebarVisible && (
          <>
            <div className="logo-container">
              <img src={Madgoodieslogo} alt="Logo" className="possystem-login-logo" />
            </div>
            <ul className="menu">
              <li
                className={`menu-item ${activeComponent === "cart" ? "active" : ""}`}
                onClick={() => switchComponent("cart")}
              >
                <i className="fas fa-book"></i> <span>Catalogue</span>
              </li>
              <li
                className={`menu-item ${activeComponent === "sales" ? "active" : ""}`}
                onClick={() => switchComponent("sales")}
              >
                <i className="fas fa-shopping-cart"></i> <span>Orders</span>
              </li>
              <li
                className={`menu-item ${activeComponent === "inventory" ? "active" : ""}`}
                onClick={() => switchComponent("inventory")}
              >
                <i className="fas fa-box"></i> <span>Inventory</span>
              </li>
              <li
                className={`menu-item ${activeComponent === "salesrecord" ? "active" : ""}`}
                onClick={() => switchComponent("salesrecord")}
              >
                <i className="fas fa-chart-line"></i> <span>Sales Record</span>
              </li>
              <li
                className={`menu-item ${activeComponent === "admin" ? "active" : ""}`}
                onClick={() => switchComponent("admin")}
              >
                <i className="fas fa-user"></i> <span>Users</span>
              </li>
           
            </ul>
            <div className="logout">
              <ul className="menu">
                <li className="menu-item" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i> <span>Logout</span>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>

      <div className="PosContent">
        {renderActiveComponent()}
      </div>
    </div>
  );
};

export default PosSystem;
