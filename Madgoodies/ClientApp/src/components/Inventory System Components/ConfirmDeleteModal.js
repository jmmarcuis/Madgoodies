import React from "react";
import Modal from "react-modal";
import "../Component Styles/DeleteModal.css"
import"../Component Styles/Modal.css"


const ConfirmDeleteModal = ({ isOpen, onRequestClose, onConfirm  ,isLoading, }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      ariaHideApp={false}
      className="modal"
      overlayClassName="modal-overlay"
    >
      <div className="DeleteModal">
        <div className="DeleteModalFlexContainer">
          <h2>Delete Goods</h2>
          <span className="ModalCloseButton" onClick={onRequestClose}>
            &times;
          </span>
        </div>
        <p>
          Are you sure you want to delete <span>GoodName?</span>
        </p>
        <div className="DeleteModalFlex">
        <button  className="ConfirmButton" onClick={onConfirm} disabled={isLoading}>Yes, Delete</button>
        <button   className="CancelButton" onClick={onRequestClose} disabled={isLoading}>Cancel</button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDeleteModal;
