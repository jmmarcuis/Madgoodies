import React, { useCallback } from "react";
import Modal from "react-modal";
import { useDropzone } from "react-dropzone";
import "../Component Styles/ModifyGoodModal.css";
import "../Component Styles/Modal.css";

const EditGoodModal = ({
  isOpen,
  onRequestClose,
  handleUpdate,
  handleChange,
  handleImageChange,
  isSubmitting,
  productName,
  price,
  stock,
  description,
  fileName,
  isLoading,
}) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      handleImageChange({
        target: {
          files: acceptedFiles,
        },
      });
    },
    [handleImageChange]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const onSubmit = (e) => {
    e.preventDefault();
    handleUpdate(e);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Edit Good"
      ariaHideApp={false}
      className="modal"
      overlayClassName="modal-overlay"
    >
      <div className="modal-content">
        <div className="ModifyGoodsModalHeaderFlex">
          <h2>Edit Good</h2>
          <span className="ModalCloseButton" onClick={onRequestClose}>
            &times;
          </span>
        </div>
        <form onSubmit={onSubmit}>
          <label>
            Product Name:
            <input
              type="text"
              name="productName"
              value={productName}
              onChange={handleChange}
              required
            />
          </label>
          <div className="ModifyGoodsModalInputFlex">
            <label>
              Price:
              <input
                type="number"
                name="price"
                value={price}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Stock:
              <input
                type="number"
                name="stock"
                value={stock}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <label>
            Description:
            <textarea
              name="description"
              value={description}
              onChange={handleChange}
              required
            ></textarea>
          </label>
          <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} name="productImage" />
            {isDragActive ? (
              <p>Drop the image here ...</p>
            ) : (
              <p>Drag 'n' drop an image here, or click to select a file</p>
            )}
            {fileName && <p>Selected file: {fileName}</p>}
          </div>
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting || isLoading}
          >
            Update Good
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default EditGoodModal;