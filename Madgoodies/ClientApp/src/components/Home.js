import React, { Component } from 'react';
import Madgoodieslogo from "./Images/madgoodies.png";
import './Component Styles/Home.css';
import { useNavigate } from 'react-router-dom';

class Home extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            error: null
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
            const response = await fetch('https://localhost:7162/api/login/login', {
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
            this.props.navigate('/dashboard');
        } catch (error) {
            this.setState({ error: error.message });
        }
    };

    render() {
        const { username, password, error } = this.state;

        return (
            <div className='LoginMainContainer'>
                <img src={Madgoodieslogo} alt="Logo" className="login-logo" />
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
        );
    }
}

export default function (props) {
    const navigate = useNavigate();
    return <Home {...props} navigate={navigate} />;
}
