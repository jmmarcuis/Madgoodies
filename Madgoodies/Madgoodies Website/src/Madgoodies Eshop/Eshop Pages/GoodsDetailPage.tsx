import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../Eshop Components/Context/CartContext';
import axios from 'axios';
import '../Eshop Component Styles/GoodDetailPage.css';
import Marquee from '../Eshop Components/Marquee';

interface Good {
  productID: number;
  productName: string;
  price: number;
  productImageUrl: string;
  stock: number;
  description: string;
}

interface Package {
  packagingID: number;
  packageQuantity: number;
}

interface GoodDetailPageProps {
  onAddToCart: () => void;
}

const GoodDetailPage: React.FC<GoodDetailPageProps> = ({ onAddToCart }) => {
  const { id } = useParams<{ id: string }>();
  const [good, setGood] = useState<Good | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [packaging, setPackaging] = useState<Package[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<number | ''>('');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchGoodAndPackaging = async () => {
      try {
        const goodResponse = await axios.get(`https://localhost:7162/api/good/${id}`);
        setGood(goodResponse.data);

        const packagingResponse = await axios.get(`https://localhost:7162/api/good/${id}/packaging`);
        setPackaging(packagingResponse.data);
      } catch (error) {
        console.error('Error fetching good or packaging:', error);
      }
    };

    fetchGoodAndPackaging();
  }, [id]);

  if (!good) {
    return <div>Loading...</div>;
  }

const handleAddToCart = () => {
  if (good) {
    const selectedPackageInfo = selectedPackage
      ? packaging.find(pkg => pkg.packagingID === selectedPackage)
      : null;

    const cartQuantity = selectedPackageInfo ? selectedPackageInfo.packageQuantity : quantity;
    const baseQuantity = selectedPackageInfo ? selectedPackageInfo.packageQuantity : 1;

    addToCart({
      productID: good.productID,
      title: good.productName,
      price: good.price,
      quantity: cartQuantity,
      image: good.productImageUrl,
      packagingID: selectedPackage ? selectedPackage : undefined,
      packageQuantity: selectedPackage ? cartQuantity : undefined,
      baseQuantity: baseQuantity,
    });
    onAddToCart(); // Open the cart sidebar
  }
};
  

  const renderQuantitySelector = () => {
    if (packaging.length > 1 || (packaging.length === 1 && packaging[0].packageQuantity > 1)) {
      return (
        <select
          value={selectedPackage}
          onChange={(e) => setSelectedPackage(Number(e.target.value))}
          className="package-select"
        >
          <option value="">Select a package</option>
          {packaging.map((pkg) => (
            <option key={pkg.packagingID} value={pkg.packagingID}>
              {pkg.packageQuantity} units
            </option>
          ))}
        </select>
      );
    } else {
      return (
        <div className="quantity-selector">
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)}>+</button>
        </div>
      );
    }
  };

  return (
    <>
    <Marquee/>
    <div className="good-details-container">
      <div className="good-image">
        <img src={good.productImageUrl} alt={good.productName} />
      </div>
      <div className="good-details">
        <h1>{good.productName}</h1>
        <p className="price">₱{good.price.toFixed(2)}</p>
        <p>{good.description}</p>
        {renderQuantitySelector()}
        <button className="add-to-cart-button" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
    <Marquee/>
    </>  
);
};

export default GoodDetailPage;
