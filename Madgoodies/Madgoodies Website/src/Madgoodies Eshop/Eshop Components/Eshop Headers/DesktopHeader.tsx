import React, { useState } from "react";
import logo from "../../../assets/madgoodies.png";
import "../../Eshop Component Styles/DesktopHeader.css";
import InstagramIcon from "../Icons/InstagramIcon";
import FacebookIcon from "../Icons/FacebookIcon";
import MailIcon from "../Icons/MailIcon";
import gatogif from "../../../assets/jumping-gatito.gif";
import { NavLink, Link } from "react-router-dom";

const socialMediaLinks = {
  instagram: "https://www.instagram.com/your_instagram_handle",
  facebook: "https://www.facebook.com/your_facebook_page",
  mail: "mailto:youremail@example.com",
  github: "https://github.com/jmmarcuis",
};

interface NavItem {
  to: string;
  label: string;
}
interface DesktopHeaderProps {
  navItems: NavItem[];
}

const DesktopHeader: React.FC<DesktopHeaderProps> = ({ navItems }) => {
 
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <header className="desktop-header">
        <Link to="/" className="logo-link">
          <img className="desktop-header-img" src={logo} alt="logo" />{" "}
        </Link>
          <button className="desktop-button">ORDER ONLINE</button>
        <nav className={`desktop-nav ${isMenuOpen ? "open" : ""}`}>
          <NavLink to="/hoursandlocation" onClick={toggleMenu}>
            HOURS AND LOCATION{" "}
          </NavLink>
          <NavLink to="/about" onClick={toggleMenu}>
            ABOUT
          </NavLink>
          <NavLink to="/contact" onClick={toggleMenu}>
            FAQS
          </NavLink>
          <NavLink to="/contact" onClick={toggleMenu}>
            CONTACT
          </NavLink>
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
          <span onClick={() => (window.location.href = socialMediaLinks.github)}>made with 1200mg of caffeine by me</span>
        </div>
      </header>
    </>
  );
};

export default DesktopHeader;
