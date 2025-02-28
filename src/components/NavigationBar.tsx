
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, UtensilsCrossed, MessageSquare, CreditCard, Settings } from "lucide-react";

const NavigationBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
    { icon: <MessageSquare size={20} />, label: "Chat", path: "/chatbot" },
    { icon: <CreditCard size={20} />, label: "Pay", path: "/payment" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] border-t border-gray-100 animate-slide-in-bottom">
      <div className="flex justify-around py-2">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigateTo(item.path)}
            className={`flex flex-col items-center py-2 px-5 rounded-lg transition-all duration-300 ${
              activeTab === item.path
                ? "text-virtumenu-800 scale-105"
                : "text-virtumenu-400 hover:text-virtumenu-600"
            }`}
          >
            {item.icon}
            <span className="text-xs mt-1 font-medium">{item.label}</span>
            {activeTab === item.path && (
              <span className="absolute bottom-1 w-1.5 h-1.5 bg-virtumenu-accent-500 rounded-full" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default NavigationBar;
