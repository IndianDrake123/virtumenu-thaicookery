
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { CreditCard, Cash, Check, ChevronRight, Lock } from "lucide-react";

const Payment = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [tipPercentage, setTipPercentage] = useState(15);

  // Sample order details
  const orderItems = [
    { name: "Original Soon Tofu", price: 15.95 },
    { name: "Kimchi Pancake", price: 12.95 },
    { name: "Beef Soon Tofu", price: 16.95 },
  ];

  const subtotal = orderItems.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.0925; // 9.25% tax
  const tip = (subtotal * tipPercentage) / 100;
  const total = subtotal + tax + tip;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout title="Payment" showHeader={true}>
      <div className={`space-y-6 ${isLoaded ? "animate-fade-in" : "opacity-0"}`}>
        {/* Order Summary */}
        <section className="glass-card p-6">
          <h2 className="text-xl font-semibold text-virtumenu-900 mb-4">Order Summary</h2>
          
          <div className="space-y-2">
            {orderItems.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-virtumenu-800">{item.name}</span>
                <span className="text-virtumenu-700">${item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className="border-t border-white border-opacity-30 my-4"></div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-virtumenu-600">Subtotal</span>
              <span className="text-virtumenu-700">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-virtumenu-600">Tax</span>
              <span className="text-virtumenu-700">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-virtumenu-600">Tip ({tipPercentage}%)</span>
              <span className="text-virtumenu-700">${tip.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="border-t border-white border-opacity-30 my-4"></div>
          
          <div className="flex justify-between">
            <span className="font-semibold text-virtumenu-900">Total</span>
            <span className="font-semibold text-virtumenu-900">${total.toFixed(2)}</span>
          </div>
        </section>

        {/* Tip Selection */}
        <section className="premium-card p-6">
          <h2 className="text-lg font-semibold text-virtumenu-900 mb-4">Add Tip</h2>
          
          <div className="grid grid-cols-4 gap-2">
            {[0, 10, 15, 20, 25].map((percentage) => (
              <button
                key={percentage}
                onClick={() => setTipPercentage(percentage)}
                className={`py-2 px-3 rounded-lg transition-all ${
                  tipPercentage === percentage
                    ? "bg-virtumenu-800 text-white font-medium"
                    : "bg-virtumenu-100 text-virtumenu-700 hover:bg-virtumenu-200"
                }`}
              >
                {percentage}%
              </button>
            ))}
            <button
              className="py-2 px-3 rounded-lg bg-virtumenu-100 text-virtumenu-700 hover:bg-virtumenu-200 transition-all"
            >
              Custom
            </button>
          </div>
        </section>

        {/* Payment Methods */}
        <section className="premium-card p-6">
          <h2 className="text-lg font-semibold text-virtumenu-900 mb-4">Payment Method</h2>
          
          <div className="space-y-3">
            <button
              onClick={() => setSelectedMethod("card")}
              className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                selectedMethod === "card"
                  ? "bg-virtumenu-800 text-white"
                  : "bg-white border border-virtumenu-200 text-virtumenu-800 hover:bg-virtumenu-50"
              }`}
            >
              <div className="flex items-center">
                <CreditCard size={20} className="mr-3" />
                <span>Credit/Debit Card</span>
              </div>
              <ChevronRight size={18} />
            </button>
            
            <button
              onClick={() => setSelectedMethod("cash")}
              className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                selectedMethod === "cash"
                  ? "bg-virtumenu-800 text-white"
                  : "bg-white border border-virtumenu-200 text-virtumenu-800 hover:bg-virtumenu-50"
              }`}
            >
              <div className="flex items-center">
                <Cash size={20} className="mr-3" />
                <span>Cash</span>
              </div>
              <ChevronRight size={18} />
            </button>
            
            <button
              onClick={() => setSelectedMethod("check")}
              className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                selectedMethod === "check"
                  ? "bg-virtumenu-800 text-white"
                  : "bg-white border border-virtumenu-200 text-virtumenu-800 hover:bg-virtumenu-50"
              }`}
            >
              <div className="flex items-center">
                <Check size={20} className="mr-3" />
                <span>Digital Wallet</span>
              </div>
              <ChevronRight size={18} />
            </button>
          </div>
        </section>

        {/* Pay Button */}
        <Button 
          className="btn-accent w-full py-6 text-lg flex items-center justify-center"
          disabled={!selectedMethod}
        >
          <Lock size={18} className="mr-2" />
          Pay ${total.toFixed(2)}
        </Button>

        <p className="text-center text-sm text-virtumenu-500 pt-2">
          Payment secured with end-to-end encryption
        </p>
      </div>
    </Layout>
  );
};

export default Payment;
