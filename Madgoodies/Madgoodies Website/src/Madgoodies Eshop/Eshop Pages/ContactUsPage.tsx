import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import "../Eshop Component Styles/ContactUsPage.css";
import { motion } from "framer-motion";
import axios from "axios";
import { Helmet } from "react-helmet";
import logo from"../../assets/madgoodies.png"

const ContactUsPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    orderNumber: "",
    helpType: "",
    message: "",
  });

 
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
        const data = new FormData();
        data.append("FirstName", formData.firstName);
        data.append("LastName", formData.lastName);
        data.append("EmailAddress", formData.email);
        data.append("PhoneNumber", formData.phone);
        data.append("OrderNumber", formData.orderNumber);
        data.append("InquiryType", formData.helpType);
        data.append("Message", formData.message);

        const response = await axios.post(
            "https://localhost:7162/api/CustomerInquiry",
            data
        );

        console.log("Inquiry submitted successfully", response.data);
        // Reset form or show success message
    } catch (error) {
        console.error("Error submitting inquiry:", error);
        // Show error message
    }
};


 
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <>
    <Helmet>
    <title>Madgoodies - Contact & FAQ</title>
    <link rel="icon" href={logo} type="image/x-icon" />
  </Helmet>
    <motion.div
      className="Contact-flex-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="Contact-faq-container" variants={itemVariants}>
        <div className="Contact-faq-wrapper">
          <motion.h1 variants={itemVariants}>
            Frequently Asked Questions
          </motion.h1>

          <h2>Nationwide Shipping</h2>

          <motion.div className="faq-item" variants={itemVariants}>
            <input type="checkbox" id="faq-1" />
            <label htmlFor="faq-1">Shipping and Returns</label>
            <div className="faq-content">{/* Add content here */}</div>
          </motion.div>

          <motion.div className="faq-item" variants={itemVariants}>
            <input type="checkbox" id="faq-2" />
            <label htmlFor="faq-2">COVID-19 Shipping and Delay Updates</label>
            <div className="faq-content">{/* Add content here */}</div>
          </motion.div>

          <h2>Orders</h2>

          <motion.div className="faq-item" variants={itemVariants}>
            <input type="checkbox" id="faq-3" />
            <label htmlFor="faq-3">
              Scheduling Delivery Date & Delivery Window
            </label>
            <div className="faq-content">{/* Add content here */}</div>
          </motion.div>

          <motion.div className="faq-item" variants={itemVariants}>
            <input type="checkbox" id="faq-4" />
            <label htmlFor="faq-4">Bakery Pickup Orders</label>
            <div className="faq-content">{/* Add content here */}</div>
          </motion.div>

          <motion.div className="faq-item" variants={itemVariants}>
            <input type="checkbox" id="faq-5" />
            <label htmlFor="faq-5">Order Delays</label>
            <div className="faq-content">{/* Add content here */}</div>
          </motion.div>

          <h2>About Our Products</h2>

          <motion.div className="faq-item" variants={itemVariants}>
            <input type="checkbox" id="faq-6" />
            <label htmlFor="faq-6">What is the texture of your cookies? </label>
            <div className="faq-content">{/* Add content here */}</div>
          </motion.div>

          <motion.div className="faq-item" variants={itemVariants}>
            <input type="checkbox" id="faq-7" />
            <label htmlFor="faq-7">What if i dont like chewy cookies?</label>
            <div className="faq-content">{/* Add content here */}</div>
          </motion.div>

          <motion.div className="faq-item" variants={itemVariants}>
            <input type="checkbox" id="faq-8" />
            <label htmlFor="faq-8">Are your goodies freshly baked?</label>
            <div className="faq-content">{/* Add content here */}</div>
          </motion.div>
          <motion.div className="faq-item" variants={itemVariants}>
            <input type="checkbox" id="faq-9" />
            <label htmlFor="faq-9">How long can I store my goodies</label>
            <div className="faq-content">{/* Add content here */}</div>
          </motion.div>
          <motion.div className="faq-item" variants={itemVariants}>
            <input type="checkbox" id="faq-10" />
            <label htmlFor="faq-10">What are the sizes of your cookies?</label>
            <div className="faq-content">{/* Add content here */}</div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div className="Contact-form-container" variants={itemVariants}>
        <div className="Contact-form-wrapper">
          <motion.h1 variants={itemVariants}>
            Didn't find the answers you were looking for?
          </motion.h1>
          <motion.form
            onSubmit={handleSubmit}
            className="contact-form"
            variants={itemVariants}
          >
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">FIRST NAME *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">LAST NAME *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">EMAIL ADDRESS *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">PHONE NUMBER</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="orderNumber">ORDER NUMBER (IF APPLICABLE)</label>
              <input
                type="text"
                id="orderNumber"
                name="orderNumber"
                value={formData.orderNumber}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="helpType">HOW CAN WE HELP YOU? *</label>
              <select
                id="helpType"
                name="helpType"
                value={formData.helpType}
                onChange={handleChange}
                required
              >
                <option value="">Select an option</option>
                <option value="product">Product Problems</option>
                <option value="shipping">Shipping Problems</option>
               </select>
            </div>{" "}
            <div className="form-group">
              <label htmlFor="message">MESSAGE *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="file">Upload an image (optional)</label>
              <input type="file" id="file"   />
            </div>
            <div className="form-group">
              <ReCAPTCHA
                sitekey="your-site-key"
               />
            </div>
            <div className="form-group">
              <motion.button
                type="submit"
                className="submit-contact-button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                Submit
              </motion.button>
            </div>
          </motion.form>
        </div>
      </motion.div>
    </motion.div>
    </>
  );
};

export default ContactUsPage;
