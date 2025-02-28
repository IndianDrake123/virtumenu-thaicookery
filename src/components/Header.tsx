
import React, { useState, useEffect } from "react";
import { Menu, Search, ChevronLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isHome, setIsHome] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [headerTitle, setHeaderTitle] = useState(title || "VirtuMenu");

  useEffect(() => {
    setIsHome(location.pathname === "/");
    
    if (location.pathname === "/") {
      setHeaderTitle("VirtuMenu");
    } else if (!title) {
      const path = location.pathname.substring(1);
      setHeaderTitle(path.charAt(0).toUpperCase() + path.slice(1));
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

  return (
    <header 
      className={`sticky top-0 z-40 px-4 py-4 transition-all duration-300 ${
        isScrolled 
          ? "bg-white bg-opacity-80 backdrop-blur-md shadow-sm" 
          : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {!isHome ? (
            <button 
              onClick={handleBack}
              className="p-2 rounded-full hover:bg-virtumenu-100 transition-colors"
            >
              <ChevronLeft size={24} className="text-virtumenu-800" />
            </button>
          ) : (
            <button className="p-2 rounded-full hover:bg-virtumenu-100 transition-colors">
              <Menu size={24} className="text-virtumenu-800" />
            </button>
          )}
          
          <h1 className="text-xl font-semibold text-virtumenu-900">{headerTitle}</h1>
        </div>
        
        <button className="p-2 rounded-full hover:bg-virtumenu-100 transition-colors">
          <Search size={24} className="text-virtumenu-800" />
        </button>
      </div>
    </header>
  );
};

export default Header;
