
import React from 'react';
import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';

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
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
      <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-800">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tax</span>
          <span className="text-gray-800">${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Delivery</span>
          <span className="text-gray-800">Free</span>
        </div>
      </div>
      
      <div className="border-t border-gray-100 pt-3 mb-4">
        <div className="flex justify-between font-medium">
          <span className="text-gray-900">Total</span>
          <span className="text-gray-900">${total.toFixed(2)}</span>
        </div>
      </div>
      
      {checkoutButton && (
        <Link 
          to="/checkout" 
          className="w-full block text-center bg-primary text-white font-medium py-3 rounded-lg hover:opacity-90 transition-colors"
        >
          Proceed to Checkout
        </Link>
      )}
    </div>
  );
};

export default CartSummary;
