import React, { useState, useEffect } from "react";
import axios from "axios";

import InfiniteScroll from "react-infinite-scroll-component";
import "../Component Styles/Cart.css";
import CartItem from "../POS System Components/CartItem";
import GoodsCard from "../POS System Components/GoodsCard";
import OrderConfirmationModal from "../POS System Components/OrderConfirmationModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faSortAmountDown, faSortAmountUp } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { HubConnectionBuilder } from "@microsoft/signalr";

const ProductList = () => {
  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortOption, setSortOption] = useState("name");
  const [hubConnection, setHubConnection] = useState(null);

  useEffect(() => {
    // Initialize SignalR Hub Connection
    const newHubConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:7162/FetchHub") 
      .build();

    setHubConnection(newHubConnection);

    newHubConnection.start()
      .then(() => {
        console.log("SignalR Connected");
       })
      .catch(err => {
        console.error("SignalR Connection Error: ", err);
        toast.error('Failed to connect to SignalR');
      });

    // Handle incoming SignalR messages or updates
    newHubConnection.on("ReceiveMessage", (message) => {
      console.log("Received message from SignalR:", message);
      fetchMoreData(); // Fetch updated data
    });

    newHubConnection.onclose(() => {
      });

    return () => {
      newHubConnection.stop();
    };
  }, []);

  useEffect(() => {
    fetchMoreData();
  }, []);

  const fetchMoreData = async () => {
    try {
      const response = await axios.get("https://localhost:7162/api/good/all");
      const products = response.data;

      if (products.length > 0) {
        setItems(products);
        setPage(page + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const sortProducts = (products) => {
    return products.sort((a, b) => {
      switch (sortOption) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "stock-low":
          return a.stock - b.stock;
        case "stock-high":
          return b.stock - a.stock;
        case "name":
        default:
          return a.productName.localeCompare(b.productName);
      }
    });
  };

  const filteredAndSortedItems = sortProducts(
    items.filter(product =>
      product.productName.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleQuantityChange = (id, newQuantity) => {
    const product = items.find(p => p.productID === id);
    if (newQuantity > product.stock) {
      toast.warn(`Cannot exceed available stock (${product.stock}) for ${product.productName}`);
      newQuantity = product.stock; // Adjust quantity back to stock limit
    }

    const updatedCartItems = cartItems.map(item =>
      item.productID === id ? { ...item, quantity: newQuantity } : item
    );

    setCartItems(updatedCartItems);
  };

  const handleRemove = (id) => {
    setCartItems(cartItems.filter(item => item.productID !== id));
  };

  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.productID === product.productID);
    if (!existingItem) {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    } else {
      // Inform user the item is already in the cart (optional)
      toast.info(`${product.productName} is already in your cart.`);
    }
  };

  const checkStockAndAddToCart = (product) => {
    const stock = product.stock;
    const inCartItem = cartItems.find(item => item.productID === product.productID);

    if (inCartItem) {
      if (inCartItem.quantity + 1 > stock) {
        toast.warn(`Quantity exceeds available stock (${stock}) for ${product.productName}`);
      } else {
        handleQuantityChange(product.productID, inCartItem.quantity + 1);
      }
    } else {
      if (stock > 0) {
        addToCart(product);
      } else {
        toast.warn(`No stock available for ${product.productName}`);
      }
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredItems = items.filter(product =>
    product.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleClearCart = () => {
    setCartItems([]);
    fetchMoreData();
  };

  return (
    <div className="cart-flex">
      <ToastContainer
        position="bottom-right"
        autoClose={1000} // Duration for which the toast is shown
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="product-catalogue-flex">
        <div className="product-filters">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <select value={sortOption} onChange={handleSortChange}>
            <option value="name">Sort by Name 🔎</option>
            <option value="price-low">Sort by Price 🏷️🔽 </option>
            <option value="price-high"> Sort by Price 🏷️🔼</option>
            <option value="stock-low">Sort by Stock 📉</option>
            <option value="stock-high"> Sort by Stock 📈  </option>
          </select>
        </div>
        <InfiniteScroll
          dataLength={items.length}
          next={fetchMoreData}
          hasMore={hasMore}
          className="product-grid"
        >
      {filteredAndSortedItems.map((product) => (
            <GoodsCard
              key={product.productID}
              id={product.productID}
              productName={product.productName}
              price={product.price}
              stock={product.stock}
              imageUrl={product.productImageUrl}
              onAddToCart={() => addToCart(product)}
              isDisabled={product.stock === 0 || cartItems.some(item => item.productID === product.productID)}
              />
          ))}
        </InfiniteScroll>
      </div>
      <div className="cart-bar">
        <div className="cart-order-bar-flex">
          <h3>New Order</h3>
          <i><FontAwesomeIcon onClick={() => setCartItems([])} icon={faTrash} /></i>
        </div>
        <div className="cart-items">
          {cartItems.length === 0 ? (
            <p>No items in the cart</p>
          ) : (
            cartItems.map(product => (
              <CartItem
                key={product.productID}
                name={product.productName}
                price={product.price}
                imageUrl={product.productImageUrl}
                initialQuantity={1} // Or use any initial quantity
                onQuantityChange={(newQuantity) => handleQuantityChange(product.productID, newQuantity)}
                onRemove={() => handleRemove(product.productID)}
                stock={product.stock} // Pass stock prop to CartItem
              />
            ))
          )}
        </div>
        <div className="cart-total">
          <h4>Total: PHP {cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</h4>
          <button className="ConfirmOrderButton" onClick={handleOpenModal}         disabled={cartItems.length === 0}>Checkout</button>
        </div>
      </div>
      <OrderConfirmationModal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        cartItems={cartItems}
        onConfirmOrder={handleClearCart}
      />
    </div>
  );
};

export default ProductList;
