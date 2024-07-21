import "../Eshop Component Styles/Homepage.css";
import InstagramGrid from "../Eshop Components/InstagramGrid";
import ShowcaseCarousel from "../Eshop Components/ShowcaseCarousell";
import { motion} from "framer-motion";
import Marquee from "../Eshop Components/Marquee";
import cookie from "../../assets/cookie.svg";
import heart from "../../assets/heart.svg";
import money from "../../assets/money.svg";

const HomePage = () => {
  const showcaseItems = [
    {
      image: "https://via.placeholder.com/150",
      title: "Title 1",
      description: "Item 1",
    },
    {
      image: "https://via.placeholder.com/150",
      title: "Title 2",
      description: "Item 2",
    },
    {
      image: "https://via.placeholder.com/150",
      title: "Title 3",
      description: "Item 3",
    },
    {
      image: "https://via.placeholder.com/150",
      title: "Title 4",
      description: "Item 4",
    },
    {
      image: "https://via.placeholder.com/150",
      title: "Title 5",
      description: "Item 5",
    },
    {
      image: "https://via.placeholder.com/150",
      title: "Title 6",
      description: "Item 6",
    },
  ];

  const featureVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <div className="homepage-container">
        <motion.div
          className="summer-treats-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        ></motion.div>

        <div className="Homepage-product-showcase">
          <h2>Our Products</h2>
          <p>
            For more than 25 years, Magnolia Bakery has been making America’s
            favorite baked goods the old-fashioned way: from scratch, in small
            batches, and using the finest ingredients.
          </p>

          <ShowcaseCarousel items={showcaseItems} />
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
