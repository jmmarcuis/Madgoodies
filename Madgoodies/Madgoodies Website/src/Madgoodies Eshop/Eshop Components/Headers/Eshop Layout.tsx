import React, { useState, useEffect, ReactNode } from 'react';
import Header from './Header';
import CartSidebar from './CartSidebar';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <div>
      <Header isMobile={isMobile} toggleCart={toggleCart} />
      <main style={{ marginLeft: isMobile ? 0 : '180px' }}>
        {children}
      </main>
      <CartSidebar isOpen={isCartOpen} onClose={toggleCart} />
    </div>
  );
}

export default Layout;
