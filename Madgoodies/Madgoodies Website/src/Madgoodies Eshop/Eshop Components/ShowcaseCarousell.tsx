import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import ShowcaseCard from "./ShowcaseCard";
import "../Eshop Component Styles/Showcase.css";
import axios from 'axios';

interface Good {
  productID: number;
  description: string;
  productName: string;
  price: number;
  productImageUrl: string;
  stock: number;
}

const ShowcaseCarousel: React.FC = () => {
  const [goods, setGoods] = useState<Good[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchGoods = async () => {
      try {
        const response = await axios.get('https://localhost:7162/api/good/all');
        console.log('Fetched goods:', response.data);
        setGoods(response.data);
      } catch (error) {
        console.error('Error fetching goods:', error);
      }
    };

    fetchGoods();
  }, []);

  const incrementIndex = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % goods.length);
  };

  const decrementIndex = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + goods.length) % goods.length);
  };

  const visibleItems = goods.length >= 3 ? [
    goods[(currentIndex - 1 + goods.length) % goods.length],
    goods[currentIndex],
    goods[(currentIndex + 1) % goods.length],
  ] : goods;

  return (
    <div className="showcase-carousel-container">
      {goods.length > 0 && (
        <>
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
                  image={item.productImageUrl}
                  title={item.productName}
                  price={item.price}
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
        </>
      )}
      <div className="carousel-indicators">
        {goods.map((_, index) => (
          <span
            key={index}
            className={`indicator ${
              index === currentIndex ? "active" : ""
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default ShowcaseCarousel;
