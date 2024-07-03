import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import "../Component Styles/Inventory.css";
const Inventory = ({
  goods,
  handleEdit,
  handleDelete,
  handleAddGoodsClick,
  isLoading,
}) => {
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
      {goods.map((good) => (
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

  return (
    <div className="MainContentInventoryTable">
      <div className="MainContentButton">
      <button className="AddGoods" onClick={handleAddGoodsClick} disabled={isLoading}>Add Good</button>
      </div>
      <table>
        {renderTableHeader()}
        {renderTableBody()}
      </table>
    </div>
  );
};

export default Inventory;
