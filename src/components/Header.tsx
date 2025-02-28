
import React, { useState, useEffect } from "react";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton = true }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
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
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  return (
    <header 
      className={`sticky top-0 z-40 px-4 py-4 transition-all duration-300 ${
        isScrolled 
          ? "bg-black bg-opacity-90 backdrop-blur-md" 
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
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleCartClick}
            className="p-2 rounded-full hover:bg-gray-800 transition-colors relative"
            aria-label="Shopping cart"
          >
            <ShoppingBag size={22} className="text-white" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#CA3F3F] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
