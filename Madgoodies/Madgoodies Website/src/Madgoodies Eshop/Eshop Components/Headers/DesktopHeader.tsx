import React, { useState } from "react";
import logo from "../../../assets/madgoodies.png";
import "../../Eshop Component Styles/DesktopHeader.css";
import InstagramIcon from "../Icons/InstagramIcon";
import FacebookIcon from "../Icons/FacebookIcon";
import MailIcon from "../Icons/MailIcon";
import gatogif from "../../../assets/jumping-gatito.gif";
import { NavLink, Link } from "react-router-dom";
import { motion } from "framer-motion";

const socialMediaLinks = {
  instagram: "https://www.instagram.com/your_instagram_handle",
  facebook: "https://www.facebook.com/your_facebook_page",
  mail: "mailto:youremail@example.com",
  github: "https://github.com/jmmarcuis",
};

interface DesktopHeaderProps {
  toggleCart: () => void;
}

const DesktopHeader: React.FC<DesktopHeaderProps> = ({ toggleCart }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <header className="desktop-header">
        <Link to="/" className="logo-link">
          <img className="desktop-header-img" src={logo} alt="logo" />{" "}
        </Link>
        <Link to="/product">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="desktop-button"
          >
            ORDER ONLINE
          </motion.button>
        </Link>
        <nav className={`desktop-nav ${isMenuOpen ? "open" : ""}`}>
          <NavLink to="/" onClick={toggleMenu}>
            ABOUT
          </NavLink>
          <NavLink to="/contact" onClick={toggleMenu}>
            FAQS
          </NavLink>
          <NavLink to="/contact" onClick={toggleMenu}>
            CONTACT
          </NavLink>
          <NavLink to="/login" onClick={toggleMenu}>
            LOGIN
          </NavLink>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }} className="desktop-button" onClick={toggleCart}>
            Cart
          </motion.button>
        </nav>
        <div className="desktop-header-socials">
          <InstagramIcon
            onClick={() => (window.location.href = socialMediaLinks.instagram)}
          />
          <FacebookIcon
            onClick={() => (window.location.href = socialMediaLinks.facebook)}
          />
          <MailIcon
            onClick={() => (window.location.href = socialMediaLinks.mail)}
          />
        </div>
        <div className="desktop-header-gif">
          <img src={gatogif} alt="" />
        </div>
        <div className="desktop-header-powered-by">
          <span
            onClick={() => (window.location.href = socialMediaLinks.github)}
          >
            made with 1200mg of caffeine by me
          </span>
        </div>
      </header>
    </>
  );
};

export default DesktopHeader;
