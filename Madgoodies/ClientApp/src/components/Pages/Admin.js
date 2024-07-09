import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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

const SuperAdmin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
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
      fetchUsers(); // Fetch data on receiving new message
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
      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  };
  const openModal = (type, user = null) => {
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
    setModalIsOpen(true);
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
      // Fetch updated user list
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
      // Fetch updated user list
      const updatedUsers = await fetchUsers();
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    }
  };
  const handleDelete = async () => {
    if (!selectedUser) {
        toast.error("No user selected for deletion");
        return;
    }

    try {
        const response = await fetch(
            `https://localhost:7162/api/login/deleteuser/${selectedUser.id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
        }

        toast.success("User deleted successfully");
        setUsers(users.filter(user => user.id !== selectedUser.id));
        setModalIsOpen(false);
    } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Error deleting user");
    }
};


  const handleDeleteUser = async () => {
    if (!selectedUser || !selectedUser.id) {
      console.error("No user selected for deletion");
      toast.error("Error: No user selected for deletion");
      return;
    }

    try {
      const response = await fetch(
        `https://localhost:7162/api/login/deleteuser/${selectedUser.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      toast.success("User deleted successfully");
      closeModal();
      // Fetch updated user list
      const updatedUsers = await fetchUsers();
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
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
                <th>Username</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.userName}</td>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>
                    <FontAwesomeIcon
                      icon={faEdit}
                      className="action-icon"
                      onClick={() => openModal("edit", user.id)}
                    />
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="action-icon"
                      onClick={() => openModal('delete', user.id)}
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
          <h2>
            {modalType === "add"
              ? "Add User"
              : modalType === "edit"
              ? "Edit User"
              : "Delete User"}
          </h2>
          {modalType !== "delete" ? (
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
          ) : (
            <div>
              <p>Are you sure you want to delete this user?</p>
              <button className="confirm-button" onClick={handleDeleteUser}>
                Yes, Delete
              </button>
            </div>
          )}

          <button className="cancel-button" onClick={closeModal}>
            Cancel
          </button>
        </Modal>

        
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
