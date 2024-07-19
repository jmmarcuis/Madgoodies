import React from 'react';
import DesktopHeader from './DesktopHeader';
import MobileHeader from './MobileHeader';

interface NavItem {
  to: string;
  label: string;
}

interface HeaderProps {
  isMobile: boolean;
}

const Header: React.FC<HeaderProps> = ({ isMobile }) => {
  const navItems: NavItem[] = [
    { to: '/', label: 'Home' },
    { to: '/order', label: 'Order Online' },
    { to: '/contact', label: 'Contact Us' },
    { to: '/cart', label: 'Cart' },
  ];

  return isMobile ? (
    <MobileHeader navItems={navItems} />
  ) : (
    <DesktopHeader navItems={navItems} />
  );
};

export default Header;
