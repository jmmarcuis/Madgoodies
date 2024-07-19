import React from 'react';
import FacebookIconSvg from "./FacebookIcon.svg"
interface HamburgerIconProps {
  onClick: () => void;
}

const HamburgerIcon: React.FC<HamburgerIconProps> = ({ onClick }) => (
  <img src={FacebookIconSvg} alt="IG" onClick={onClick} style={{ cursor: 'pointer' }} />
);

export default HamburgerIcon;
