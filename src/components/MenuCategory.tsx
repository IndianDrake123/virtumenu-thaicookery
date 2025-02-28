
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface MenuCategoryProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const MenuCategory: React.FC<MenuCategoryProps> = ({
  title,
  description,
  children,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between rounded-xl bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md"
      >
        <div className="text-left">
          <h3 className="text-lg font-semibold text-virtumenu-900">{title}</h3>
          {description && <p className="text-sm text-virtumenu-500 mt-1">{description}</p>}
        </div>
        
        <span className="text-virtumenu-400 transition-transform duration-300">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </span>
      </button>
      
      {isOpen && (
        <div className="mt-3 space-y-3 animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
};

export default MenuCategory;
