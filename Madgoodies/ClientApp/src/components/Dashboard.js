import React, { Component } from "react";
import { toast } from "react-toastify";
import "../components/Component Styles/Dashboard.css";
import Madgoodieslogo from "./Images/madgoodies.png";
import axios from "axios";
import Inventory from "./Inventory System Components/Inventory";
import GoodsModal from "./Inventory System Components/GoodsModal";
import ConfirmDeleteModal from "./Inventory System Components/ConfirmDeleteModal";

export class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      goods: [],
      showModal: false,
      showDeleteModal: false, // State to control the delete confirmation modal
      productName: "",
      price: "",
      stock: "",
      description: "",
      productImage: "",
      isSubmitting: false,
      editMode: false,
      editId: null,
      deleteId: null, // ID of the item to be deleted
      activeComponent: "inventory", // default to inventory
      fileName: "",
      isLoading: false,
    };
  }

  static displayName = Dashboard.name;

  componentDidMount() {
    this.fetchGoods();
  }

  fetchGoods = async () => {
    this.setState({ isLoading: true });
    try {
      const response = await axios.get("https://localhost:7162/api/good/all");
      this.setState({ goods: response.data });
    } catch (error) {
      console.error("There was an error fetching the goods!", error);
      toast.error("Failed to fetch goods");
    } finally {
      this.setState({ isLoading: false });
    }
  };

  deleteGood = async (id) => {
    this.setState({ isLoading: true });
    try {
      await axios.delete(`https://localhost:7162/api/good/${id}`);
      await this.fetchGoods(); // Refresh the list after deletion
      toast.success("Good deleted successfully");
    } catch (error) {
      console.error("There was an error deleting the good!", error);
      toast.error("Failed to delete good");
    } finally {
      this.setState({ isLoading: false });
    }
  };

  handleEdit = (id) => {
    const editItem = this.state.goods.find((good) => good.productID === id);
    if (editItem) {
      this.setState({
        editMode: true,
        editId: id,
        productName: editItem.productName,
        price: editItem.price,
        stock: editItem.stock,
        description: editItem.description,
        fileName: editItem.productImageUrl, // Store the current image URL
        showModal: true,
      });
    }
  };

  handleUpdate = async (e) => {
    e.preventDefault();
    this.setState({ isLoading: true, isSubmitting: true });

    const formData = new FormData();
    formData.append("productName", this.state.productName);
    formData.append("price", this.state.price);
    formData.append("stock", this.state.stock);
    formData.append("description", this.state.description);

    // Only append the image if a new one was selected
    if (this.state.productImage instanceof File) {
      formData.append("productImage", this.state.productImage);
    } else {
      // If no new image was selected, send the existing image URL
      formData.append("productImageUrl", this.state.fileName);
    }

    try {
      await axios.put(
        `https://localhost:7162/api/good/${this.state.editId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      this.setState({
        showModal: false,
        editMode: false,
        editId: null,
        productName: "",
        price: "",
        stock: "",
        description: "",
        productImage: "",
        fileName: "",
      });
      await this.fetchGoods();
      toast.success("Good updated successfully");
    } catch (error) {
      console.error("There was an error updating the good!", error);
      toast.error("Failed to update good");
    } finally {
      setTimeout(() => {
        this.setState({ isLoading: false, isSubmitting: false });
      }, 2000);
    }
  };
  handleDelete = (id) => {
    this.setState({ showDeleteModal: true, deleteId: id });
  };

  confirmDelete = () => {
    const { deleteId } = this.state;
    this.setState({ showDeleteModal: false, deleteId: null }, () => {
      this.deleteGood(deleteId);
    });
  };

  handleLogout = () => {
    localStorage.removeItem("token");
    this.props.history.push("/login");
  };

  handleAddGoodsClick = () => {
    this.setState({ showModal: true });
  };

  handleCloseModal = () => {
    this.setState({
      showModal: false,
      fileName: "", // Reset fileName when closing the modal
    });
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      this.setState({
        productImage: file,
        fileName: file.name,
      });
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ isLoading: true, isSubmitting: true });

    this.setState({
      productName: "",
      price: "",
      stock: "",
      description: "",
      productImage: "",
      fileName: "",
    });

    // Disable the submit button
    this.setState({ isSubmitting: true });

    const formData = new FormData();
    formData.append("productName", this.state.productName);
    formData.append("price", this.state.price);
    formData.append("stock", this.state.stock);
    formData.append("description", this.state.description);
    formData.append("productImage", this.state.productImage);

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
      this.setState({ showModal: false });
      this.fetchGoods(); // Refresh the goods list after adding a new good

      // Reset form fields
      this.setState({
        productName: "",
        price: "",
        stock: "",
        description: "",
        productImage: "",
        fileName: "",
      });
    await this.fetchGoods();
          toast.success("New good added successfully");
    } catch (error) {
      console.error("There was an error adding the good!", error);
      toast.error("Failed to add new good");
    } finally {
      this.setState({ isLoading: false, isSubmitting: false });
    }
  };

  switchComponent = (component) => {
    this.setState({ activeComponent: component });
  };

  renderActiveComponent = () => {
    const { activeComponent, goods } = this.state;
    switch (activeComponent) {
      case "inventory":
        return (
          <Inventory
            goods={goods}
            handleEdit={this.handleEdit}
            handleDelete={this.handleDelete}
            handleAddGoodsClick={this.handleAddGoodsClick} // Pass the handleAddGoodsClick function
          />
        );
      case "sales":
        return <div>Sales Record Component</div>; // Replace with your SalesRecord component
      case "settings":
        return <div>Settings Component</div>; // Replace with your Settings component
      default:
        return null;
    }
  };

  render() {
    const {
      showModal,
      showDeleteModal,
      productName,
      price,
      stock,
      description,
      isSubmitting,
      editMode,
      fileName,
      isLoading,
    } = this.state;

    return (
      <div className="DashboardContainer">
        <div className="SidePanel">
          <img src={Madgoodieslogo} alt="Logo" className="login-logo" />
          <ul className="">
            <li onClick={() => this.switchComponent("inventory")}>Inventory</li>
            <li onClick={() => this.switchComponent("sales")}>Sales Record</li>
            <li onClick={() => this.switchComponent("settings")}>Settings</li>
            <li onClick={this.handleLogout}>Logout</li>
          </ul>
        </div>
        <div className="MainContent">{this.renderActiveComponent()}</div>

        <GoodsModal
          isOpen={showModal}
          onRequestClose={this.handleCloseModal}
          handleSubmit={this.handleSubmit}
          handleUpdate={this.handleUpdate}
          handleChange={this.handleChange}
          handleImageChange={this.handleImageChange}
          editMode={editMode}
          isSubmitting={isSubmitting}
          productName={productName}
          price={price}
          stock={stock}
          description={description}
          fileName={fileName}
          isLoading={isLoading}
        />

        <ConfirmDeleteModal
          isOpen={showDeleteModal}
          onRequestClose={() => this.setState({ showDeleteModal: false })}
          onConfirm={this.confirmDelete}
        />
      </div>
    );
  }
}

export default Dashboard;
