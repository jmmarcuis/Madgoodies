import React from 'react';
import MailIconSvg from "./MailIcon.svg"
interface HamburgerIconProps {
  onClick: () => void;
}

const HamburgerIcon: React.FC<HamburgerIconProps> = ({ onClick }) => (
  <img src={MailIconSvg} alt="IG" onClick={onClick} style={{ cursor: 'pointer' }} />
);

export default HamburgerIcon;
