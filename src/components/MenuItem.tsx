
import React, { useState } from "react";
import { Plus, Info, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";
import { MenuItem as MenuItemType } from "@/data/menuData";
import { useCart } from "@/context/CartContext";

interface MenuItemProps {
  item: MenuItemType;
  compact?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, compact = false }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // If item has required options, don't add directly
    if (item.options?.some(option => option.required)) {
      return;
    }
    
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1
    });
  };

  return (
    <div className="rounded-lg overflow-hidden bg-white/10 backdrop-blur-sm mb-4">
      <Link 
        to={`/item/${item.id}`}
        className="block text-current no-underline"
      >
        <div className="p-4 flex items-start gap-4 hover:bg-white/5 transition-all duration-300">
          {item.image && !compact && (
            <div className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className={`w-full h-full object-cover transition-all duration-500 ${
                  imageLoaded ? "" : "img-blur-in"
                }`}
                onLoad={() => setImageLoaded(true)}
              />
            </div>
          )}
          
          <div className="flex-1">
            <div className="flex justify-between">
              <div>
                <h4 className="font-medium text-white mb-1">{item.name}</h4>
                {!compact && item.description && (
                  <p className="text-sm text-gray-300 line-clamp-2">{item.description}</p>
                )}
              </div>
              <div className="flex-shrink-0 ml-2">
                <span className="font-medium text-white">${item.price.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="flex items-center mt-2 justify-between">
              <div className="flex flex-wrap gap-1.5">
                {item.popular && <span className="badge-popular">Popular</span>}
                {item.spicy && <span className="badge-spicy">Spicy</span>}
                {item.vegetarian && <span className="badge-vegan">Vegetarian</span>}
                {item.glutenFree && <span className="badge">Gluten-Free</span>}
                {item.options?.some(option => option.required) && (
                  <span className="badge">Customizable</span>
                )}
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setExpanded(!expanded);
                  }}
                  className="w-8 h-8 rounded-full bg-[#CA3F3F] text-white flex items-center justify-center hover:opacity-90 transition-colors"
                  aria-label="Show details"
                >
                  {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                
                {item.options?.some(option => option.required) ? (
                  <button
                    className="w-8 h-8 rounded-full bg-gray-600 text-white flex items-center justify-center hover:bg-gray-500 transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    aria-label="Item details"
                  >
                    <Info size={16} />
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    className="w-8 h-8 rounded-full bg-[#CA3F3F] text-white flex items-center justify-center hover:opacity-90 transition-colors"
                    aria-label="Add to cart"
                  >
                    <Plus size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
      
      {/* Expanded nutrition section */}
      {expanded && (
        <div className="bg-white/5 p-4 animate-fade-in border-t border-white/10">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h5 className="text-sm font-medium text-gray-300 mb-2">Nutrition</h5>
              <ul className="space-y-1">
                {item.protein && (
                  <li className="text-sm text-gray-300">
                    <span className="font-medium">Protein:</span> {item.protein}g
                  </li>
                )}
                {item.calories && (
                  <li className="text-sm text-gray-300">
                    <span className="font-medium">Calories:</span> {item.calories}
                  </li>
                )}
              </ul>
            </div>
            
            <div>
              <h5 className="text-sm font-medium text-gray-300 mb-2">Allergens</h5>
              {item.allergens && item.allergens.length > 0 ? (
                <ul className="flex flex-wrap gap-1">
                  {item.allergens.map((allergen, idx) => (
                    <li key={idx} className="text-xs bg-red-900/60 text-white px-2 py-1 rounded-full">
                      {allergen}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-300">No common allergens</p>
              )}
            </div>
          </div>
          
          {item.sourcing && (
            <div className="mt-3">
              <h5 className="text-sm font-medium text-gray-300 mb-1">Sourcing</h5>
              <p className="text-sm text-gray-300">{item.sourcing}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MenuItem;
