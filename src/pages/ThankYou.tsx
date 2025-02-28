
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Phone, Mail, Star, Gift } from 'lucide-react';
import { trackUserInteraction } from '@/utils/analytics';
import { toast } from 'sonner';

const ThankYou = () => {
  const navigate = useNavigate();
  const [estimatedPrepTime, setEstimatedPrepTime] = useState<number | null>(null);
  const [contactMethod, setContactMethod] = useState<'phone' | 'email'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  useEffect(() => {
    // Track page view
    trackUserInteraction('page_view', { page: 'thank_you' });
    
    // Load estimated prep time from localStorage
    const prepTime = localStorage.getItem('estimatedPrepTime');
    if (prepTime) {
      setEstimatedPrepTime(parseInt(prepTime, 10));
    }
  }, []);

  const handleSubmitContact = () => {
    if (contactMethod === 'phone' && phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }
    
    if (contactMethod === 'email' && !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    // Track the contact information submission
    trackUserInteraction('submit_contact', { 
      contactMethod, 
      value: contactMethod === 'phone' ? phoneNumber : email 
    });
    
    // In a real app, this would send the contact info to a server
    setIsSubmitted(true);
    
    toast.success(
      <div className="flex flex-col">
        <span className="font-medium">Registration successful!</span>
        <span className="text-sm text-gray-500">
          You'll receive 19% off your next order
        </span>
      </div>,
      { duration: 4000 }
    );
  };
  
  return (
    <div className="bg-black min-h-screen text-white">
      {/* Custom Header */}
      <header className="sticky top-0 z-40 px-4 py-3 bg-black/90 backdrop-blur-md shadow-lg">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('/menu')}
            className="text-white flex items-center hover:text-gray-300 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            <span>Back to Menu</span>
          </button>
          
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/a8416d4e-080d-42c1-b165-a5aa2b783dee.png" 
              alt="Thai Cookery Logo" 
              className="h-9 w-9 rounded-full shadow-md"
            />
          </div>
        </div>
      </header>
      
      <main className="px-4 pt-8 pb-16 max-w-md mx-auto">
        {/* Logo and Title */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-r from-red-800 to-red-600 p-2 rounded-full mb-6">
            <img 
              src="/lovable-uploads/a8416d4e-080d-42c1-b165-a5aa2b783dee.png" 
              alt="Thai Cookery Logo" 
              className="h-16 w-16 rounded-full"
            />
          </div>
          
          <h1 className="text-2xl font-bold text-center mb-2">
            Thank You for Eating at Thai Cookery!
          </h1>
          
          <p className="text-gray-400 text-center mb-4">
            Your order has been confirmed and will be delivered soon.
          </p>
          
          {/* Star Rating */}
          <div className="flex items-center justify-center space-x-1 mb-8">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={24} 
                className="text-red-500 fill-red-500" 
              />
            ))}
          </div>
        </div>
        
        {/* Register for Discount Section */}
        <div className="bg-gray-900/80 rounded-lg p-6 mb-6 border border-gray-800">
          <div className="flex items-center mb-3">
            <Gift size={20} className="text-red-500 mr-2" />
            <h2 className="text-lg font-medium">Register for a Special Discount</h2>
          </div>
          
          <p className="text-gray-400 mb-4">
            Register now to receive <span className="text-red-500 font-medium">19% off</span> your next order!
          </p>
          
          {!isSubmitted ? (
            <>
              {/* Contact Method Toggle */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <Button
                  type="button"
                  onClick={() => setContactMethod('phone')}
                  className={`rounded-lg h-12 flex items-center justify-center ${
                    contactMethod === 'phone'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <Phone size={16} className="mr-2" />
                  Phone
                </Button>
                
                <Button
                  type="button"
                  onClick={() => setContactMethod('email')}
                  className={`rounded-lg h-12 flex items-center justify-center ${
                    contactMethod === 'email'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <Mail size={16} className="mr-2" />
                  Email
                </Button>
              </div>
              
              {/* Input Section */}
              {contactMethod === 'phone' && (
                <div className="mb-4">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="(123) 456-7890"
                    className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              )}
              
              {contactMethod === 'email' && (
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              )}
              
              {/* Submit Button */}
              <Button
                onClick={handleSubmitContact}
                className="w-full bg-red-600 hover:bg-red-700 h-12 text-white font-medium rounded-lg"
              >
                Register & Get 19% Off
              </Button>
              
              <p className="text-gray-500 text-xs text-center mt-3">
                By registering, you agree to receive promotional messages. 
                You can unsubscribe at any time.
              </p>
            </>
          ) : (
            <div className="text-center py-3">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-green-500/20 rounded-full mb-3">
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                Thank You for Registering!
              </h3>
              <p className="text-gray-400 text-sm">
                You'll receive 19% off your next order. We've sent a confirmation to 
                {contactMethod === 'phone' 
                  ? ` ${phoneNumber}`
                  : ` ${email}`
                }
              </p>
            </div>
          )}
        </div>
        
        {/* Estimated Time Card - This is kept but restyled */}
        <div className="bg-gray-900/80 rounded-lg p-5 border border-gray-800 mb-6">
          <h2 className="text-lg font-medium text-white mb-3">Estimated Preparation Time</h2>
          
          <div className="text-center">
            <span className="text-2xl font-bold text-white block mb-1">
              {estimatedPrepTime || 15} minutes
            </span>
            <p className="text-gray-400 text-sm">
              We're preparing your delicious meal now.
            </p>
          </div>
        </div>
        
        {/* Return to Menu Button */}
        <Button
          onClick={() => navigate('/menu')}
          className="w-full bg-red-600 hover:bg-red-700 h-12 text-white font-medium rounded-lg flex items-center justify-center"
        >
          <ArrowLeft size={16} className="mr-2" />
          Return to Menu
        </Button>
      </main>
    </div>
  );
};

export default ThankYou;
