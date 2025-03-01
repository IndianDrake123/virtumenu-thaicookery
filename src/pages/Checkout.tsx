
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Loader2, Clock } from "lucide-react";
import { trackUserInteraction } from "@/utils/analytics";
import { toast } from "sonner";

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, subtotal, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Calculate estimated preparation time using the same formula as in Cart page
  const calculatePrepTime = () => {
    if (cart.length === 0) return 0;
    
    // Base prep time for any order
    let baseTime = 15;
    
    // Add time based on number of items (each item adds 3 minutes)
    const itemTime = cart.reduce((total, item) => {
      return total + (item.quantity * 3); // 3 minutes per item on average
    }, 0);
    
    // Cap at reasonable maximum time (45 minutes)
    return Math.min(baseTime + itemTime, 45);
  };
  
  const estimatedPrepTime = calculatePrepTime();

  // Get values from localStorage
  const getTipAmount = () => {
    const storedTip = localStorage.getItem('tipAmount');
    return storedTip ? parseFloat(storedTip) : 0;
  };

  // Calculate tax directly from subtotal with fixed rate of 9.5%
  const taxRate = 0.095;
  const taxAmount = subtotal * taxRate;
  const tipAmount = getTipAmount();
  const totalAmount = subtotal + taxAmount + tipAmount;

  useEffect(() => {
    // Track page view
    trackUserInteraction('page_view', { page: 'checkout' });
    
    // Simulate loading payment options
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleCheckout = () => {
    setIsProcessing(true);
    trackUserInteraction('checkout_complete', { 
      subtotal: subtotal.toFixed(2),
      estimatedPrepTime: estimatedPrepTime
    });
    
    // Store the estimated prep time for thank-you page
    localStorage.setItem('estimatedPrepTime', estimatedPrepTime.toString());
    
    // Simulate payment processing
    setTimeout(() => {
      clearCart();
      
      // Show a success toast
      toast.success(
        <div className="flex flex-col">
          <span className="font-medium">Order Confirmed!</span>
          <span className="text-sm text-gray-500">
            Estimated time: {estimatedPrepTime} minutes
          </span>
        </div>,
        { duration: 4000 }
      );
      
      navigate("/thank-you");
    }, 1500);
  };

  return (
    <Layout title="Checkout" showHeader={true}>
      <div className="px-4 py-6 space-y-6 animate-fade-in">
        {/* Center the main Checkout title */}
        <div className="flex justify-center mb-6">
          <h1 className="text-2xl font-bold text-white">Checkout</h1>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 size={40} className="text-[#CA3F3F] animate-spin mb-4" />
            <p className="text-gray-300">Loading payment options...</p>
          </div>
        ) : (
          <>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg">
              <h2 className="text-lg font-medium text-white mb-4">Order Summary</h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-300">Subtotal</span>
                  <span className="text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Tax (9.5%)</span>
                  <span className="text-white">${taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Tip</span>
                  <span className="text-white">${tipAmount.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="pt-3 border-t border-white/10">
                <div className="flex justify-between font-medium">
                  <span className="text-white">Total</span>
                  <span className="text-xl text-[#CA3F3F]">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Average Preparation Time Card */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-[#CA3F3F]/20 p-2 rounded-full">
                  <Clock size={20} className="text-[#CA3F3F]" />
                </div>
                <h2 className="text-lg font-medium text-white">Average Preparation Time</h2>
              </div>
              
              <div className="flex items-center mb-2">
                <span className="text-2xl font-bold text-white">
                  {estimatedPrepTime} minutes
                </span>
              </div>
              
              <p className="text-gray-400 text-sm">
                Each item in your order adds approximately 3 minutes to the preparation time. Your
                order has {cart.reduce((total, item) => total + item.quantity, 0)} item(s).
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg">
              <h2 className="text-lg font-medium text-white mb-4">Payment Method</h2>
              <p className="text-gray-300 mb-4">External payment provider integration would appear here.</p>
              
              <Button 
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full bg-[#CA3F3F] hover:bg-[#a82f2f] h-12 text-white font-medium rounded-lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={18} className="animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  "Complete Order"
                )}
              </Button>
            </div>

            <p className="text-gray-400 text-center text-sm px-4">
              By completing your order, you agree to our Terms of Service and Privacy Policy.
            </p>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Checkout;
