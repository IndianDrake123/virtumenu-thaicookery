
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Clock, ArrowLeft, Phone, Mail, CheckCircle } from 'lucide-react';
import { trackUserInteraction } from '@/utils/analytics';
import { toast } from 'sonner';

const ThankYou = () => {
  const navigate = useNavigate();
  const [estimatedPrepTime, setEstimatedPrepTime] = useState<number | null>(null);
  const [contactMethod, setContactMethod] = useState<'phone' | 'email' | null>(null);
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
  
  // Format the estimated time
  const formatEstimatedTime = (minutes: number | null) => {
    if (!minutes) return "Unknown";
    
    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMinutes > 0 ? `and ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}` : ''}`;
    }
  };

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
        <span className="font-medium">Contact information saved</span>
        <span className="text-sm text-gray-500">
          We'll notify you when your order is ready
        </span>
      </div>,
      { duration: 4000 }
    );
  };
  
  return (
    <Layout title="Thank You" showHeader={true}>
      <div className="px-4 py-6 max-w-md mx-auto">
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#CA3F3F]/20 rounded-full mb-4">
            <svg className="w-8 h-8 text-[#CA3F3F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Thank You!</h1>
          <p className="text-gray-300">Your order has been confirmed and is being prepared.</p>
        </div>
        
        {/* Estimated Time Card */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg mb-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#CA3F3F]/20 p-2 rounded-full">
              <Clock size={20} className="text-[#CA3F3F]" />
            </div>
            <h2 className="text-lg font-medium text-white">Expected Time Until Ready</h2>
          </div>
          
          <div className="text-center py-2">
            <span className="text-3xl font-bold text-white block mb-1">
              {formatEstimatedTime(estimatedPrepTime)}
            </span>
            <p className="text-gray-400">
              We're preparing your delicious meal now.
            </p>
          </div>
        </div>
        
        {/* Contact Information Card */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg mb-6 animate-fade-in">
          {!isSubmitted ? (
            <>
              <div className="mb-4">
                <h2 className="text-lg font-medium text-white mb-2">Get Notified</h2>
                <p className="text-gray-400 text-sm">
                  Enter your contact information to receive a notification when your order is ready.
                </p>
              </div>
              
              <div className="mb-4">
                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={() => setContactMethod('phone')}
                    className={`flex-1 gap-2 ${
                      contactMethod === 'phone'
                        ? 'bg-[#CA3F3F]'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <Phone size={16} />
                    Phone
                  </Button>
                  
                  <Button
                    type="button"
                    onClick={() => setContactMethod('email')}
                    className={`flex-1 gap-2 ${
                      contactMethod === 'email'
                        ? 'bg-[#CA3F3F]'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <Mail size={16} />
                    Email
                  </Button>
                </div>
              </div>
              
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
                    placeholder="Enter your phone number"
                    className="w-full p-3 bg-gray-800/90 rounded-lg border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#CA3F3F] focus:border-transparent"
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
                    placeholder="Enter your email address"
                    className="w-full p-3 bg-gray-800/90 rounded-lg border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#CA3F3F] focus:border-transparent"
                  />
                </div>
              )}
              
              {contactMethod && (
                <Button
                  onClick={handleSubmitContact}
                  className="w-full bg-[#CA3F3F] hover:bg-[#a82f2f] h-12 text-white font-medium rounded-lg"
                >
                  Notify Me When Ready
                </Button>
              )}
            </>
          ) : (
            <div className="text-center py-2">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-green-500/20 rounded-full mb-3">
                <CheckCircle size={24} className="text-green-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                You're All Set!
              </h3>
              <p className="text-gray-400 text-sm">
                {contactMethod === 'phone' 
                  ? `We'll send a text message to ${phoneNumber} when your order is ready.`
                  : `We'll send an email to ${email} when your order is ready.`
                }
              </p>
            </div>
          )}
        </div>
        
        <div className="space-y-4 animate-fade-in">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg">
            <h2 className="text-lg font-medium text-white mb-3">What's Next?</h2>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <div className="bg-[#CA3F3F]/20 p-1 rounded-full mt-0.5">
                  <svg className="w-4 h-4 text-[#CA3F3F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <span>Your food is being freshly prepared by our chefs.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-[#CA3F3F]/20 p-1 rounded-full mt-0.5">
                  <svg className="w-4 h-4 text-[#CA3F3F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <span>A server will bring your order to your table when it's ready.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-[#CA3F3F]/20 p-1 rounded-full mt-0.5">
                  <svg className="w-4 h-4 text-[#CA3F3F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <span>If you need assistance, please ask any of our staff members.</span>
              </li>
            </ul>
          </div>
          
          <Button
            onClick={() => navigate('/menu')}
            className="w-full bg-[#CA3F3F] hover:bg-[#a82f2f] h-12 text-white font-medium rounded-lg"
          >
            <ArrowLeft size={16} className="mr-2" />
            Return to Menu
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default ThankYou;
