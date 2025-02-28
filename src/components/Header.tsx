
import React, { useState, useEffect } from "react";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { trackUserInteraction } from "@/utils/analytics";

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton = true }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showCartTooltip, setShowCartTooltip] = useState(false);
  const [headerTitle, setHeaderTitle] = useState(title || "Thai Cookery");

  useEffect(() => {
    if (!title) {
      if (location.pathname === "/") {
        setHeaderTitle("Thai Cookery");
      } else if (location.pathname === "/cart") {
        setHeaderTitle("Your Order");
      } else {
        const path = location.pathname.split("/").pop() || "";
        setHeaderTitle(path.charAt(0).toUpperCase() + path.slice(1));
      }
    } else {
      setHeaderTitle(title);
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location, title]);

  const handleBack = () => {
    navigate(-1);
    trackUserInteraction('navigate_back', { from: location.pathname });
  };

  const handleCartClick = () => {
    navigate("/cart");
    trackUserInteraction('navigate_to_cart', { from: location.pathname });
  };

  const handleLogoClick = () => {
    navigate("/");
    trackUserInteraction('navigate_to_home', { from: location.pathname });
  };

  return (
    <header 
      className={`sticky top-0 z-40 px-4 py-3 transition-all duration-300 ${
        isScrolled 
          ? "bg-black/90 backdrop-blur-md shadow-lg" 
          : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {showBackButton && location.pathname !== "/" && (
            <button 
              onClick={handleBack}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft size={22} className="text-white" />
            </button>
          )}
          
          {headerTitle && headerTitle !== "Thai Cookery" && (
            <h1 className="text-xl font-semibold text-white">{headerTitle}</h1>
          )}
        </div>
        
        {location.pathname === "/cart" ? (
          <button 
            onClick={handleLogoClick}
            className="flex items-center justify-center"
            aria-label="Go to menu"
          >
            <img 
              src="/lovable-uploads/a8416d4e-080d-42c1-b165-a5aa2b783dee.png" 
              alt="Thai Cookery Logo" 
              className="h-9 w-9 rounded-full shadow-md"
            />
          </button>
        ) : (
          <div className="relative">
            <button 
              onClick={handleCartClick}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors relative"
              aria-label="Shopping cart"
              onMouseEnter={() => setShowCartTooltip(true)}
              onMouseLeave={() => setShowCartTooltip(false)}
            >
              <div className={`absolute inset-0 rounded-full ${showCartTooltip ? 'border-2 border-[#CA3F3F] animate-pulse' : 'border-0'}`}></div>
              <ShoppingBag size={22} className="text-white" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#CA3F3F] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
            
            {showCartTooltip && (
              <div className="absolute -bottom-8 right-0 bg-[#CA3F3F] text-white text-xs py-1 px-2 rounded whitespace-nowrap animate-fade-in">
                Your Cart
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
