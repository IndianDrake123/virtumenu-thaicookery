
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import CartSummary from "@/components/CartSummary";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, subtotal } = useCart();
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (cart.length === 0) {
    return (
      <Layout title="Your Cart" showHeader={true}>
        <div className={`flex flex-col items-center justify-center pt-16 px-4 ${isLoaded ? "animate-fade-in" : "opacity-0"}`}>
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Trash2 size={32} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 text-center mb-8">Looks like you haven't added any items to your cart yet</p>
          <Link to="/" className="btn-primary">
            Browse Menu
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Your Cart" showHeader={true}>
      <div className={`space-y-4 ${isLoaded ? "animate-fade-in" : "opacity-0"}`}>
        {/* Cart Items */}
        <div className="space-y-4 mb-6">
          {cart.map((item) => (
            <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm flex flex-col">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  {item.options && item.options.length > 0 && (
                    <div className="mt-1 space-y-1">
                      {item.options.map((option, idx) => (
                        <p key={idx} className="text-sm text-gray-500">
                          {option.name}: {option.choice} 
                          {option.price ? ` (+$${option.price.toFixed(2)})` : ''}
                        </p>
                      ))}
                    </div>
                  )}
                  {item.specialInstructions && (
                    <p className="text-sm text-gray-500 mt-1">
                      Notes: {item.specialInstructions}
                    </p>
                  )}
                </div>
                <p className="font-medium text-gray-900">
                  ${((item.price + (item.options?.reduce((sum, opt) => sum + (opt.price || 0), 0) || 0)) * item.quantity).toFixed(2)}
                </p>
              </div>
              
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
                
                <div className="flex items-center">
                  <button
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600"
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="mx-3 font-medium text-gray-800">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Order Summary */}
        <CartSummary />
        
        <Link 
          to="/"
          className="block text-center text-primary font-medium py-2"
        >
          Add more items
        </Link>
      </div>
    </Layout>
  );
};

export default Cart;
