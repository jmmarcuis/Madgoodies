import React, { useState } from "react";
import { useAuth } from "../Eshop Components/Context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import logo from "../../assets/madgoodies.png";
import "../Eshop Component Styles/AuthenticatePage.css";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://localhost:7162/api/customer/authenticate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ CustomerEmail: email, Password: password }),
        }
      );

      if (response.ok) {
        const { token } = await response.json();
        login(token);
        toast.success("Login successful!");
        const { from } = (location.state as { from: string }) || {
          from: "/checkout",
        };
        navigate(from);
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (error) {
      toast.error("Error during login. Please try again.");
    }
  };

  return (
    <>
      <Helmet>
        <title>Madgoodies - Login</title>
        <link rel="icon" href={logo} type="image/x-icon" />
      </Helmet>
      <div className="login-page-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="login-button"
            type="submit"
          >
            Login
          </motion.button>
        </form>
        <div className="signup-link">
          <p>Not logged in? <a href="/register">Sign up</a></p>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default LoginPage;
