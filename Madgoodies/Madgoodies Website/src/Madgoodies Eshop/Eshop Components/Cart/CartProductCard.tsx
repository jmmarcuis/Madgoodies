import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import '../../Eshop Component Styles/CartProductCard.css';

interface CardProductCardProps {
    image: string;
    title: string;
    description: string;
    price: number;
    productID: number;
}

const CardProductCard: React.FC<CardProductCardProps> = ({ image, title, price, productID }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/good/${productID}`}>
        <div className="product-card-img-container">
          <img src={image} alt={title} className="product-image" />
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className="product-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.button
                  className="product-button"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  Shop
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Link>
      <h3 className="product-title">{title}</h3>
      <p className="product-price">₱{price.toFixed(2)}</p>
    </motion.div>
  );
};

export default CardProductCard;
