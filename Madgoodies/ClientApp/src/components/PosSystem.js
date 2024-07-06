import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Madgoodieslogo from "./Images/madgoodies.png";
import axios from "axios";
import Cart from "./POS System Components/Cart";
import OrderStatus from "./POS System Components/OrderStatus";
import { useNavigate } from "react-router-dom";
import "./Component Styles/PosSystem.css";

const PosSystem = () => {
  const navigate = useNavigate();
  const [activeComponent, setActiveComponent] = useState("inventory");
  const [goods, setGoods] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const isAuthenticated = checkAuthentication();
    if (!isAuthenticated) {
      toast.error("Unauthorized Access not Allowed");
      navigate("/poslogin"); // Redirect to login page
    }
  }, [navigate]);

  useEffect(() => {
    axios
      .get("/api/goods")
      .then((response) => {
        setGoods(response.data.goods);
      })
      .catch((error) => {
        console.error("Error fetching goods:", error);
      });
  }, []);

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
        return <OrderStatus/>;
      case "settings":
        return <div>Settings Component</div>;
      default:
        return null;
    }
  };

  const toggleSidebar = (event) => {
    if (event && event.target.classList.contains("sidebar-overlay")) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/");
  };

  return (
    <div className={`PosDashboard ${isSidebarOpen ? "sidebar-open" : ""}`}>
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}
      <div className={`PosSidePanel ${isSidebarOpen ? "open" : ""}`}>
        <button className="close-sidebar" onClick={toggleSidebar}>
          ×
        </button>
        <div className="logo-container">
          <img src={Madgoodieslogo} alt="Logo" className="login-logo" />
        </div>
        <ul className="menu">
          <li
            className={`menu-item ${
              activeComponent === "cart" ? "active" : ""
            }`}
            onClick={() => switchComponent("cart")}
          >
            <i className="fas fa-book"></i> Catalogue
          </li>
          <li
            className={`menu-item ${
              activeComponent === "sales" ? "active" : ""
            }`}
            onClick={() => switchComponent("sales")}
          >
            <i className="fas fa-shopping-cart"></i> Orders
          </li>
          <li
            className={`menu-item ${
              activeComponent === "settings" ? "active" : ""
            }`}
            onClick={() => switchComponent("settings")}
          >
            <i className="fas fa-cog"></i> Settings
          </li>
        </ul>
        <div className="logout">
          <ul className="menu">
            <li className="menu-item" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </li>
          </ul>
        </div>
      </div>
      <div className="PosContent">
        <button className="toggle-sidebar" onClick={toggleSidebar}>
          ☰
        </button>
        {renderActiveComponent()}
      </div>
    </div>
  );
};

export default PosSystem;
