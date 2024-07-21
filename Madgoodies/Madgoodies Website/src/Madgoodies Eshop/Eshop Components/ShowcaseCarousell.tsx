import React, { useState } from "react";
import { motion } from "framer-motion";
import ShowcaseCard from "./ShowcaseCard";
import "../Eshop Component Styles/Showcase.css";
interface ShowcaseCarouselProps {
  items: { image: string; title: string; description: string }[];
}

const ShowcaseCarousel: React.FC<ShowcaseCarouselProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const incrementIndex = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const decrementIndex = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + items.length) % items.length
    );
  };

  const visibleItems = [
    items[(currentIndex - 1 + items.length) % items.length],
    items[currentIndex],
    items[(currentIndex + 1) % items.length],
  ];

  return (
    <div className="showcase-carousel-container">
      <motion.button
        initial={{ x: "-100vw" }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 50 }}
        onClick={decrementIndex}
        className="carousel-button"
      >
        ←
      </motion.button>
      <div className="showcase-carousel">
        {visibleItems.map((item, index) => (
          <motion.div
            key={index}
            className="showcase-carousel-item"
            initial={{ x: "-100vw" }}
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 50, delay: index * 0.2 }}
            exit={{ x: -300, opacity: 0 }}

          >
            <ShowcaseCard
              image={item.image}
              title={item.title}
              description={item.description}
            />
          </motion.div>
        ))}
      </div>
      <motion.button
        initial={{ x: "200vw" }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 50 }}
        onClick={incrementIndex}
        className="carousel-button"
      >
        →
      </motion.button>
      <div className="carousel-indicators">
        {items.map((_, index) => (
          <span
            key={index}
            className={`indicator ${
              index >= currentIndex && index < currentIndex + 1 ? "active" : ""
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default ShowcaseCarousel;
