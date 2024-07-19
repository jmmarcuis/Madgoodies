import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import "../Eshop Component Styles/ContactUsPage.css";

const ContactUsPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    orderNumber: "",
    helpType: "",
    productConcern: "",
    deliveryIssue: "",
    productIssue: "",
    message: "",
  });
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (captchaValue) {
      // Handle form submission here
      console.log("Form submitted", { ...formData, file });
    } else {
      alert("Please complete the reCAPTCHA");
    }
  };

  return (
    <div className="Contact-flex-container">
      <div className="Contact-faq-container">
        <div className="Contact-faq-wrapper">
          <h1>Frequently Asked Questions</h1>

          <h2>Nationwide Shipping</h2>

          <div className="faq-item">
            <input type="checkbox" id="faq-1" />
            <label htmlFor="faq-1">Shipping and Returns</label>
            <div className="faq-content">{/* Add content here */}</div>
          </div>

          <div className="faq-item">
            <input type="checkbox" id="faq-2" />
            <label htmlFor="faq-2">COVID-19 Shipping and Delay Updates</label>
            <div className="faq-content">{/* Add content here */}</div>
          </div>

          <h2>Orders</h2>

          <div className="faq-item">
            <input type="checkbox" id="faq-3" />
            <label htmlFor="faq-3">
              Scheduling Delivery Date & Delivery Window
            </label>
            <div className="faq-content">{/* Add content here */}</div>
          </div>

          <div className="faq-item">
            <input type="checkbox" id="faq-4" />
            <label htmlFor="faq-4">Bakery Pickup Orders</label>
            <div className="faq-content">{/* Add content here */}</div>
          </div>

          <div className="faq-item">
            <input type="checkbox" id="faq-5" />
            <label htmlFor="faq-5">Order Delays</label>
            <div className="faq-content">{/* Add content here */}</div>
          </div>

          <h2>About Our Products</h2>

          <div className="faq-item">
            <input type="checkbox" id="faq-6" />
            <label htmlFor="faq-6">What is the texture of your cookies? </label>
            <div className="faq-content">{/* Add content here */}</div>
          </div>

          <div className="faq-item">
            <input type="checkbox" id="faq-7" />
            <label htmlFor="faq-7">What if i dont like chewy cookies?</label>
            <div className="faq-content">{/* Add content here */}</div>
          </div>

          <div className="faq-item">
            <input type="checkbox" id="faq-8" />
            <label htmlFor="faq-8">Are your goodies freshly baked?</label>
            <div className="faq-content">{/* Add content here */}</div>
          </div>
          <div className="faq-item">
            <input type="checkbox" id="faq-9" />
            <label htmlFor="faq-9">How long can I store my goodies</label>
            <div className="faq-content">{/* Add content here */}</div>
          </div>
          <div className="faq-item">
            <input type="checkbox" id="faq-10" />
            <label htmlFor="faq-10">What are the sizes of your cookies?</label>
            <div className="faq-content">{/* Add content here */}</div>
          </div>
        </div>
      </div>
      <div className="Contact-form-container">
        <div className="Contact-form-wrapper">
          <h1>Didn't find the answers you were looking for?</h1>
          <form onSubmit={handleSubmit} className="contact-form">
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
                {/* Add options here */}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">MESSAGE</label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="form-group">
              <label>
                PLEASE UPLOAD PICTURES OF THE ISSUE (AND THE RECEIPT IF
                POSSIBLE).
              </label>
              <input type="file" id="fileUpload" onChange={handleFileChange} />
            </div>

            <ReCAPTCHA
              sitekey="YOUR_RECAPTCHA_SITE_KEY"
              onChange={(value) => setCaptchaValue(value)}
            />
            <button className="submit-contact-button" type="submit">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
