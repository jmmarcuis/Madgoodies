import React, { useState, useEffect } from "react";
import { useAuth } from "../Eshop Components/Context/AuthContext";
import { useCart } from "../Eshop Components/Context/CartContext";
import "../Eshop Component Styles/CheckoutPage.css";
import { motion } from "framer-motion";
import data from "../../assets/phprovince.json";
import axios from "axios";
import { Helmet } from "react-helmet";
import logo from"../../assets/madgoodies.png"

interface Barangay {
  barangay_list: string[];
}

interface Municipality {
  municipality_list: {
    [municipalityName: string]: Barangay;
  };
}
interface Region {
  region_name: string;
  province_list: {
    [provinceName: string]: Municipality;
  };
}

interface Data {
  [regionCode: string]: Region;
}

const CheckoutPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { cart, removeFromCart, total } = useCart();
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    province: "",
    zipCode: "",
    contactNumber: "", // Added contact number field
  });
  const [provinces, setProvinces] = useState<string[]>([]);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [isCityDisabled, setIsCityDisabled] = useState(true);

  useEffect(() => {
    const provincesList: string[] = [];
    for (const regionCode in data as Data) {
      const region = (data as Data)[regionCode];
      for (const provinceName in region.province_list) {
        provincesList.push(provinceName);
      }
    }
    setProvinces(provincesList);
  }, []);

  const getQuantityDisplay = (item: CartItem) => {
    if (item.packageQuantity) {
      const packCount = item.quantity / item.packageQuantity;
      return `${packCount} pack(s)`;
    } else {
      return `${item.quantity} pcs`;
    }
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));

    // Validate contact number if it's being changed
 

    // Existing logic for province and city
    if (name === "province") {
      const selectedProvince = value;
      const citiesList: string[] = [];
      for (const regionCode in data as Data) {
        const region = (data as Data)[regionCode];
        if (region.province_list[selectedProvince]) {
          const province = region.province_list[selectedProvince];
          for (const municipalityName in province.municipality_list) {
            citiesList.push(municipalityName);
          }
          break;
        }
      }
      setFilteredCities(citiesList);
      setIsCityDisabled(citiesList.length === 0);
      setPersonalInfo((prev) => ({ ...prev, city: "" })); // Reset city if province changes
    }
  };

  const handleRemoveItem = (productID: number, packagingID?: number) => {
    removeFromCart(productID, packagingID);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form from submitting normally

    if (!isValidForm()) {
      alert("Please fill in all required fields correctly.");
      return;
    }

    const order = {
      FirstName: personalInfo.firstName,
      LastName: personalInfo.lastName,
      Address: personalInfo.address,
      Apartment: personalInfo.apartment,
      City: personalInfo.city,
      Province: personalInfo.province,
      ZipCode: personalInfo.zipCode,
      ContactNumber: personalInfo.contactNumber,
      TotalAmount: total,
       OrderStatus: "Pending",
      OrderItems: cart.map((item) => ({
        ProductID: item.productID,
        ProductName: item.title,
        Price: item.price,
        Quantity: item.quantity,
        PackagingID: item.packagingID,
        PackageQuantity: item.packageQuantity,
      })),
    };

    try {
      const response = await axios.post(
        "http://localhost:5173/api/OnlineOrder",
        order
      );
      console.log("Order placed successfully:", response.data);
      alert("Order placed successfully! Order ID: " + response.data.OrderID);
      // Clear cart and reset form here
    } catch (error) {
      console.error("Error placing order:", error);
      alert("An error occurred while placing the order. Please try again.");
    }
  };

  const isValidForm = () => {
    return (
      personalInfo.firstName.trim() !== "" &&
      personalInfo.lastName.trim() !== "" &&
      personalInfo.address.trim() !== "" &&
      personalInfo.city.trim() !== "" &&
      personalInfo.province.trim() !== "" &&
      personalInfo.zipCode.trim() !== "" &&
      personalInfo.contactNumber
    );
  };

  if (!isAuthenticated) {
    return <p>Please log in to proceed with checkout.</p>;
  }

  
    return (
      <>
            <Helmet>
        <title>Madgoodies - Home</title>
        <link rel="icon" href={logo} type="image/x-icon" />
      </Helmet>
      <div className="page-container checkout-page">
        <h1>Checkout</h1>
        <div className="checkout-content">
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="order-summary-content">
              {cart.map((item) => (
                <div
                  key={
                    item.productID +
                    (item.packagingID ? `-${item.packagingID}` : "")
                  }
                  className="checkout-item"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="checkout-item-image"
                  />
                  <div className="checkout-item-details">
                    <h3>{item.title}</h3>
                    <div className="checkout-item-info">
                      <p>Quantity: {getQuantityDisplay(item)}</p>
                      {item.packageQuantity && (
                        <p>Package: {item.packageQuantity} units</p>
                      )}
                      <p>Price: ₱{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <div className="checkout-item-price-remove">
                      <motion.button
                        className="checkout-item-remove-button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          handleRemoveItem(item.productID, item.packagingID)
                        }
                      >
                        Remove
                      </motion.button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="checkout-total">
              <strong>Total: ₱{total.toFixed(2)}</strong>
            </div>
          </div>

        <div className="personal-info-section">
          <form className="personal-info-form" onSubmit={handlePlaceOrder}>
            <h2>Shipping Information</h2>
            <div className="form-row">
              <label>
                FIRST NAME*
                <input
                  type="text"
                  name="firstName"
                  value={personalInfo.firstName}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                LAST NAME*
                <input
                  type="text"
                  name="lastName"
                  value={personalInfo.lastName}
                  onChange={handleInputChange}
                  required
                />
              </label>
            </div>

            <div className="form-row">
              <label>
                CONCTACT NO. *
                <input
                  type="text"
                  name="contactNumber"
                  value={personalInfo.contactNumber}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. 09123456789"
                />
              </label>
              <label>
                ZIP/POSTAL CODE
                <input
                  type="text"
                  name="zipCode"
                  value={personalInfo.zipCode}
                  onChange={handleInputChange}
                  required
                />
              </label>
            </div>
            <label>
              ADDRESS
              <input
                type="text"
                name="address"
                value={personalInfo.address}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              APPARTMENT, HOUSE (IF APPLICABLE)*
              <input
                type="text"
                name="apartment"
                value={personalInfo.apartment}
                onChange={handleInputChange}
              />
            </label>
            <label>
              PROVINCE
              <select
                name="province"
                value={personalInfo.province}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Province</option>
                {provinces.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </label>
            <label>
              CITY
              <select
                name="city"
                value={personalInfo.city}
                onChange={handleInputChange}
                required
                disabled={isCityDisabled}
              >
                <option value="">Select City</option>
                {filteredCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </label>

            <motion.button
              className="place-order-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Place Order
            </motion.button>
          </form>
        </div>
      </div>
    </div>
    </>
  );
};

export default CheckoutPage;
