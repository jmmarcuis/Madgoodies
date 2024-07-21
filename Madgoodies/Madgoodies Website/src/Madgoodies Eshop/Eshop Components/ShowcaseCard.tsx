import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../Eshop Component Styles/Showcase.css';

interface ShowcaseCardProps {
  image: string;
  title: string;
  description: string;
}

const ShowcaseCard: React.FC<ShowcaseCardProps> = ({ image, title, description }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <AnimatePresence>
    <motion.div
      className="showcase-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
    
    >
      <div className="showcase-card-img-container">
        <img src={image} alt={description} className="showcase-image" />
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="showcase-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.button
                className="shop-button"
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
      <h3 className="showcase-title">{title}</h3>
      <p className="showcase-description">{description}</p>
    </motion.div>
    </AnimatePresence>
  );
};

export default ShowcaseCard;