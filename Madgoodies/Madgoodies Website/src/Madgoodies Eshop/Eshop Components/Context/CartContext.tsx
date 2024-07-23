import React, { createContext, useState, useContext, ReactNode, useEffect, useMemo} from 'react';
interface CartItem {
  productID: number;
  title: string;
  price: number;
  quantity: number;
  image: string;
  packagingID?: number;
  packageQuantity?: number;
  baseQuantity: number;  
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productID: number, packagingID?: number) => void;
  updateQuantity: (productID: number, quantity: number, packagingID?: number) => void;
  clearCart: () => void;
  total: number;  
}

const CartContext = createContext<CartContextType | undefined>(undefined);
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);


  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) =>
        cartItem.productID === item.productID && cartItem.packagingID === item.packagingID
      );
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.productID === item.productID && cartItem.packagingID === item.packagingID
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      }
      return [...prevCart, { ...item, baseQuantity: item.packageQuantity || 1 }];
    });
  };

  const removeFromCart = (productID: number, packagingID?: number) => {
    setCart((prevCart) =>
      prevCart.filter((item) =>
        item.productID !== productID || (packagingID !== undefined && item.packagingID !== packagingID)
      )
    );
  };
  
  const updateQuantity = (productID: number, newQuantity: number, packagingID?: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.productID === productID && item.packagingID === packagingID) {
          const baseQuantity = item.packageQuantity || 1;
          const adjustedQuantity = Math.max(baseQuantity, Math.round(newQuantity / baseQuantity) * baseQuantity);
          return { ...item, quantity: adjustedQuantity };
        }
        return item;
      })
    );
  };
  const clearCart = () => {
    setCart([]);
  };
  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};



export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};