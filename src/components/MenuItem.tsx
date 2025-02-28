
import React, { useState } from "react";
import { Plus, Minus, Info, ChevronDown, ChevronUp } from "lucide-react";
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
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // If item has required options, navigate to the item details
    if (item.options?.some(option => option.required)) {
      window.location.href = `/item/${item.id}`;
      return;
    }
    
    // Add to cart with current quantity
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: quantity
    });
    
    // Reset quantity after adding
    setQuantity(1);
  };

  const incrementQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuantity(prev => prev + 1);
  };
  
  const decrementQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const toggleDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpanded(!expanded);
  };

  return (
    <div className="rounded-lg overflow-hidden bg-white/10 backdrop-blur-sm mb-4">
      <Link 
        to={`/item/${item.id}`}
        className="block text-current no-underline"
      >
        <div className="p-4 hover:bg-white/5 transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium text-white mb-1">{item.name}</h4>
              {item.description && (
                <p className="text-sm text-gray-300 line-clamp-2">{item.description}</p>
              )}
              
              <div className="flex flex-wrap gap-1.5 mt-2">
                {item.popular && <span className="badge-popular">Popular</span>}
                {item.spicy && <span className="badge-spicy">Spicy</span>}
                {item.vegetarian && <span className="badge-vegan">Vegetarian</span>}
                {item.glutenFree && <span className="badge">Gluten-Free</span>}
              </div>
            </div>
            <div className="flex-shrink-0 ml-2">
              <span className="font-medium text-white">${item.price.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </Link>
      
      <div className="flex justify-between items-center px-4 pb-3">
        <button
          onClick={toggleDetails}
          className="w-8 h-8 rounded-full bg-gray-700 text-white flex items-center justify-center hover:bg-gray-600 transition-colors"
          aria-label="Show details"
        >
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        
        <div className="flex items-center">
          <button
            onClick={decrementQuantity}
            className="w-8 h-8 rounded-full bg-[#CA3F3F] text-white flex items-center justify-center hover:opacity-90 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus size={16} />
          </button>
          
          <span className="mx-2 font-medium text-white w-6 text-center">{quantity}</span>
          
          <button
            onClick={incrementQuantity}
            className="w-8 h-8 rounded-full bg-[#CA3F3F] text-white flex items-center justify-center hover:opacity-90 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
      
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
          
          <div className="mt-4">
            <button
              onClick={handleAddToCart}
              className="w-full py-2 rounded-lg bg-[#CA3F3F] text-white font-medium hover:opacity-90 transition-colors flex items-center justify-center"
            >
              Add {quantity} to cart · ${(item.price * quantity).toFixed(2)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuItem;
