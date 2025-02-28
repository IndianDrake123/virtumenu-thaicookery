
import React, { useState, useEffect } from 'react';
import { Clock, Bell, AlertCircle, ChevronUp, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { trackUserInteraction } from '@/utils/analytics';

interface OrderCountdownProps {
  className?: string;
}

const OrderCountdown: React.FC<OrderCountdownProps> = ({ className = "" }) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [waiterCalled, setWaiterCalled] = useState(false);
  
  useEffect(() => {
    // On component mount, check if we have an order in progress
    const orderStartTime = localStorage.getItem('orderStartTime');
    const orderEndTime = localStorage.getItem('orderEndTime');
    
    if (orderStartTime && orderEndTime) {
      const endTimeMs = parseInt(orderEndTime, 10);
      const currentTime = Date.now();
      
      // If the order is still active
      if (endTimeMs > currentTime) {
        setTimeLeft(Math.floor((endTimeMs - currentTime) / 1000));
      } else {
        // Clear the order data if it's expired
        localStorage.removeItem('orderStartTime');
        localStorage.removeItem('orderEndTime');
      }
    }
  }, []);
  
  useEffect(() => {
    if (timeLeft === null) return;
    
    const interval = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime === null || prevTime <= 1) {
          clearInterval(interval);
          localStorage.removeItem('orderStartTime');
          localStorage.removeItem('orderEndTime');
          return null;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [timeLeft]);
  
  const handleCallWaiter = () => {
    trackUserInteraction('call_waiter', { timeLeft: timeLeft });
    setWaiterCalled(true);
    
    toast.success(
      <div className="flex flex-col">
        <span className="font-medium">Server has been notified</span>
        <span className="text-sm text-gray-500">A staff member will be with you shortly</span>
      </div>,
      {
        duration: 4000,
        icon: <Bell size={18} className="text-[#CA3F3F]" />,
      }
    );
    
    // Reset the called state after 30 seconds
    setTimeout(() => {
      setWaiterCalled(false);
    }, 30000);
  };
  
  if (timeLeft === null) return null;
  
  // Format time as MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  
  // Determine progress percentage
  const timeLeftPercentage = Math.min(100, Math.floor((timeLeft / 300) * 100));
  
  // Color based on time left (green → yellow → red)
  const getProgressColor = () => {
    if (timeLeftPercentage > 66) return 'bg-green-500';
    if (timeLeftPercentage > 33) return 'bg-yellow-500';
    return 'bg-[#CA3F3F]';
  };
  
  const compactDisplay = (
    <div 
      onClick={() => setExpanded(true)} 
      className={`flex items-center gap-1.5 bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-full text-sm cursor-pointer hover:bg-black/90 transition-all ${className} ${
        expanded ? 'hidden' : 'flex'
      }`}
    >
      <Clock size={14} className="text-[#CA3F3F]" />
      <span className="font-medium">Time until served: {formattedTime}</span>
      <ChevronDown size={14} className="text-gray-400" />
    </div>
  );
  
  const expandedDisplay = (
    <div 
      className={`bg-black/90 backdrop-blur-md rounded-xl shadow-lg border border-white/10 p-4 max-w-sm overflow-hidden transition-all duration-300 animate-fade-in ${
        expanded ? 'block' : 'hidden'
      } ${className}`}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Clock size={18} className="text-[#CA3F3F]" />
          Time Until Served
        </h3>
        <button 
          onClick={() => setExpanded(false)} 
          className="text-gray-400 hover:text-white transition-colors"
          aria-label="Minimize timer"
        >
          <ChevronUp size={16} />
        </button>
      </div>
      
      {/* Timer display */}
      <div className="text-center">
        <div className="text-4xl font-bold text-white mb-3">
          {formattedTime}
        </div>
        
        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-800 rounded-full mb-4 overflow-hidden">
          <div 
            className={`h-full ${getProgressColor()} transition-all duration-1000 ease-in-out`}
            style={{ width: `${timeLeftPercentage}%` }}
          ></div>
        </div>
        
        <p className="text-gray-300 text-sm mb-4">
          Your order is being prepared and will be served in approximately {minutes} minute{minutes !== 1 ? 's' : ''}.
        </p>
      </div>
      
      {/* Call waiter button */}
      <Button
        onClick={handleCallWaiter}
        disabled={waiterCalled}
        className={`w-full py-5 flex items-center justify-center gap-2 ${
          waiterCalled
            ? 'bg-gray-700 text-gray-300'
            : 'bg-[#CA3F3F] hover:bg-[#CA3F3F]/80 text-white'
        } rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]`}
      >
        <Bell size={16} />
        {waiterCalled ? 'Server has been notified' : 'Call Server for Assistance'}
      </Button>
      
      {waiterCalled && (
        <p className="text-xs text-gray-400 text-center mt-2 animate-fade-in">
          A staff member will be with you shortly
        </p>
      )}
      
      <div className="mt-4 bg-gray-800/50 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <AlertCircle size={16} className="text-yellow-500 mt-0.5 shrink-0" />
          <p className="text-xs text-gray-300">
            If you need immediate assistance or have any questions about your order, 
            use the button above to call a server to your table.
          </p>
        </div>
      </div>
    </div>
  );
  
  return (
    <>
      {compactDisplay}
      {expandedDisplay}
    </>
  );
};

export default OrderCountdown;
