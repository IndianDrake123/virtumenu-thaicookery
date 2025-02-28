
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { ShoppingBag, Check } from 'lucide-react';

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
            window.location.href = '/cart';
          }} 
          className="cursor-pointer flex items-start gap-3 p-1"
        >
          <div className="rounded-full bg-[#CA3F3F]/20 p-2 mt-0.5">
            <ShoppingBag size={18} className="text-[#CA3F3F]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-[15px]">Added to cart</p>
              <div className="bg-[#CA3F3F]/20 rounded-full px-2 py-0.5 flex items-center">
                <Check size={12} className="text-[#CA3F3F] mr-1" />
                <span className="text-xs text-[#CA3F3F] font-medium">Success</span>
              </div>
            </div>
            <p className="text-sm opacity-90 mt-0.5">
              {item.quantity} × {item.name}
            </p>
            <p className="text-xs mt-1 text-[#CA3F3F] underline">
              Click to view cart
            </p>
          </div>
        </div>,
        {
          duration: 4000,
          className: "bg-white text-black shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow",
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
