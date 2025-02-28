
import React, { useState } from "react";
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
  // Display only 3 items if not expanded and showViewAll is true
  const displayItems = isOpen || !showViewAll ? category.items : category.items.slice(0, 3);

  return (
    <div className="mb-6">
      {!expanded && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between rounded-t-xl bg-[#CA3F3F] p-4 transition-all duration-300"
        >
          <div className="text-left">
            <h3 className="text-lg font-semibold text-white">{category.name}</h3>
            {category.description && <p className="text-sm text-white/80 mt-1">{category.description}</p>}
          </div>
          
          {showViewAll && (
            <span className="text-white transition-transform duration-300">
              {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </span>
          )}
        </button>
      )}
      
      {(isOpen || !showViewAll) && (
        <div className="mt-2 space-y-3 animate-fade-in">
          {displayItems.map(item => (
            <MenuItem key={item.id} item={item} />
          ))}
          
          {!isOpen && showViewAll && category.items.length > 3 && (
            <Link to={`/category/${category.id}`} className="block text-center py-3 text-[#CA3F3F] font-medium bg-white/10 rounded-lg">
              View all {category.items.length} items
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default MenuCategory;
