import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './Madgoodies Eshop/Eshop Components/Headers/Eshop Layout';
import HomePage from './Madgoodies Eshop/Eshop Pages/Homepage';
import ContactUsPage from './Madgoodies Eshop/Eshop Pages/ContactUsPage';
import { CartProvider } from './Madgoodies Eshop/Eshop Components/Context/CartContext';
import { AuthProvider } from './Madgoodies Eshop/Eshop Components/Context/AuthContext';
import ProductPage from './Madgoodies Eshop/Eshop Pages/ProductPage';
import GoodDetailsPage from './Madgoodies Eshop/Eshop Pages/GoodsDetailPage';
import HoursLocation from './Madgoodies Eshop/Eshop Pages/Location';
import OrderForm from './Madgoodies Eshop/Eshop Pages/OrderFormPage';
import CartSidebar from './Madgoodies Eshop/Eshop Components/Headers/CartSidebar';
import CheckoutPage from './Madgoodies Eshop/Eshop Pages/CheckoutPage';
import LoginPage from './Madgoodies Eshop/Eshop Pages/LoginPage';
import RegisterPage from './Madgoodies Eshop/Eshop Pages/RegisterPage';
import PrivateRoute from './Madgoodies Eshop/Routes/PrivateRoute';
import "./index.css"
 
function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleOpenCart = () => {
    setIsCartOpen(true);
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/contact" element={<ContactUsPage />} />
              <Route path="/order" element={<OrderForm />} />
              <Route path="/location" element={<HoursLocation />} />
              <Route path="/product" element={<ProductPage />} />
              <Route path="/good/:id" element={<GoodDetailsPage onAddToCart={handleOpenCart} />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route 
                path="/checkout" 
                element={
                  <PrivateRoute>
                    <CheckoutPage />
                  </PrivateRoute>
                } 
              />
            </Routes>
          </Layout>
          <CartSidebar isOpen={isCartOpen} onClose={handleCloseCart} />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}


 
export default App;