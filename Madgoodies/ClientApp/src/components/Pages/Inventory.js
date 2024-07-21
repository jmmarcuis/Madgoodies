import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faEdit,
  faSortUp,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HubConnectionBuilder } from "@microsoft/signalr";
import "../Component Styles/Inventory.css";
import Modal from "react-modal";
import AddGoodModal from "../POS System Components/AddGoodModal";
import EditGoodModal from "../POS System Components/EditGoodModal";
import PackagingModal from "../POS System Components/PackagingModal";
const Inventory = () => {
  // State Variables
  const [goods, setGoods] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hubConnection, setHubConnection] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const goodsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingGood, setEditingGood] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const [showPackagingModal, setShowPackagingModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const [newGood, setNewGood] = useState({
    productName: "",
    price: "",
    stock: "",
    description: "",
    productImage: null,
  });
  const [sortBy, setSortBy] = useState("productID");
  const [sortOrder, setSortOrder] = useState("asc");

  // Fetching Data
  useEffect(() => {
    const newHubConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:7162/FetchHub")
      .build();

    setHubConnection(newHubConnection);

    newHubConnection
      .start()
      .then(() => console.log("SignalR Connected"))
      .catch((err) => {
        console.error("SignalR Connection Error: ", err);
        toast.error("Failed to connect to SignalR");
      });

    newHubConnection.on("ReceiveMessage", () => fetchMoreData());

    return () => newHubConnection.stop();
  }, []);

  useEffect(() => {
    fetchMoreData();
  }, []);

  const fetchMoreData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("https://localhost:7162/api/good/all");
      setGoods(response.data);

      const packagingResponses = await Promise.all(
        response.data.map((good) =>
          axios.get(
            `https://localhost:7162/api/good/${good.productID}/packaging`
          )
        )
      );
    } catch (error) {
      console.error("Error fetching goods!", error);
      toast.error("Failed to fetch goods");
    } finally {
      setIsLoading(false);
    }
  };

  // CRUD Operations
  const handleAddGoodsClick = () => setShowAddModal(true);

  const deleteGood = async (id) => {
    setIsLoading(true);
    try {
      await axios.delete(`https://localhost:7162/api/good/${id}`);
      await fetchMoreData();
      toast.success("Good deleted successfully");
    } catch (error) {
      console.error("Error deleting good!", error);
      toast.error("Failed to delete good");
    } finally {
      setIsLoading(false);
      setModalIsOpen(false);
    }
  };

  const handleAddGoodChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "productImage" && files?.length) {
      setNewGood((prevGood) => ({
        ...prevGood,
        [name]: files[0],
        fileName: files[0].name,
      }));
    } else {
      setNewGood((prevGood) => ({
        ...prevGood,
        [name]: value,
      }));
    }
  };

  const handleAddGoodSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("productName", newGood.productName);
      formData.append("price", newGood.price);
      formData.append("stock", newGood.stock);
      formData.append("description", newGood.description);
      if (newGood.productImage) {
        formData.append(
          "productImage",
          newGood.productImage,
          newGood.productImage.name
        );
      }

      await axios.post("https://localhost:7162/api/good/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setShowAddModal(false);
      await fetchMoreData();
      toast.success("Good added successfully");
    } catch (error) {
      console.error("Error adding good!", error);
      toast.error("Failed to add good");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (good) => {
    setEditingGood(good);
    setEditId(good.productID);
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "productImage" && files?.length) {
      const file = files[0];
      setEditingGood((prevGood) => ({
        ...prevGood,
        [name]: file,
        fileName: file.name,
        previewUrl: URL.createObjectURL(file),
      }));
    } else {
      setEditingGood((prevGood) => ({
        ...prevGood,
        [name]: value,
      }));
    }
  };

  const handleUpdateGood = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSubmitting(true);
    try {
      const productData = {
        productName: editingGood.productName,
        price: editingGood.price,
        stock: editingGood.stock,
        description: editingGood.description,
      };
      await axios.put(`https://localhost:7162/api/good/${editId}`, productData);

      if (editingGood.productImage instanceof File) {
        const formData = new FormData();
        formData.append("productImage", editingGood.productImage);
        await axios.put(
          `https://localhost:7162/api/good/${editId}/image`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      setShowEditModal(false);
      setEditingGood(null);
      setEditId(null);
      await fetchMoreData();
      toast.success("Good updated successfully");
    } catch (error) {
      console.error("Error updating good!", error);
      toast.error("Failed to update good");
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  //Package
  const openPackagingModal = (productId) => {
    setSelectedProductId(productId);
    setShowPackagingModal(true);
  };

  const handlePackagingAdded = () => {
    // Refresh the goods data after adding packaging
    fetchMoreData();
  };

  // Search and Sorting
  const filterAndSortGoods = () => {
    let filteredGoods = [...goods];

    // Apply search filter
    if (searchQuery) {
      filteredGoods = filteredGoods.filter((good) =>
        good.productName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sort order
    filteredGoods.sort((a, b) => {
      const factor = sortOrder === "asc" ? 1 : -1;
      if (sortBy === "productID") return factor * (a.productID - b.productID);
      if (sortBy === "price") return factor * (a.price - b.price);
      if (sortBy === "stock") return factor * (a.stock - b.stock);
      if (sortBy === "productName")
        return factor * a.productName.localeCompare(b.productName);
      return 0;
    });

    return filteredGoods;
  };

  const handleSort = (column) => {
    const isAsc = sortBy === column && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortBy(column);
  };

  const filteredGoods = filterAndSortGoods();

  // Pagination
  const indexOfLastGood = currentPage * goodsPerPage;
  const indexOfFirstGood = indexOfLastGood - goodsPerPage;
  const currentGoods = filteredGoods.slice(indexOfFirstGood, indexOfLastGood);

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredGoods.length / goodsPerPage); i++) {
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

  return (
    <>
      <div className="InventoryContainer">
        <div className="InventoryFlexContainer">
          <input
            type="text"
            className="InventorySearch"
            placeholder="Search goods..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <button
            className="AddGoods"
            onClick={handleAddGoodsClick}
            disabled={isLoading}
          >
            Add Good
          </button>
        </div>

        <table className="InventoryTable">
          <thead>
            <tr>
              <th onClick={() => handleSort("productID")}>
                ID{" "}
                {sortBy === "productID" &&
                  (sortOrder === "asc" ? (
                    <FontAwesomeIcon icon={faSortUp} />
                  ) : (
                    <FontAwesomeIcon icon={faSortDown} />
                  ))}
              </th>
              <th>Image</th>
              <th onClick={() => handleSort("productName")}>
                Name{" "}
                {sortBy === "productName" &&
                  (sortOrder === "asc" ? (
                    <FontAwesomeIcon icon={faSortUp} />
                  ) : (
                    <FontAwesomeIcon icon={faSortDown} />
                  ))}
              </th>
              <th onClick={() => handleSort("price")}>
                Price{" "}
                {sortBy === "price" &&
                  (sortOrder === "asc" ? (
                    <FontAwesomeIcon icon={faSortUp} />
                  ) : (
                    <FontAwesomeIcon icon={faSortDown} />
                  ))}
              </th>
              <th onClick={() => handleSort("stock")}>
                Stock{" "}
                {sortBy === "stock" &&
                  (sortOrder === "asc" ? (
                    <FontAwesomeIcon icon={faSortUp} />
                  ) : (
                    <FontAwesomeIcon icon={faSortDown} />
                  ))}
              </th>
              <th>Packaging</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentGoods.map((good) => (
              <tr key={good.productID}>
                <td data-label="ID">{good.productID}</td>
                <td data-label="Image">
                  <img
                    src={good.productImageUrl}
                    alt={good.productName}
                    className="table-image"
                  />
                </td>
                <td data-label="Name">{good.productName}</td>
                <td data-label="Price">{good.price.toFixed(2)}</td>
                <td data-label="Stock">{good.stock}</td>
                <td data-label="Status">
                  <span
                    className={
                      good.stock > 0
                        ? "status-available"
                        : "status-not-available"
                    }
                  >
                    {good.stock > 0 ? "Available" : "Not Available"}
                  </span>
                </td>
                <td data-label="Packaging">
                  <button onClick={() => openPackagingModal(good.productID)}>
                    Manage Packaging
                  </button>
                </td>
                <td data-label="Actions">
                  <FontAwesomeIcon
                    icon={faEdit}
                    className="action-icon"
                    onClick={() => handleEdit(good)}
                    disabled={isLoading}
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="action-icon"
                    onClick={() => {
                      setDeleteId(good.productID);
                      setModalIsOpen(true);
                    }}
                    disabled={isLoading}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {renderPagination()}
      </div>

      {/* Modals */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Confirm Status Change"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h2>Confirm Transaction</h2>
        <p>Are you sure you want to delete?</p>
        <div className="button-group">
          <button
            className="confirm-button"
            onClick={() => deleteGood(deleteId)}
          >
            Yes, Delete
          </button>
          <button
            className="cancel-button"
            onClick={() => setModalIsOpen(false)}
          >
            Cancel
          </button>
        </div>
      </Modal>

      <AddGoodModal
        isOpen={showAddModal}
        onRequestClose={() => setShowAddModal(false)}
        handleSubmit={handleAddGoodSubmit}
        handleChange={handleAddGoodChange}
        handleImageChange={handleAddGoodChange}
        isSubmitting={isSubmitting}
        productName={newGood.productName}
        price={newGood.price}
        stock={newGood.stock}
        description={newGood.description}
        fileName={newGood.fileName}
        isLoading={isLoading}
      />
      <EditGoodModal
        isOpen={showEditModal}
        onRequestClose={() => {
          setShowEditModal(false);
          setEditingGood(null);
          setEditId(null);
        }}
        handleUpdate={handleUpdateGood}
        handleChange={handleEditChange}
        isSubmitting={isSubmitting}
        productName={editingGood?.productName || ""}
        price={editingGood?.price || ""}
        stock={editingGood?.stock || ""}
        description={editingGood?.description || ""}
        fileName={editingGood?.fileName || ""}
        previewUrl={editingGood?.previewUrl || editingGood?.productImageUrl}
        isLoading={isLoading}
      />
      <PackagingModal
        isOpen={showPackagingModal}
        onRequestClose={() => setShowPackagingModal(false)}
        productId={selectedProductId}
        onPackagingAdded={handlePackagingAdded}
      />
    </>
  );
};

export default Inventory;
