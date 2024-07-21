 import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './Madgoodies Eshop/Eshop Components/Eshop Headers/Eshop Layout';
import HomePage from './Madgoodies Eshop/Eshop Pages/Homepage';
import OrderOnlinePage from './Madgoodies Eshop/Eshop Pages/OrderOnlinePage';
import ContactUsPage from './Madgoodies Eshop/Eshop Pages/ContactUsPage';
import CartPage from './Madgoodies Eshop/Eshop Pages/CartPage';
import HoursLocation from './Madgoodies Eshop/Eshop Pages/Location';
import "./index.css"

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/order" element={<OrderOnlinePage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/location" element={<HoursLocation />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;