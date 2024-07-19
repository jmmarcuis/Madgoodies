import React, { useState } from 'react';
import HamburgerIcon from '../Eshop Components/Icons/HamburgerIcon';
import MobileMenu from './MobileMenu';

interface NavItem {
  to: string;
  label: string;
}

interface MobileHeaderProps {
  navItems: NavItem[];
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ navItems }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="mobile-header">
      <HamburgerIcon onClick={toggleMenu} />
      {isMenuOpen && <MobileMenu navItems={navItems} />}
    </header>
  );
};

export default MobileHeader;
