
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Minus, Plus, Trash2, ArrowLeft, Clock, Percent, DollarSign } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { trackUserInteraction } from "@/utils/analytics";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, subtotal } = useCart();
  const [isLoaded, setIsLoaded] = useState(false);
  const [tipInput, setTipInput] = useState("15");
  const [tipType, setTipType] = useState<"percent" | "fixed">("percent");
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    // Track page view
    trackUserInteraction('page_view', { page: 'cart' });

    return () => clearTimeout(timer);
  }, []);

  // Calculate estimated prep time based on cart items
  const calculatePrepTime = () => {
    if (cart.length === 0) return 0;
    
    // Base prep time for any order
    let baseTime = 15;
    
    // Add time based on number of items (each item adds 2-5 minutes)
    const itemTime = cart.reduce((total, item) => {
      return total + (item.quantity * 3); // 3 minutes per item on average
    }, 0);
    
    // Cap at reasonable maximum time (45 minutes)
    return Math.min(baseTime + itemTime, 45);
  };
  
  const estimatedPrepTime = calculatePrepTime();
  
  // Calculate tip based on input and type
  const calculateTip = () => {
    if (tipType === "percent") {
      const percentage = parseFloat(tipInput) || 0;
      return (subtotal * percentage) / 100;
    } else {
      return parseFloat(tipInput) || 0;
    }
  };

  const tip = calculateTip();
  const total = subtotal + tip;
  
  // Toggle between percentage and fixed amount
  const toggleTipType = () => {
    if (tipType === "percent") {
      // Convert current percentage to equivalent fixed amount
      const fixedAmount = ((parseFloat(tipInput) || 0) * subtotal / 100).toFixed(2);
      setTipInput(fixedAmount);
      setTipType("fixed");
    } else {
      // Convert current fixed amount to equivalent percentage
      const percentage = subtotal > 0 ? ((parseFloat(tipInput) || 0) / subtotal * 100).toFixed(1) : "0";
      setTipInput(percentage);
      setTipType("percent");
    }
  };
  
  // Save prep time to localStorage for use on thank you page
  useEffect(() => {
    if (estimatedPrepTime > 0) {
      localStorage.setItem('estimatedPrepTime', estimatedPrepTime.toString());
    }
  }, [estimatedPrepTime]);

  if (cart.length === 0) {
    return (
      <Layout title="Your Cart" showHeader={true}>
        <div className={`flex flex-col items-center justify-center pt-16 px-4 ${isLoaded ? "animate-fade-in" : "opacity-0"}`}>
          <div className="w-24 h-24 bg-gray-100/10 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm border border-white/5">
            <Trash2 size={32} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Your cart is empty</h2>
          <p className="text-gray-400 text-center mb-8">Looks like you haven't added any items to your cart yet</p>
          <Link to="/" className="bg-[#CA3F3F] text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-transform transform hover:scale-[1.02] active:scale-[0.98] shadow-lg">
            Browse Menu
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Your Cart" showHeader={false}>
      <div className={`space-y-4 ${isLoaded ? "animate-fade-in" : "opacity-0"}`}>
        {/* Custom Header */}
        <div className="sticky top-0 z-40 bg-black/90 backdrop-blur-md py-3 px-4 flex justify-between items-center shadow-lg">
          <button 
            onClick={() => navigate(-1)}
            className="text-white flex items-center hover:text-[#CA3F3F] transition-colors active:text-[#CA3F3F]"
          >
            <ArrowLeft size={18} className="mr-2" />
          </button>
          
          <div className="absolute left-0 right-0 mx-auto flex justify-center pointer-events-none">
            <h1 className="text-white font-medium">Your Cart</h1>
          </div>
          
          <Link 
            to="/" 
            className="flex items-center justify-center"
            onClick={() => trackUserInteraction('navigate', { from: 'cart', to: 'menu' })}
          >
            <img 
              src="/lovable-uploads/a8416d4e-080d-42c1-b165-a5aa2b783dee.png" 
              alt="Thai Cookery Logo" 
              className="h-10 w-10 rounded-full shadow-md"
            />
          </Link>
        </div>
        
        {/* Preparation Time Card */}
        <div className="mx-3 mb-1">
          <div className="bg-[#CA3F3F]/10 backdrop-blur-sm rounded-xl p-4 border border-[#CA3F3F]/20 shadow-md">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-[#CA3F3F]/20 p-2 rounded-full mr-3">
                <Clock size={18} className="text-[#CA3F3F]" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Expected Time Until Ready</p>
                <p className="text-[#CA3F3F] font-semibold text-lg">
                  {estimatedPrepTime} minutes
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Cart Items */}
        <div className="space-y-2 mb-4 px-3">
          {cart.map((item) => (
            <div 
              key={item.id} 
              className="bg-white/5 backdrop-blur-sm rounded-xl p-4 shadow-md flex flex-col border border-white/10 transform transition-all duration-300 hover:translate-y-[-2px]"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-white">{item.name}</h3>
                  {item.options && item.options.length > 0 && (
                    <div className="mt-1 space-y-1">
                      {item.options.map((option, idx) => (
                        <p key={idx} className="text-sm text-gray-400">
                          {option.name}: {option.choice} 
                          {option.price ? ` (+$${option.price.toFixed(2)})` : ''}
                        </p>
                      ))}
                    </div>
                  )}
                  {item.specialInstructions && (
                    <p className="text-sm text-gray-400 mt-1">
                      Notes: {item.specialInstructions}
                    </p>
                  )}
                </div>
                <p className="font-medium text-white bg-[#CA3F3F]/80 px-2 py-1 rounded-lg text-sm">
                  ${((item.price + (item.options?.reduce((sum, opt) => sum + (opt.price || 0), 0) || 0)) * item.quantity).toFixed(2)}
                </p>
              </div>
              
              <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/10">
                <button 
                  onClick={() => {
                    removeFromCart(item.id);
                    trackUserInteraction('remove_from_cart', { itemId: item.id, itemName: item.name });
                  }}
                  className="text-gray-400 hover:text-[#CA3F3F] transition-colors transform hover:scale-110"
                >
                  <Trash2 size={16} />
                </button>
                
                <div className="flex items-center bg-black/30 rounded-lg p-1 shadow-inner">
                  <button
                    onClick={() => {
                      updateQuantity(item.id, Math.max(1, item.quantity - 1));
                      trackUserInteraction('update_quantity', { 
                        itemId: item.id, 
                        itemName: item.name, 
                        newQuantity: Math.max(1, item.quantity - 1) 
                      });
                    }}
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-[#CA3F3F] text-white hover:opacity-90 disabled:opacity-50 shadow-md"
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="mx-2 font-medium text-white text-sm">{item.quantity}</span>
                  <button
                    onClick={() => {
                      updateQuantity(item.id, item.quantity + 1);
                      trackUserInteraction('update_quantity', { 
                        itemId: item.id, 
                        itemName: item.name, 
                        newQuantity: item.quantity + 1 
                      });
                    }}
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-[#CA3F3F] text-white hover:opacity-90 shadow-md"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Order Summary */}
        <div className="px-3">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 shadow-md border border-white/10">
            <h3 className="font-semibold text-white mb-4 border-b border-white/10 pb-2">Order Summary</h3>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Subtotal</span>
                <span className="text-white font-medium">${subtotal.toFixed(2)}</span>
              </div>
              
              {/* Interactive Tip Input */}
              <div className="flex justify-between text-sm items-center">
                <span className="text-gray-300">Tip</span>
                <div className="flex items-center bg-black/30 rounded-lg pr-2 shadow-inner">
                  <button 
                    onClick={toggleTipType}
                    className="h-7 px-2 flex items-center justify-center text-gray-300 hover:text-white"
                  >
                    {tipType === "percent" ? <Percent size={14} /> : <DollarSign size={14} />}
                  </button>
                  <input
                    type="text"
                    value={tipInput}
                    onChange={(e) => {
                      // Only allow numbers and decimal point
                      const regex = /^[0-9]*\.?[0-9]*$/;
                      if (regex.test(e.target.value) || e.target.value === '') {
                        setTipInput(e.target.value);
                      }
                    }}
                    className="w-14 bg-transparent border-none focus:outline-none text-right text-white font-medium"
                    placeholder={tipType === "percent" ? "%" : "$"}
                  />
                  <span className="text-gray-400 ml-1">
                    {tipType === "percent" ? "%" : ""}
                  </span>
                </div>
                <span className="text-white font-medium ml-2">${tip.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="border-t border-white/10 pt-3 mb-4">
              <div className="flex justify-between font-medium">
                <span className="text-white">Total</span>
                <span className="text-white text-lg">${total.toFixed(2)}</span>
              </div>
            </div>
            
            <button 
              onClick={() => {
                trackUserInteraction('checkout', { cartTotal: total.toFixed(2) });
                navigate('/checkout');
              }}
              className="w-full bg-[#CA3F3F] text-white font-medium py-3.5 rounded-lg hover:opacity-90 transition-transform transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
        
        <div className="px-3 pb-6">
          <Link 
            to="/"
            className="block text-center text-[#CA3F3F] font-medium py-3 bg-white/5 backdrop-blur-sm rounded-lg border border-[#CA3F3F]/20 hover:bg-white/10 transition-colors shadow-sm"
            onClick={() => trackUserInteraction('add_more_items', {})}
          >
            Add more items
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
