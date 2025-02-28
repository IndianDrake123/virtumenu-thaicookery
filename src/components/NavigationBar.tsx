
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, UtensilsCrossed, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

const NavigationBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const [activeTab, setActiveTab] = useState("/");

  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location]);

  const navigateTo = (path: string) => {
    navigate(path);
  };

  const navItems = [
    { icon: <Home size={20} />, label: "Home", path: "/" },
    { icon: <UtensilsCrossed size={20} />, label: "Menu", path: "/menu" },
    { 
      icon: (
        <div className="relative">
          <ShoppingBag size={20} />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#CA3F3F] text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {itemCount > 9 ? '9+' : itemCount}
            </span>
          )}
        </div>
      ), 
      label: "Cart", 
      path: "/cart" 
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-black shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3)] border-t border-gray-800 animate-slide-in-bottom">
      <div className="flex justify-around py-2">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigateTo(item.path)}
            className={`flex flex-col items-center py-2 px-5 rounded-lg transition-all duration-300 ${
              activeTab === item.path
                ? "text-[#CA3F3F] scale-105"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            {item.icon}
            <span className="text-xs mt-1 font-medium">{item.label}</span>
            {activeTab === item.path && (
              <span className="absolute bottom-1 w-1.5 h-1.5 bg-[#CA3F3F] rounded-full" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default NavigationBar;
