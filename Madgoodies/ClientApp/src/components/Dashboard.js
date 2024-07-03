import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "../components/Component Styles/Dashboard.css";
import Madgoodieslogo from "./Images/madgoodies.png";
import axios from "axios";
import Inventory from "./Inventory System Components/Inventory";
import AddGoodModal from "./Inventory System Components/AddGoodModal";
import EditGoodModal from "./Inventory System Components/EditGoodModal";
import ConfirmDeleteModal from "./Inventory System Components/ConfirmDeleteModal";
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [goods, setGoods] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [productImage, setProductImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [activeComponent, setActiveComponent] = useState("inventory");
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status
    const isAuthenticated = checkAuthentication();
    if (!isAuthenticated) {
      toast.error("Unauthorized Access not Allowed");
      navigate("/"); // Redirect to login page
    } else {
      fetchGoods();
    }
  }, []);

  const checkAuthentication = () => {
    // Check if token exists in localStorage or implement your authentication logic here
    const jwtToken = localStorage.getItem("jwtToken");
    return jwtToken !== null; // Return true if authenticated, false otherwise
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSubmitting(true);

    try {
      const productData = { productName, price, stock, description };
      await axios.put(`https://localhost:7162/api/good/${editId}`, productData);

      if (productImage instanceof File) {
        const formData = new FormData();
        formData.append("productImage", productImage);
        await axios.put(
          `https://localhost:7162/api/good/${editId}/image`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      setShowEditModal(false);
      setEditMode(false);
      setEditId(null);
      setProductName("");
      setPrice("");
      setStock("");
      setDescription("");
      setProductImage("");
      setFileName("");
      await fetchGoods();
      toast.success("Good updated successfully");
    } catch (error) {
      console.error("There was an error updating the good!", error);
      toast.error("Failed to update good");
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  const fetchGoods = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("https://localhost:7162/api/good/all");
      setGoods(response.data);
      toast.success("Fetched Data successfully");
    } catch (error) {
      console.error("There was an error fetching the goods!", error);
      toast.error("Failed to fetch goods");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteGood = async (id) => {
    setIsLoading(true);
    try {
      await axios.delete(`https://localhost:7162/api/good/${id}`);
      await fetchGoods();
      toast.success("Good deleted successfully");
    } catch (error) {
      console.error("There was an error deleting the good!", error);
      toast.error("Failed to delete good");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id) => {
    setShowDeleteModal(true);
    setDeleteId(id);
  };

  const confirmDelete = () => {
    setShowDeleteModal(false);
    deleteGood(deleteId);
  };

  const handleAddGoodsClick = () => {
    setShowAddModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSubmitting(true);

    setProductName("");
    setPrice("");
    setStock("");
    setDescription("");
    setProductImage("");
    setFileName("");

    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("description", description);
    formData.append("productImage", productImage);

    try {
      const response = await axios.post(
        "https://localhost:7162/api/good/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      setShowAddModal(false);
      await fetchGoods();
      toast.success("New good added successfully");
    } catch (error) {
      console.error("There was an error adding the good!", error);
      toast.error("Failed to add new good");
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setProductName("");
    setPrice("");
    setStock("");
    setDescription("");
    setProductImage("");
    setFileName("");
  };

  const handleEdit = (id) => {
    const editItem = goods.find((good) => good.productID === id);
    if (editItem) {
      setEditMode(true);
      setEditId(id);
      setProductName(editItem.productName);
      setPrice(editItem.price);
      setStock(editItem.stock);
      setDescription(editItem.description);
      setFileName(editItem.productImageUrl);
      setShowEditModal(true);
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditId(null);
    setProductName("");
    setPrice("");
    setStock("");
    setDescription("");
    setProductImage("");
    setFileName("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "productName":
        setProductName(value);
        break;
      case "price":
        setPrice(value);
        break;
      case "stock":
        setStock(value);
        break;
      case "description":
        setDescription(value);
        break;
      default:
        break;
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductImage(file);
      setFileName(file.name);
    }
  };
  const handleLogout = () => {
    
    localStorage.removeItem("jwtToken");
    toast.success("Logged out successfully");

    navigate("/"); // Redirect to the home page or login page
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const switchComponent = (component) => {
    setActiveComponent(component);
  };

  const renderActiveComponent = () => {
    const filteredGoods = goods.filter(good =>
      good.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    switch (activeComponent) {
      case "inventory":
        return (
          <Inventory
            goods={filteredGoods}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleAddGoodsClick={handleAddGoodsClick}
            isLoading={isLoading}
            showAddModal={showAddModal}
            showEditModal={showEditModal}
            handleCloseAddModal={handleCloseAddModal}
            handleCloseEditModal={handleCloseEditModal}
            handleSubmit={handleSubmit}
            handleUpdate={handleUpdate}
            handleChange={handleChange}
            handleImageChange={handleImageChange}
            isSubmitting={isSubmitting}
            productName={productName}
            price={price}
            stock={stock}
            description={description}
            fileName={fileName}
            searchQuery={searchQuery}
            handleSearchChange={handleSearchChange}
          />
        );
      case "sales":
        return <div>Sales Record Component</div>;
      case "settings":
        return <div>Settings Component</div>;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard">
      <div className="SidePanel">
        <div className="logo-container">
          <img src={Madgoodieslogo} alt="Logo" className="login-logo" />
        </div>
        <ul className="menu">
          <li
            className={`menu-item ${activeComponent === "inventory" ? "active" : ""}`}
            onClick={() => switchComponent("inventory")}
          >
            <i className="fas fa-box"></i> Inventory
          </li>
          <li
            className={`menu-item ${activeComponent === "sales" ? "active" : ""}`}
            onClick={() => switchComponent("sales")}
            >
              <i className="fas fa-chart-line"></i> Sales Record
            </li>
            <li
              className={`menu-item ${activeComponent === "settings" ? "active" : ""}`}
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
        <div className="MainContent">{renderActiveComponent()}</div>
  
        {showDeleteModal && (
          <ConfirmDeleteModal
            isOpen={showDeleteModal}
            onRequestClose={() => setShowDeleteModal(false)}
            onConfirm={confirmDelete}
            isLoading={isLoading}
          />
        )}
      </div>
    );
  };
  
  export default Dashboard;
