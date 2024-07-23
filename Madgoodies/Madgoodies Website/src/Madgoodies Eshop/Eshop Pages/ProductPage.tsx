import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import CardProductCard from "../Eshop Components/Cart/CartProductCard";
import Marquee from "../Eshop Components/Marquee";
import "../Eshop Component Styles/CartPage.css";
import Ship from "../../assets/ship.webp";
import Cookie from "../../assets/cookie.svg";
import Cardboard from "../../assets/cardboard.svg";
import Smile from "../../assets/smile.svg";
import { Helmet } from "react-helmet";
import logo from "../../assets/madgoodies.png";

interface Good {
  productID: number;
  productName: string;
  price: number;
  productImageUrl: string;
  stock: number;
  description: string;
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const ProductPage: React.FC = () => {
  const [goods, setGoods] = useState<Good[]>([]);

  useEffect(() => {
    const fetchGoods = async () => {
      try {
        const response = await axios.get("https://localhost:7162/api/good/all");
        console.log("Fetched goods:", response.data);
        setGoods(response.data);
      } catch (error) {
        console.error("Error fetching goods:", error);
      }
    };

    fetchGoods();
  }, []);

  return (
    <>
      <Helmet>
        <title>Madgoodies - Products</title>
        <link rel="icon" href={logo} type="image/x-icon" />
      </Helmet>
      <Marquee />
      <div className="Cart-grid-text-container">
        <h1>PRODUCTS</h1>
      </div>

      <div className="Cart-Grid-Container">
        {goods.map((item, index) => (
          <motion.div
            key={item.productID}
            className="showcase-carousel-item"
            initial={{ x: "-100vw" }}
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 50, delay: index * 0.2 }}
            exit={{ x: -300, opacity: 0 }}
          >
            <CardProductCard
              image={item.productImageUrl}
              title={item.productName}
              description={item.description}
              price={item.price}
              productID={item.productID}
            />
          </motion.div>
        ))}
      </div>

      <Marquee />

      <motion.section
        className="delivery-section"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="delivery-section-image-container">
          <img
            src={Ship}
            alt="Treats that ship"
            className="how-it-works-image"
          />
        </div>
        <div className="how-it-works-content">
          <h2>Treats that ship? Yep! Here's how it works.</h2>
          <div className="step">
            <img src={Cookie} alt="Choose your treats" className="step-icon" />
            <p>
              <strong>Choose your treats</strong>
              <br />
              For gifting, for sharing, or keeping all to yourself!
            </p>
          </div>
          <div className="step">
            <img
              src={Cardboard}
              alt="Schedule your delivery"
              className="step-icon"
            />
            <p>
              <strong>Schedule your delivery</strong>
              <br />
              Whether you're a planner or a last-minute gifter, you can schedule
              your delivery to ship 7 days a week, up to 30 days in advance.
            </p>
          </div>
          <div className="step">
            <img src={Smile} alt="Get Excited" className="step-icon" />
            <p>
              <strong>Get Excited</strong>
              <br />
              Sit back & relax while we cold-pack and ship your treats to arrive
              just when you want them. We'll notify you every step of the way.
            </p>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="delivery-section"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="how-it-works-content">
          <h2>About Our Products</h2>
          <div className="how-it-works-text-container">
            <h3>Got questions about our products?</h3>
            <h3>We got answers</h3>

            <motion.div className="cart-faq-item" variants={itemVariants}>
              <input type="checkbox" id="faq-6" />
              <label htmlFor="faq-6">
                What is the texture of your cookies?
              </label>
              <div className="faq-content">
                Sit back & relax while we cold-pack and ship your treats to
                arrive just when you want them. We'll notify you every step of
                the way.
              </div>
            </motion.div>

            <motion.div className="cart-faq-item" variants={itemVariants}>
              <input type="checkbox" id="faq-7" />
              <label htmlFor="faq-7">What if I don't like chewy cookies?</label>
              <div className="faq-content">
                Sit back & relax while we cold-pack and ship your treats to
                arrive just when you want them. We'll notify you every step of
                the way.
              </div>
            </motion.div>

            <motion.div className="cart-faq-item" variants={itemVariants}>
              <input type="checkbox" id="faq-8" />
              <label htmlFor="faq-8">Are your goodies freshly baked?</label>
              <div className="faq-content">{/* Add content here */}</div>
            </motion.div>
            <motion.div className="cart-faq-item" variants={itemVariants}>
              <input type="checkbox" id="faq-9" />
              <label htmlFor="faq-9">How long can I store my goodies?</label>
              <div className="faq-content">{/* Add content here */}</div>
            </motion.div>
            <motion.div className="cart-faq-item" variants={itemVariants}>
              <input type="checkbox" id="faq-10" />
              <label htmlFor="faq-10">
                What are the sizes of your cookies?
              </label>
              <div className="cart-faq-content">{/* Add content here */}</div>
            </motion.div>
          </div>
        </div>
        <div className="delivery-section-image-container">
          <img
            src={Ship}
            alt="Treats that ship"
            className="how-it-works-image"
          />
        </div>
      </motion.section>

      <Marquee />
    </>
  );
};

export default ProductPage;
