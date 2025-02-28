
import React, { useState, useEffect } from "react";
import { ArrowLeft, ShoppingBag, Search } from "lucide-react";
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
  const [headerTitle, setHeaderTitle] = useState(title || "BCD Tofu House");

  useEffect(() => {
    if (!title) {
      if (location.pathname === "/") {
        setHeaderTitle("BCD Tofu House");
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
          ? "bg-white bg-opacity-90 backdrop-blur-md shadow-sm" 
          : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {showBackButton && location.pathname !== "/" && (
            <button 
              onClick={handleBack}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft size={22} className="text-gray-800" />
            </button>
          )}
          
          <h1 className="text-xl font-semibold text-gray-900">{headerTitle}</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Search"
          >
            <Search size={22} className="text-gray-800" />
          </button>
          
          <button 
            onClick={handleCartClick}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
            aria-label="Shopping cart"
          >
            <ShoppingBag size={22} className="text-gray-800" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
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
