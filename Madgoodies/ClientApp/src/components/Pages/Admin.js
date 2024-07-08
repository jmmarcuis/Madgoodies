import React, { Component } from "react";
import "../Component Styles/SuperAdmin.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

class SuperAdmin extends Component {
  static displayName = SuperAdmin.name;

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      error: null,
      users: [],
      isLoading: false,
      isLoggedIn: false,
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { username, password } = this.state;

    try {
      this.setState({ isLoading: true });
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

      // Fetch the users data
      const users = await this.fetchUsers();
      this.setState({ users, isLoading: false, isLoggedIn: true });
    } catch (error) {
      console.error("Error during login:", error);
      this.setState({ error: error.message, isLoading: false });
    }
  };

  fetchUsers = async () => {
    try {
      console.log("Fetching users...");
      const response = await fetch(
        "https://localhost:7162/api/login/getusers",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );

      console.log("Response status:", response.status);
      console.log("Response status text:", response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(
          `HTTP error ${response.status}: ${response.statusText}`
        );
      }

      const users = await response.json();
      console.log("Users fetched:", users);
      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  };

  render() {
    const { username, password, error, users, isLoading, isLoggedIn } =
      this.state;

    if (isLoggedIn) {
      return (
        <div className="SuperAdminContainer">
          <h1>Super Admin Dashboard</h1>
          {/* Add your dashboard components and functionality */}
          <div className="UsersTable">
            <h2>Users</h2>
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
                  <tr key={user.userName}>
                    <td>{user.userName}</td>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>
                      {/* Add action buttons here if needed */}
                      <button>Edit</button>
                      <button>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    return (
      <div className="SuperAdminContainer">
        <div className="LoginMainContainer">
          <form className="login-form" onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={this.handleInputChange}
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
                onChange={this.handleInputChange}
                required
              />
            </div>
            {error && <p className="error">{error}</p>}
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
        </div>

        {isLoading ? (
          <div>Loading users...</div>
        ) : error ? (
          <div className="error">Error fetching users: {error}</div>
        ) : users.length > 0 ? (
          <div className="UsersTable">
            <h2>Users</h2>
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
                  <tr key={user.userName}>
                    <td>{user.userName}</td>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>
                      {/* Add action buttons here if needed */}
                      <button>Edit</button>
                      <button>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div>No users found.</div>
        )}
      </div>
    );
  }
}

export default function (props) {
  const navigate = useNavigate();
  return <SuperAdmin {...props} navigate={navigate} />;
}
