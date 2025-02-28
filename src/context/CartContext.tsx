
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
  options?: {
    name: string;
    choice: string;
    price?: number;
  }[];
}

interface CartContextType {
  cart: CartItem[];
  itemCount: number;
  subtotal: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  updateSpecialInstructions: (id: string, instructions: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('bcdCart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse saved cart:", error);
        setCart([]);
      }
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('bcdCart', JSON.stringify(cart));
  }, [cart]);

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  const subtotal = cart.reduce((total, item) => {
    const itemTotal = item.price * item.quantity;
    const optionsTotal = item.options ? 
      item.options.reduce((sum, option) => sum + (option.price || 0), 0) * item.quantity : 0;
    return total + itemTotal + optionsTotal;
  }, 0);

  const addToCart = (item: CartItem) => {
    setCart(prevCart => {
      // Check if the item already exists with the same options
      const existingItemIndex = prevCart.findIndex(cartItem => 
        cartItem.id === item.id && 
        JSON.stringify(cartItem.options) === JSON.stringify(item.options)
      );

      let updatedCart;
      
      if (existingItemIndex !== -1) {
        // Item exists, update quantity
        updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += item.quantity;
      } else {
        // Item doesn't exist, add it
        updatedCart = [...prevCart, item];
      }
      
      // Show toast notification with item added to cart
      toast(
        <div 
          onClick={() => {
            // Use window.location instead of navigate
            window.location.href = '/cart';
          }} 
          className="cursor-pointer"
        >
          <p className="font-medium">Added to cart</p>
          <p className="text-sm text-gray-200">{item.quantity} × {item.name} added to your cart</p>
        </div>,
        {
          duration: 3000,
          className: "bg-white text-black",
          position: "top-center",
          closeButton: true,
        }
      );
      
      return updatedCart;
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const updateSpecialInstructions = (id: string, instructions: string) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === id ? { ...item, specialInstructions: instructions } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const value = {
    cart,
    itemCount,
    subtotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    updateSpecialInstructions
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
