import React, { Component } from 'react';
import Madgoodieslogo from "./Images/madgoodies.png";
import './Component Styles/Home.css' // Import the CSS file

export class Home extends Component {
  static displayName = Home.name;

  render() {
    return (
      <div className='LoginMainContainer'>
        <img src={Madgoodieslogo} alt="Logo" className="login-logo" />
        <form className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" required />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    );
  }
}
