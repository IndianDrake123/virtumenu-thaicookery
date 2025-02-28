
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Phone, Mail, Gift } from 'lucide-react';
import { trackUserInteraction } from '@/utils/analytics';
import { toast } from 'sonner';

const ThankYou = () => {
  const navigate = useNavigate();
  const [contactMethod, setContactMethod] = useState<'phone' | 'email'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  
  useEffect(() => {
    // Track page view
    trackUserInteraction('page_view', { page: 'thank_you' });
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
  
  const handleRatingClick = (index: number) => {
    setRating(index);
    trackUserInteraction('set_rating', { rating: index });
  };
  
  return (
    <div className="bg-black min-h-screen text-white">
      {/* Custom Header */}
      <header className="sticky top-0 z-40 px-4 py-3 bg-black/90 backdrop-blur-md shadow-lg">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/')}
            className="text-white flex items-center hover:text-gray-300 transition-colors z-10"
          >
            <ArrowLeft size={20} className="mr-2" />
            <span>Back to Menu</span>
          </button>
        </div>
      </header>
      
      <main className="px-4 pt-8 pb-16 max-w-md mx-auto">
        {/* Logo and Title */}
        <div className="flex flex-col items-center mb-10">
          <div className="bg-gradient-to-r from-red-800 to-red-600 p-2 rounded-full mb-7 shadow-lg">
            <img 
              src="/lovable-uploads/a8416d4e-080d-42c1-b165-a5aa2b783dee.png" 
              alt="Thai Cookery Logo" 
              className="h-16 w-16 rounded-full"
            />
          </div>
          
          <h1 className="text-2xl font-bold text-center mb-2 text-white">
            Thank You for Eating at Thai Cookery!
          </h1>
          
          <p className="text-gray-400 text-center mb-6">
            Your order has been confirmed and will be delivered soon.
          </p>
          
          {/* Star Rating */}
          <div className="flex items-center justify-center space-x-2 mb-6">
            {[1, 2, 3, 4, 5].map((starIndex) => (
              <button 
                key={starIndex} 
                className="focus:outline-none transition-transform hover:scale-110"
                onMouseEnter={() => setHoverRating(starIndex)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => handleRatingClick(starIndex)}
              >
                <svg 
                  width="30" 
                  height="30" 
                  viewBox="0 0 24 24" 
                  fill={(hoverRating >= starIndex || rating >= starIndex) ? "#de4b4b" : "none"}
                  stroke={(hoverRating >= starIndex || rating >= starIndex) ? "#de4b4b" : "#666"}
                  className="transition-colors duration-150"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ))}
          </div>
        </div>
        
        {/* Register for Discount Section */}
        <div className="bg-gray-900/80 rounded-lg p-6 border border-gray-800 shadow-lg mb-6">
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
              <div className="grid grid-cols-2 gap-3 mb-4">
                <Button
                  type="button"
                  onClick={() => setContactMethod('phone')}
                  className={`rounded-lg flex items-center justify-center ${
                    contactMethod === 'phone'
                      ? 'bg-red-600 hover:bg-red-700 h-14 text-base'
                      : 'bg-gray-700 hover:bg-gray-600 h-12 text-sm'
                  } transition-all duration-200`}
                >
                  <Phone size={contactMethod === 'phone' ? 20 : 16} className="mr-2" />
                  Phone
                </Button>
                
                <Button
                  type="button"
                  onClick={() => setContactMethod('email')}
                  className={`rounded-lg flex items-center justify-center ${
                    contactMethod === 'email'
                      ? 'bg-red-600 hover:bg-red-700 h-14 text-base'
                      : 'bg-gray-700 hover:bg-gray-600 h-12 text-sm'
                  } transition-all duration-200`}
                >
                  <Mail size={contactMethod === 'email' ? 20 : 16} className="mr-2" />
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
                className="w-full bg-red-600 hover:bg-red-700 h-12 text-white font-medium rounded-lg transition-colors"
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
      </main>
    </div>
  );
};

export default ThankYou;
