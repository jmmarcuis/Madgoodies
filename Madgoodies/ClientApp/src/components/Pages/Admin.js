import React, { Component } from 'react';
import '../Component Styles/SuperAdmin.css';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

class SuperAdmin extends Component {
    static displayName = SuperAdmin.name;

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            error: null,
            users: []
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
            toast.success("Logged in successfully");

            // Fetch the users data
            const users = await this.fetchUsers();
            this.setState({ users });

            this.props.navigate('/super-admin-dashboard');
        } catch (error) {
            this.setState({ error: error.message });
        }
    };

    fetchUsers = async () => {
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
                        <button type="submit" className="login-button">Login</button>
                    </form>
                </div>

                {users.length > 0 && (
                    <div className='UsersTable'>
                        <h2>Users</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.username}</td>
                                        <td>{user.role}</td>
                                        <td>
                                            <button onClick={() => this.deleteUser(user.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    }
}

export default function (props) {
    const navigate = useNavigate();
    return <SuperAdmin {...props} navigate={navigate} />;
}