
import React from 'react';
import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';
import { trackUserInteraction } from '@/utils/analytics';

interface CartSummaryProps {
  checkoutButton?: boolean;
}

const CartSummary: React.FC<CartSummaryProps> = ({ checkoutButton = true }) => {
  const { cart, subtotal } = useCart();
  
  // Calculate tax and total
  const tax = subtotal * 0.095; // 9.5% tax
  const deliveryFee = 0; // Free delivery for now
  const total = subtotal + tax + deliveryFee;
  
  if (cart.length === 0) {
    return null;
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl shadow-md p-4 border border-white/10 transition-all hover:border-white/20">
      <h3 className="font-semibold text-white mb-4 border-b border-white/10 pb-2">Order Summary</h3>
      
      <div className="space-y-3 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-300">Subtotal</span>
          <span className="text-white font-medium">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">Tax</span>
          <span className="text-white font-medium">${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">Delivery</span>
          <span className="text-white font-medium">Free</span>
        </div>
      </div>
      
      <div className="border-t border-white/10 pt-3 mb-4">
        <div className="flex justify-between font-medium">
          <span className="text-white">Total</span>
          <span className="text-white text-lg">${total.toFixed(2)}</span>
        </div>
      </div>
      
      {checkoutButton && (
        <button
          onClick={() => {
            trackUserInteraction('checkout', { cartTotal: total.toFixed(2) });
            window.location.href = '/checkout';
          }}
          className="w-full bg-[#CA3F3F] text-white font-medium py-3 rounded-lg hover:opacity-90 transition-transform transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
        >
          Proceed to Checkout
        </button>
      )}
    </div>
  );
};

export default CartSummary;
