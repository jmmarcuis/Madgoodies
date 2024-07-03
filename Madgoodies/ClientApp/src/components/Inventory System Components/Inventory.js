import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import "../Component Styles/Inventory.css";
import AddGoodModal from "./AddGoodModal";
import EditGoodModal from "./EditGoodModal";

const Inventory = ({
  goods,
  handleEdit,
  handleDelete,
  handleAddGoodsClick,
  isLoading,
  showAddModal,
  showEditModal,
  handleCloseAddModal,
  handleCloseEditModal,
  handleSubmit,
  handleUpdate,
  handleChange,
  handleImageChange,
  isSubmitting,
  productName,
  price,
  stock,
  description,
  fileName,
  searchQuery,
  handleSearchChange,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const goodsPerPage = 10;

  // Calculate the current goods to display based on pagination
  const indexOfLastGood = currentPage * goodsPerPage;
  const indexOfFirstGood = indexOfLastGood - goodsPerPage;
  const currentGoods = goods.slice(indexOfFirstGood, indexOfLastGood);

  const renderTableHeader = () => (
    <thead>
      <tr>
        <th>ID</th>
        <th>Image</th>
        <th>Name</th>
        <th>Price</th>
        <th>Stock</th>
        <th>Description</th>
        <th>Actions</th>
      </tr>
    </thead>
  );

  const renderTableBody = () => (
    <tbody>
      {currentGoods.map((good) => (
        <tr key={good.productID}>
          <td>{good.productID}</td>
          <td>
            <img
              src={good.productImageUrl}
              alt={good.productName}
              className="table-image"
            />
          </td>
          <td>{good.productName}</td>
          <td>{good.price.toFixed(2)}</td>
          <td>{good.stock}</td>
          <td>{good.description}</td>
          <td>
            <FontAwesomeIcon
              icon={faEdit}
              className="action-icon"
              onClick={() => handleEdit(good.productID)}
              disabled={isLoading}
            />
            <FontAwesomeIcon
              icon={faTrash}
              className="action-icon"
              onClick={() => handleDelete(good.productID)}
              disabled={isLoading}
            />
          </td>
        </tr>
      ))}
    </tbody>
  );

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(goods.length / goodsPerPage); i++) {
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
    <div className="MainContentInventoryTable">
      <div className="InventoryFlexContainer">
        <input
          type="text"
          className="InventorySearch"
          placeholder="Search goods..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button
          className="AddGoods"
          onClick={handleAddGoodsClick}
          disabled={isLoading}
        >
          Add Good
        </button>
      </div>
      <div className="TableWrapper">
        <table className="InventoryTable">
          {renderTableHeader()}
          {renderTableBody()}
        </table>
        {renderPagination()}
      </div>

      <AddGoodModal
        isOpen={showAddModal}
        onRequestClose={handleCloseAddModal}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        handleImageChange={handleImageChange}
        isSubmitting={isSubmitting}
        productName={productName}
        price={price}
        stock={stock}
        description={description}
        fileName={fileName}s
        isLoading={isLoading}
      />

      <EditGoodModal
        isOpen={showEditModal}
        onRequestClose={handleCloseEditModal}
        handleUpdate={handleUpdate}
        handleChange={handleChange}
        handleImageChange={handleImageChange}
        isSubmitting={isSubmitting}
        productName={productName}
        price={price}
        stock={stock}
        description={description}
        fileName={fileName}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Inventory;
