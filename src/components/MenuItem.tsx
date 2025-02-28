
import React, { useState } from "react";
import { Plus, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { MenuItem as MenuItemType } from "@/data/menuData";
import { useCart } from "@/context/CartContext";

interface MenuItemProps {
  item: MenuItemType;
  compact?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, compact = false }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
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
    <Link 
      to={`/item/${item.id}`}
      className="block text-current no-underline"
    >
      <div className="menu-card p-4 flex items-start gap-4 hover:translate-y-[-2px] transition-all duration-300">
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
              <h4 className="font-medium text-gray-900 mb-1">{item.name}</h4>
              {!compact && item.description && (
                <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
              )}
            </div>
            <div className="flex-shrink-0 ml-2">
              <span className="font-medium text-gray-800">${item.price.toFixed(2)}</span>
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
              {item.options?.some(option => option.required) ? (
                <button
                  className="w-8 h-8 rounded-full bg-gray-200 text-gray-800 flex items-center justify-center hover:bg-gray-300 transition-colors"
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
                  className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:opacity-90 transition-colors"
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
  );
};

export default MenuItem;
