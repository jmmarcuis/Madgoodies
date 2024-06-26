import React, { Component } from "react";
import "./Component Styles/Dashboard.css"; // Import the CSS file
import Madgoodieslogo from "./Images/madgoodies.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

export class Dashboard extends Component {
    static displayName = Dashboard.name;

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            productName: '',
            price: '',
            stock: '',
            description: '',
   
        };
    }

    handleLogout = () => {
        localStorage.removeItem('token');
        this.props.history.push('/login');
    };

    handleAddGoodsClick = () => {
        this.setState({ showModal: true });
    };

    handleCloseModal = () => {
        this.setState({ showModal: false });
    };

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

 

    handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('ProductName', this.state.productName);
        formData.append('Price', this.state.price);
        formData.append('Stock', this.state.stock);
        formData.append('Description', this.state.description);


        try {
            const response = await axios.post('https://localhost:7162/api/good/add', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.data);
            // Handle success (e.g., clear the form, show a success message)
            this.setState({ showModal: false });
        } catch (error) {
            console.error('There was an error adding the good!', error);
            // Handle error (e.g., show an error message)
        }
    };

    render() {
        return (
            <div className="DashboardContainer">
                <div className="SidePanel">
                    <img src={Madgoodieslogo} alt="Logo" className="login-logo" />
                    <ul>
                        <li>Home</li>
                        <li onClick={this.handleLogout}>Logout</li>
                    </ul>
                </div>
                <div className="MainContent">
                    <div className="MainContentButton">
                        <button className="AddGoods" onClick={this.handleAddGoodsClick}>ADD GOODS</button>
                    </div>
                    <div className="MainContentInventoryTable">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                               
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Price</th>
                                    <th>Inventory</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                </div>

                {this.state.showModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={this.handleCloseModal}>&times;</span>
                            <form onSubmit={this.handleSubmit}>
                                <label>
                                    Product Name:
                                    <input type="text" name="productName" value={this.state.productName} onChange={this.handleChange} required />
                                </label>
                                <label>
                                    Price:
                                    <input type="number" name="price" value={this.state.price} onChange={this.handleChange} required />
                                </label>
                                <label>
                                    Stock:
                                    <input type="number" name="stock" value={this.state.stock} onChange={this.handleChange} required />
                                </label>
                                <label>
                                    Description:
                                    <textarea name="description" value={this.state.description} onChange={this.handleChange} required></textarea>
                                </label>
                      
                                <button type="submit">Add Good</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
