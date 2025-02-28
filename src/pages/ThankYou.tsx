
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, Phone, Mail, Gift, ArrowRight, Star } from "lucide-react";
import { trackUserInteraction } from "@/utils/analytics";
import { toast } from "sonner";

const ThankYou = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isPhoneSelected, setIsPhoneSelected] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    // Track page view
    trackUserInteraction('page_view', { page: 'thank_you' });
    
    // Trigger animation after a short delay
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isPhoneSelected && !phone) {
      toast.error("Please enter your phone number");
      return;
    }
    
    if (!isPhoneSelected && !email) {
      toast.error("Please enter your email");
      return;
    }
    
    // Track registration
    trackUserInteraction('register_for_discount', { 
      method: isPhoneSelected ? 'phone' : 'email',
      value: isPhoneSelected ? phone : email
    });
    
    setIsSubmitted(true);
    
    toast(
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-green-500/20 p-2">
          <Check size={18} className="text-green-500" />
        </div>
        <div>
          <p className="font-medium">Registration successful!</p>
          <p className="text-sm text-gray-700">Your discount will be applied to your next order</p>
        </div>
      </div>,
      {
        duration: 5000,
        className: "bg-white",
      }
    );
  };

  const handleBackToMenu = () => {
    navigate("/");
    trackUserInteraction('navigate_to_menu_from_thank_you', {});
  };

  // Calculate a random discount between 10-20%
  const discountPercentage = Math.floor(Math.random() * 11) + 10;

  return (
    <Layout title="Thank You" showHeader={false}>
      <div className={`min-h-screen flex flex-col bg-gradient-to-b from-black to-gray-900 transition-opacity duration-500 ${isAnimated ? "opacity-100" : "opacity-0"}`}>
        {/* Custom Header with only logo and back to menu */}
        <div className="sticky top-0 z-40 bg-black/50 backdrop-blur-md px-4 py-3 flex justify-between items-center">
          <button 
            onClick={handleBackToMenu}
            className="text-white flex items-center gap-2"
          >
            <ArrowRight size={18} className="transform rotate-180" />
            <span>Back to Menu</span>
          </button>
          <img 
            src="/lovable-uploads/a8416d4e-080d-42c1-b165-a5aa2b783dee.png" 
            alt="Thai Cookery Logo" 
            className="h-10 w-10 rounded-full shadow-md"
          />
        </div>
        
        <div className="flex-1 flex flex-col items-center px-5 py-10 max-w-lg mx-auto">
          {/* Thank You Message */}
          <div className="w-full mb-10 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-[#CA3F3F]/20 animate-pulse">
              <img 
                src="/lovable-uploads/a8416d4e-080d-42c1-b165-a5aa2b783dee.png" 
                alt="Thai Cookery Logo" 
                className="h-12 w-12 rounded-full animate-scale-in"
              />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4 animate-fade-in">
              Thank You for Eating at Thai Cookery!
            </h1>
            <p className="text-gray-300 mb-2 animate-fade-in delay-100">
              Your order has been confirmed and will be delivered soon.
            </p>
            
            <div className="flex items-center justify-center gap-1 mt-4 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  size={24} 
                  className={`${star <= 5 ? 'text-[#CA3F3F]' : 'text-gray-600'} fill-current`} 
                />
              ))}
            </div>
          </div>
          
          {!isSubmitted ? (
            <div className="w-full bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-lg animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <Gift size={20} className="text-[#CA3F3F]" />
                <h2 className="text-xl font-semibold text-white">Register for a Special Discount</h2>
              </div>
              <p className="text-gray-300 mb-6">
                Register now to receive <span className="text-[#CA3F3F] font-bold">{discountPercentage}% off</span> your next order!
              </p>
              
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => setIsPhoneSelected(true)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all ${
                    isPhoneSelected 
                      ? 'bg-[#CA3F3F] text-white' 
                      : 'bg-white/10 text-gray-300 hover:bg-white/15'
                  }`}
                >
                  <Phone size={16} />
                  <span>Phone</span>
                </button>
                <button
                  onClick={() => setIsPhoneSelected(false)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all ${
                    !isPhoneSelected 
                      ? 'bg-[#CA3F3F] text-white' 
                      : 'bg-white/10 text-gray-300 hover:bg-white/15'
                  }`}
                >
                  <Mail size={16} />
                  <span>Email</span>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {isPhoneSelected ? (
                  <div className="space-y-2">
                    <label className="text-gray-300 block">Phone Number</label>
                    <Input
                      type="tel"
                      placeholder="(123) 456-7890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus-visible:ring-[#CA3F3F] focus-visible:border-[#CA3F3F]"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-gray-300 block">Email Address</label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus-visible:ring-[#CA3F3F] focus-visible:border-[#CA3F3F]"
                    />
                  </div>
                )}
                
                <Button 
                  type="submit"
                  className="w-full bg-[#CA3F3F] hover:bg-[#a82f2f] text-white font-medium py-6 rounded-lg transition-transform transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Register & Get {discountPercentage}% Off
                </Button>
                
                <p className="text-xs text-gray-400 text-center">
                  By registering, you agree to receive promotional messages. You can unsubscribe at any time.
                </p>
              </form>
            </div>
          ) : (
            <div className="w-full bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-lg animate-fade-in text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-[#CA3F3F]/20">
                <Check size={32} className="text-[#CA3F3F]" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">You're All Set!</h2>
              <p className="text-gray-300 mb-6">
                Your {discountPercentage}% discount will be automatically applied to your next order.
              </p>
              <Button 
                onClick={handleBackToMenu}
                className="bg-white/10 hover:bg-white/20 text-white py-6 rounded-lg w-full"
              >
                Back to Menu
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ThankYou;
