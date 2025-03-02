
import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";
import MenuItem from "./MenuItem";
import { MenuCategory as MenuCategoryType } from "@/data/menuData";

interface MenuCategoryProps {
  category: MenuCategoryType;
  expanded?: boolean;
  showViewAll?: boolean;
  hideHeader?: boolean;
}

const MenuCategory: React.FC<MenuCategoryProps> = ({
  category,
  expanded = false,
  showViewAll = true,
  hideHeader = false
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
      {!expanded && !hideHeader && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-3 transition-all duration-300"
        >
          <div className="text-left flex flex-col items-start">
            <h3 className="text-sm font-medium text-white tracking-wide">{category.name}</h3>
            <div className="h-0.5 bg-[#ea384c] w-16 mt-1"></div>
            {category.description && <p className="text-xs text-white/70 mt-1">{category.description}</p>}
          </div>
          
          {showViewAll && (
            <span className="text-white transition-transform duration-300">
              {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
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
              className="block text-center py-3 text-[#ea384c] font-medium bg-white/5 rounded-lg border border-[#ea384c]/30 hover:bg-white/10 transition-all transform hover:scale-[1.01] active:scale-[0.99]"
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
