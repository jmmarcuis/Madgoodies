import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Madgoodieslogo from "./Images/madgoodies.png";
import axios from "axios";
import Cart from "./POS System Components/Cart";
import OrderStatus from "./POS System Components/OrderStatus";
import SalesRecord from "./Pages/SalesRecord";
import { useNavigate } from "react-router-dom";
import "./Component Styles/PosSystem.css";
import Inventory from "./POS System Components/Inventory";
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
      case "settings":
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
              <img src={Madgoodieslogo} alt="Logo" className="login-logo" />
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
                className={`menu-item ${activeComponent === "users" ? "active" : ""}`}
                onClick={() => switchComponent("users")}
              >
                <i className="fas fa-user"></i> <span>Users</span>
              </li>
              <li
                className={`menu-item ${activeComponent === "settings" ? "active" : ""}`}
                onClick={() => switchComponent("settings")}
              >
                <i className="fas fa-cog"></i> <span>Settings</span>
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
