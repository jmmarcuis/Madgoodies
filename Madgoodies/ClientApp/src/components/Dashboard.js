import React, { Component } from "react";
import "./Component Styles/Dashboard.css"; // Import the CSS file
import Madgoodieslogo from "./Images/madgoodies.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
 
export class Dashboard extends Component {
  static displayName = Dashboard.name;

  render() {
    return (
      <div className="DashboardContainer">
        <div className="SidePanel">
          <img src={Madgoodieslogo} alt="Logo" className="login-logo" />
          <ul>
            <li>Home</li>
            <li>Logout</li>
          </ul>
        </div>
        <div className="MainContent">
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
              <tbody>
                {/* Example row */}
                <tr>
                  <td>1</td>
                  <td>Example Product</td>
                  <td>This is a description</td>
                  <td>$10.00</td>
                  <td>100</td>
                  <td>
                    <button className="action-button edit-button">
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button className="action-button delete-button">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
                {/* Add more rows as needed */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
