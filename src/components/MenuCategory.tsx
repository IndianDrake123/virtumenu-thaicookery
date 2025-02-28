
import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";
import MenuItem from "./MenuItem";
import { MenuCategory as MenuCategoryType } from "@/data/menuData";

interface MenuCategoryProps {
  category: MenuCategoryType;
  expanded?: boolean;
  showViewAll?: boolean;
}

const MenuCategory: React.FC<MenuCategoryProps> = ({
  category,
  expanded = false,
  showViewAll = true
}) => {
  const [isOpen, setIsOpen] = useState(expanded);
  const [itemsVisible, setItemsVisible] = useState(expanded);
  
  // Display only 3 items if not expanded and showViewAll is true
  const displayItems = isOpen || !showViewAll ? category.items : category.items.slice(0, 3);

  // Handle animation timing for items
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (isOpen) {
      setItemsVisible(true);
    } else {
      timeout = setTimeout(() => {
        setItemsVisible(false);
      }, 300); // Match this to your animation duration
    }
    
    return () => clearTimeout(timeout);
  }, [isOpen]);

  return (
    <div className="mb-6">
      {!expanded && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between rounded-t-xl bg-[#CA3F3F] p-4 transition-all duration-300 ${
            isOpen ? "shadow-lg" : ""
          }`}
        >
          <div className="text-left flex items-center">
            {category.image && (
              <div className="w-12 h-12 rounded-lg overflow-hidden mr-3 border border-white/20">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-white">{category.name}</h3>
              {category.description && <p className="text-sm text-white/80 mt-1">{category.description}</p>}
            </div>
          </div>
          
          {showViewAll && (
            <span className="text-white transition-transform duration-300">
              {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </span>
          )}
        </button>
      )}
      
      {(itemsVisible) && (
        <div className={`mt-2 space-y-3 ${isOpen ? "animate-fade-in" : "animate-fade-out"}`}>
          {displayItems.map((item, index) => (
            <div 
              key={item.id} 
              className={`transition-all duration-300 transform ${
                isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
              }`}
              style={{ 
                transitionDelay: `${index * 100}ms`,
                animationDelay: `${index * 100}ms` 
              }}
            >
              <MenuItem item={item} />
            </div>
          ))}
          
          {!isOpen && showViewAll && category.items.length > 3 && (
            <Link 
              to={`/category/${category.id}`} 
              className="block text-center py-3 text-[#CA3F3F] font-medium bg-white/10 rounded-lg border border-[#CA3F3F]/30 hover:bg-white/15 transition-all transform hover:scale-[1.01] active:scale-[0.99]"
            >
              View all {category.items.length} items
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default MenuCategory;
