import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Cookie from "../../assets/cookie white.svg";
const Marquee = () => {
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      const width = window.innerWidth - 180; // Subtract the width of the desktop header
      setContainerWidth(width);

      
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const marqueeVariants = {
    animate: {
      x: [0, -containerWidth],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 20,
          ease: "linear",
        },
      },
    },
  };

  return (
    <div className="marquee-container">
      <motion.div
        className="marquee-content"
        variants={marqueeVariants}
        animate="animate"
      >
        <div className="marquee-item">
          WHERE EVERY BITE FEELS JUST RIGHT <img src={Cookie} alt="" /> WHERE
          EVERY BITE FEELS JUST RIGHT <img src={Cookie} alt="" /> WHERE EVERY
          BITE FEELS JUST RIGHT <img src={Cookie} alt="" /> WHERE EVERY BITE
          FEELS JUST RIGHT <img src={Cookie} alt="" /> WHERE EVERY BITE FEELS
          JUST RIGHT <img src={Cookie} alt="" /> WHERE EVERY BITE FEELS JUST
          RIGHT <img src={Cookie} alt="" /> WHERE EVERY BITE FEELS JUST RIGHT
          <img src={Cookie} alt="" /> WHERE EVERY BITE FEELS JUST RIGHT WHERE
          EVERY BITE FEELS JUST RIGHT
          <img src={Cookie} alt="" /> WHERE EVERY BITE FEELS JUST RIGHT
        </div>
      </motion.div>
    </div>
  );
};

export default Marquee;
