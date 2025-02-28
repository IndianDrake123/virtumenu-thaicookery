
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, CheckCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { trackUserInteraction } from "@/utils/analytics";
import { toast } from "sonner";

const AboutRestaurant = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  
  // Restaurant information
  const restaurantInfo = {
    name: "Thai Cookery",
    address: "123 Main Street, Bangkok District, New York, NY 10001",
    phone: "+1 (555) 123-4567",
    hours: "Monday - Sunday: 11:00 AM - 10:00 PM",
    description: "Authentic Thai cuisine in the heart of the city. We specialize in traditional Thai dishes made with fresh ingredients and classic cooking techniques passed down through generations. Our chefs create a perfect balance of sweet, sour, spicy, and savory flavors that Thai cuisine is famous for."
  };
  
  // Formatted text for copying
  const shareableText = `
🍜 ${restaurantInfo.name} 🍜
${restaurantInfo.description}

📍 Address: ${restaurantInfo.address}
📞 Phone: ${restaurantInfo.phone}
🕒 Hours: ${restaurantInfo.hours}

Order online: https://thai-cookery.example.com
  `.trim();
  
  const handleCopyInfo = () => {
    // Copy the text to clipboard
    navigator.clipboard.writeText(shareableText).then(() => {
      setCopied(true);
      toast.success("Restaurant information copied to clipboard!");
      trackUserInteraction('copy_restaurant_info', {});
      
      // Reset copy icon after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }).catch(err => {
      toast.error("Failed to copy information. Please try again.");
      console.error("Failed to copy text: ", err);
    });
  };
  
  return (
    <Layout title="About Thai Cookery" showHeader={true} showBackButton={false}>
      <div className="px-4 py-6 max-w-md mx-auto animate-fade-in">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/a8416d4e-080d-42c1-b165-a5aa2b783dee.png" 
              alt="Thai Cookery Logo" 
              className="h-24 w-24 rounded-full shadow-lg border-2 border-[#CA3F3F]"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Thai Cookery</h1>
          <p className="text-gray-300 text-sm">Authentic Thai Cuisine</p>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-white">About Us</h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-[#CA3F3F] hover:text-white hover:bg-[#CA3F3F]/20"
              onClick={handleCopyInfo}
            >
              {copied ? (
                <CheckCheck size={18} className="mr-1" />
              ) : (
                <Copy size={18} className="mr-1" />
              )}
              {copied ? "Copied!" : "Copy Info"}
            </Button>
          </div>
          
          <p className="text-gray-300 mb-4 leading-relaxed">
            {restaurantInfo.description}
          </p>
          
          <div className="space-y-3 mt-6">
            <div className="flex items-start gap-3">
              <div className="bg-[#CA3F3F]/20 p-1 rounded-full mt-0.5 min-w-[1.5rem] flex justify-center">
                <svg className="w-4 h-4 text-[#CA3F3F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <span className="text-white font-medium block mb-1">Address</span>
                <span className="text-gray-400 text-sm">{restaurantInfo.address}</span>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-[#CA3F3F]/20 p-1 rounded-full mt-0.5 min-w-[1.5rem] flex justify-center">
                <svg className="w-4 h-4 text-[#CA3F3F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <span className="text-white font-medium block mb-1">Phone</span>
                <span className="text-gray-400 text-sm">{restaurantInfo.phone}</span>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-[#CA3F3F]/20 p-1 rounded-full mt-0.5 min-w-[1.5rem] flex justify-center">
                <svg className="w-4 h-4 text-[#CA3F3F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <span className="text-white font-medium block mb-1">Hours</span>
                <span className="text-gray-400 text-sm">{restaurantInfo.hours}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg mb-6">
          <h2 className="text-lg font-medium text-white mb-4">Share This Restaurant</h2>
          <div className="border border-dashed border-gray-600 rounded-lg p-4 bg-black/30">
            <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono overflow-auto max-h-60">
              {shareableText}
            </pre>
          </div>
          <Button
            onClick={handleCopyInfo}
            className="w-full mt-4 bg-[#CA3F3F] hover:bg-[#a82f2f] text-white"
          >
            {copied ? "Copied!" : "Copy to Clipboard"}
          </Button>
        </div>
        
        <Button
          onClick={() => navigate(-1)}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Menu
        </Button>
      </div>
    </Layout>
  );
};

export default AboutRestaurant;
