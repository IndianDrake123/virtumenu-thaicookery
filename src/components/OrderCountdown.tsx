
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface OrderCountdownProps {
  className?: string;
}

const OrderCountdown: React.FC<OrderCountdownProps> = ({ className = "" }) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  
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
  
  if (timeLeft === null) return null;
  
  // Format time as MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  
  return (
    <div className={`flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded-full text-xs ${className}`}>
      <Clock size={14} className="text-[#CA3F3F]" />
      <span>{formattedTime}</span>
    </div>
  );
};

export default OrderCountdown;
