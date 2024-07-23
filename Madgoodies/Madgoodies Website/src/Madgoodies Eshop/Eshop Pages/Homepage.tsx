import "../Eshop Component Styles/Homepage.css";
import InstagramGrid from "../Eshop Components/InstagramGrid";
import ShowcaseCarousel from "../Eshop Components/ShowcaseCarousell";
import { motion } from "framer-motion";
import Marquee from "../Eshop Components/Marquee";
import cookie from "../../assets/cookie.svg";
import heart from "../../assets/heart.svg";
import money from "../../assets/money.svg";
import { Helmet } from "react-helmet";
import logo from"../../assets/madgoodies.png"

const HomePage = () => {
  const featureVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <Helmet>
        <title>Madgoodies - Home</title>
        <link rel="icon" href={logo} type="image/x-icon" />
      </Helmet>
      <div className="homepage-container">
        <Marquee />

        <motion.div
          className="summer-treats-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        ></motion.div>

        <div className="Homepage-product-showcase">
          <h2>FROM OUR BAKERY TO YOUR DOORSTEP</h2>
          <p>sussy impostor.</p>

          <ShowcaseCarousel />
        </div>

        <div className="features-section">
          <h2>WHY CHOOSE US?</h2>
          <div className="features-container">
            <motion.div
              className="feature-item"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{
                type: "spring",
                stiffness: 200, // Increased stiffness for more bounciness
                damping: 20, // Adjust damping for smoothness
                delay: 0.2,
                ease: "easeOut",
              }}
              variants={featureVariants}
            >
              <img src={cookie} alt="Feature 1" />
              <h3>FRESHLY BAKED EVERYDAY</h3>
              <p>
                Our bakery prepares all items fresh daily, ensuring you always
                get the highest quality and tastiest baked goods.
              </p>
            </motion.div>
            <motion.div
              className="feature-item"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{
                type: "spring",
                stiffness: 200, // Increased stiffness for more bounciness
                damping: 20, // Adjust damping for smoothness
                delay: 0.4,
                ease: "easeOut",
              }}
              variants={featureVariants}
            >
              <img src={money} alt="Feature 2" />
              <h3>AFFORDABLE</h3>
              <p>
                We believe everyone should have access to delicious baked goods,
                which is why we offer competitive prices without compromising
                quality.
              </p>
            </motion.div>
            <motion.div
              className="feature-item"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{
                type: "spring",
                stiffness: 200, // Increased stiffness for more bounciness
                damping: 20, // Adjust damping for smoothness
                delay: 0.6,
                ease: "easeOut",
              }}
              variants={featureVariants}
            >
              <img src={heart} alt="Feature 3" />
              <h3>HOMEMADE</h3>
              <p>
                Our bakers use traditional recipes and techniques to create
                baked goods with a homemade taste and quality.
              </p>
            </motion.div>
          </div>
        </div>

        <Marquee />

        <InstagramGrid />
      </div>
    </>
  );
};

export default HomePage;
