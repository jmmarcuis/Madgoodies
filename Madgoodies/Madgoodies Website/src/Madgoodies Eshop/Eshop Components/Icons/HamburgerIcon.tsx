import React from 'react';
import HamburgerIconSvg from "./HamburgerIcon.svg"
interface HamburgerIconProps {
  onClick: () => void;
}

const HamburgerIcon: React.FC<HamburgerIconProps> = ({ onClick }) => (
  <img src={HamburgerIconSvg} alt="Menu" onClick={onClick} style={{ cursor: 'pointer' }} />
);

export default HamburgerIcon;
