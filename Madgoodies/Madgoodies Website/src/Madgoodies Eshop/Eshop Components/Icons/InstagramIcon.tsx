import React from 'react';
import InstagramIconSvg from "./InstagramIcon.svg"
interface HamburgerIconProps {
  onClick: () => void;
}

const HamburgerIcon: React.FC<HamburgerIconProps> = ({ onClick }) => (
  <img src={InstagramIconSvg} alt="IG" onClick={onClick} style={{ cursor: 'pointer' }} />
);

export default HamburgerIcon;
