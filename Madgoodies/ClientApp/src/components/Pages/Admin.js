import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-modal";
import { HubConnectionBuilder } from "@microsoft/signalr";
import {
  faTrash,
  faEdit,
  faSortUp,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";
import "../Component Styles/SuperAdmin.css";
import "react-toastify/dist/ReactToastify.css";

const SuperAdmin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [hubConnection, setHubConnection] = useState(null);

  const [newUser, setNewUser] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    password: "",
  });

  useEffect(() => {
    const newHubConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:7162/FetchHub")
      .build();

    setHubConnection(newHubConnection);

    newHubConnection
      .start()
      .then(() => {
        console.log("SignalR Connected");
      })
      .catch((err) => {
        console.error("SignalR Connection Error: ", err);
        toast.error("Failed to connect to SignalR");
      });

    newHubConnection.on("ReceiveMessage", (message) => {
      console.log("Received message from SignalR:", message);
      fetchUsers();
    });

    return () => {
      newHubConnection.stop();
    };
  }, []);

  const handleLoginInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "username") setUsername(value);
    if (name === "password") setPassword(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      const response = await fetch(
        "https://localhost:7162/api/login/superadminlogin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userName: username, password: password }),
        }
      );

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const token = await response.text();
      localStorage.setItem("jwtToken", token);
      toast.success("Logged in successfully");

      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers);
      setIsLoading(false);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Error during login:", error);
      setError(error.message);
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "https://localhost:7162/api/login/getusers",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `HTTP error ${response.status}: ${response.statusText}`
        );
      }

      const users = await response.json();
      console.log(users);
      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  };

  const openModal = (type, user = null) => {
    if (type === "delete") {
      console.log(user);
      setSelectedUser(user);
      setDeleteModalIsOpen(true);
    } else {
      setModalType(type);
      setSelectedUser(user);
      setModalIsOpen(true);
      if (type === "add") {
        setNewUser({
          userName: "",
          firstName: "",
          lastName: "",
          password: "",
        });
      } else if (type === "edit" && user) {
        setNewUser({
          userName: user.userName,
          firstName: user.firstName,
          lastName: user.lastName,
          password: "",
        });
      }
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalType("");
    setSelectedUser(null);
  };

  const handleUserInputChange = (event) => {
    const { name, value } = event.target;
    setNewUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleAddUser = async () => {
    try {
      const response = await fetch("https://localhost:7162/api/login/adduser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error("Failed to add user");
      }

      toast.success("User added successfully");
      closeModal();
      const updatedUsers = await fetchUsers();
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Failed to add user");
    }
  };

  const handleUpdateUser = async () => {
    try {
      const response = await fetch(
        `https://localhost:7162/api/login/updateuser/${selectedUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
          body: JSON.stringify(newUser),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      toast.success("User updated successfully");
      closeModal();
      const updatedUsers = await fetchUsers();
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    }
  };

  const handleDeleteUser = async (id) => {
    if (
      !selectedUser ||
      typeof selectedUser.id !== "number" ||
      isNaN(selectedUser.id)
    ) {
      console.error("Invalid user selected for deletion:", error);
      toast.error("Failed to delete user: Invalid user ID");
      return;
    }

    try {
      console.log(`Attempting to delete user with ID: ${id}`);
      const response = await fetch(
        `https://localhost:7162/api/login/deleteuser/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to delete user: ${response.statusText}. Server response: ${errorText}`
        );
      }

      toast.success("User deleted successfully");
      setDeleteModalIsOpen(false);
      const updatedUsers = await fetchUsers();
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(`Failed to delete user: ${error.message}`);
    }
  };
  const DeleteModal = ({ isOpen, onClose, onDelete, user }) => {
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        contentLabel="Delete User Modal"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h2>Delete User</h2>
        <p>Are you sure you want to delete user {user?.userName}?</p>
        <button className="confirm-button" onClick={onDelete}>
          Yes, Delete
        </button>
        <button className="cancel-button" onClick={onClose}>
          Cancel
        </button>
      </Modal>
    );
  };

  if (isLoggedIn) {
    return (
      <div className="SuperAdminContainer">
        <div className="SuperAdminFlexContainer">
          <input
            type="text"
            className="UserSearch"
            placeholder="Search users..."
          />
          <button className="AddUser" onClick={() => openModal("add")}>
            Add User
          </button>
        </div>
        <div className="UsersTable">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.userName}</td>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>
                    <FontAwesomeIcon
                      icon={faEdit}
                      className="action-icon"
                      onClick={() => openModal("edit", user)}
                    />
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="action-icon"
                      onClick={() => openModal("delete", user)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="User Modal"
          className="modal-content"
          overlayClassName="modal-overlay"
        >
          <h2>{modalType === "add" ? "Add User" : "Edit User"}</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              name="userName"
              value={newUser.userName}
              onChange={handleUserInputChange}
              placeholder="Username"
              required
            />
            <input
              type="text"
              name="firstName"
              value={newUser.firstName}
              onChange={handleUserInputChange}
              placeholder="First Name"
              required
            />
            <input
              type="text"
              name="lastName"
              value={newUser.lastName}
              onChange={handleUserInputChange}
              placeholder="Last Name"
              required
            />
            <input
              type="password"
              name="password"
              value={newUser.password}
              onChange={handleUserInputChange}
              placeholder="Password"
              required
            />
            <button
              className="confirm-button"
              onClick={modalType === "add" ? handleAddUser : handleUpdateUser}
            >
              {modalType === "add" ? "Add" : "Update"}
            </button>
          </form>
          <button className="cancel-button" onClick={closeModal}>
            Cancel
          </button>
        </Modal>

        <DeleteModal
          isOpen={deleteModalIsOpen}
          onClose={() => setDeleteModalIsOpen(false)}
          onDelete={handleDeleteUser}
          user={selectedUser}
        />
      </div>
    );
  }

  return (
    <div className="SuperAdminContainer">
      <div className="LoginMainContainer">
        <div className="UsersTable">
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={handleLoginInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handleLoginInputChange}
                required
              />
            </div>
            {error && <p className="error">{error}</p>}
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SuperAdmin;
