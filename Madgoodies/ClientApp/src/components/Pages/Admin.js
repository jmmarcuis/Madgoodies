import React, { Component } from 'react';
import '../Component Styles/SuperAdmin.css';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import RegisterModal from "../POS System Components/RegisterModal";

class SuperAdmin extends Component {
    static displayName = SuperAdmin.name;

    constructor(props) {
        super(props);
        this.state = {
<<<<<<< Updated upstream
            username: '',
            password: '',
            error: null,
            users: []
=======
            username: "",
            password: "",
            error: null,
            users: [],
            isLoading: false,
            isLoggedIn: false,
            isUserModalOpen: false,
            isDeleteMode: false,
            userName: "",
            firstName: "",
            lastName: "",
            password: "",
            isSubmitting: false,
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
            const response = await fetch('https://localhost:7162/api/login/superadminlogin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userName: username, password: password })
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const token = await response.text();
            localStorage.setItem('jwtToken', token);
=======
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
>>>>>>> Stashed changes
            toast.success("Logged in successfully");

            // Fetch the users data
            const users = await this.fetchUsers();
<<<<<<< Updated upstream
            this.setState({ users });

            this.props.navigate('/super-admin-dashboard');
        } catch (error) {
            this.setState({ error: error.message });
=======
            this.setState({ users, isLoading: false, isLoggedIn: true });
        } catch (error) {
            console.error("Error during login:", error);
            this.setState({ error: error.message, isLoading: false });
>>>>>>> Stashed changes
        }
    };

    fetchUsers = async () => {
<<<<<<< Updated upstream
        const response = await fetch('https://localhost:7162/api/users', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            }
        });
        const users = await response.json();
        return users;
    };

    deleteUser = async (userId) => {
        try {
            const response = await fetch(`https://localhost:7162/api/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            // Remove the deleted user from the state
            this.setState((prevState) => ({
                users: prevState.users.filter((user) => user.id !== userId)
            }));

            toast.success('User deleted successfully');
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    render() {
        const { username, password, error, users } = this.state;

        return (
            <div className='SuperAdminContainer'>
                <div className='LoginMainContainer'>
=======
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

    handleAddUser = async () => {
        this.setState({ isSubmitting: true });

        try {
            const { userName, firstName, lastName, password } = this.state;
            const response = await fetch("https://localhost:7162/api/login/addusers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                },
                body: JSON.stringify({ userName, firstName, lastName, password }),
            });

            if (!response.ok) {
                throw new Error("Failed to add user");
            }

            const newUser = await response.json();
            this.setState((prevState) => ({
                users: [...prevState.users, newUser],
                userName: "",
                firstName: "",
                lastName: "",
                password: "",
            }));
            toast.success("User added successfully");
        } catch (error) {
            console.error("Error adding user:", error);
            toast.error(error.message);
        } finally {
            this.setState({ isSubmitting: false, isUserModalOpen: false });
        }
    };

    handleDeleteUser = async (userId) => {
        this.setState({ isSubmitting: true });

        try {
            const response = await fetch(`https://localhost:7162/api/users/${userId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete user");
            }

            this.setState((prevState) => ({
                users: prevState.users.filter((user) => user.id !== userId),
            }));
            toast.success("User deleted successfully");
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error(error.message);
        } finally {
            this.setState({ isSubmitting: false, isUserModalOpen: false });
        }
    };

    toggleUserModal = (isDeleteMode = false) => {
        this.setState((prevState) => ({
            isUserModalOpen: !prevState.isUserModalOpen,
            isDeleteMode,
            userName: "",
            firstName: "",
            lastName: "",
            password: "",
        }));
    };

    render() {
        const {
            username,
            password,
            error,
            users,
            isLoading,
            isLoggedIn,
            isUserModalOpen,
            isDeleteMode,
            userName,
            firstName,
            lastName,
            password: userPassword,
            isSubmitting,
        } = this.state;

        if (isLoggedIn) {
            return (
                <div className="SuperAdminContainer">
                    <h1>Super Admin Dashboard</h1>
                    <button onClick={() => this.toggleUserModal()}>Add User</button>
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
                                            <button onClick={() => this.toggleUserModal(true)}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <RegisterModal
                        isOpen={isUserModalOpen}
                        onRequestClose={this.toggleUserModal}
                        handleAddUser={this.handleAddUser}
                        handleDeleteUser={() => this.handleDeleteUser(userName)}
                        isSubmitting={isSubmitting}
                        userName={userName}
                        firstName={firstName}
                        lastName={lastName}
                        password={userPassword}
                        handleChange={this.handleInputChange}
                        isDeleteMode={isDeleteMode}
                    />
                </div>
            );
        }

        return (
            <div className="SuperAdminContainer">
                <div className="LoginMainContainer">
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
                        <button type="submit" className="login-button">Login</button>
                    </form>
                </div>

                {users.length > 0 && (
                    <div className='UsersTable'>
=======
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
>>>>>>> Stashed changes
                        <h2>Users</h2>
                        <table>
                            <thead>
                                <tr>
<<<<<<< Updated upstream
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th>Role</th>
=======
                                    <th>Username</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
>>>>>>> Stashed changes
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
<<<<<<< Updated upstream
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.username}</td>
                                        <td>{user.role}</td>
                                        <td>
                                            <button onClick={() => this.deleteUser(user.id)}>Delete</button>
=======
                                    <tr key={user.userName}>
                                        <td>{user.userName}</td>
                                        <td>{user.firstName}</td>
                                        <td>{user.lastName}</td>
                                        <td>
                                            <button onClick={() => this.toggleUserModal(true)}>
                                                Delete
                                            </button>
>>>>>>> Stashed changes
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
<<<<<<< Updated upstream
=======
                ) : (
                    <div>No users found.</div>
>>>>>>> Stashed changes
                )}
            </div>
        );
    }
}

export default function (props) {
    const navigate = useNavigate();
    return <SuperAdmin {...props} navigate={navigate} />;
}