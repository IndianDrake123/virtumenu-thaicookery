
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Clock, ArrowLeft } from 'lucide-react';
import { trackUserInteraction } from '@/utils/analytics';

const ThankYou = () => {
  const navigate = useNavigate();
  const [estimatedPrepTime, setEstimatedPrepTime] = useState<number | null>(null);
  
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
            <h2 className="text-lg font-medium text-white">Estimated Preparation Time</h2>
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
