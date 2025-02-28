
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

  // Generate a story based on the dish name
  const getDishStory = () => {
    const stories = {
      'thai-spring-rolls': 'Handcrafted by our chef who learned the technique from his grandmother in Bangkok. These spring rolls quickly became a customer favorite when Thai Cookery first opened. The delicate crunch and aromatic filling represent our commitment to authentic Thai flavors.',
      'steamed-dumplings': 'Chef Somchai discovered this recipe during his travels through Northern Thailand\'s mountain villages. Brought to New York and refined over five years, these dumplings capture the essence of Thai Cookery\'s fusion of tradition and innovation.',
      'pad-thai': 'Our Pad Thai recipe was passed down through three generations of the owner\'s family in Bangkok. When Thai Cookery opened in New York, locals immediately recognized the authentic blend of sweet, sour, and umami flavors. It remains our signature dish that brings customers back again and again.',
      'green-curry': 'Our Green Curry recipe originated in the kitchen of a small Bangkok street vendor who taught our founder the perfect balance of spices. The distinctive aroma has become synonymous with Thai Cookery\'s commitment to authentic flavors. Each batch of curry paste is made fresh daily using traditional mortar and pestle methods.',
      'default': 'This dish represents Thai Cookery\'s dedication to authentic Thai cuisine with a modern New York twist. Our chef carefully sources each ingredient to ensure the perfect balance of flavors and textures. It has quickly become a customer favorite for its bold flavors and beautiful presentation.'
    };
    
    return stories[item.id as keyof typeof stories] || stories.default;
  };

  return (
    <div className="rounded-lg overflow-hidden bg-white/10 backdrop-blur-sm mb-4 transform transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg">
      <Link 
        to={`/item/${item.id}`}
        className="block text-current no-underline"
      >
        <div className="p-4 hover:bg-white/5 transition-all duration-300">
          <div className="flex justify-between items-start">
            {item.image && (
              <div className="mr-3 w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className={`w-full h-full object-cover transition-all duration-500 ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() => setImageLoaded(true)}
                />
              </div>
            )}
            
            <div className={`flex-1 ${item.image ? '' : 'w-full'}`}>
              <h4 className="font-medium text-white mb-1 text-lg">{item.name}</h4>
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
              <span className="font-medium text-white text-lg">${item.price.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </Link>
      
      <div className="flex justify-between items-center px-4 pb-3">
        <button
          onClick={toggleDetails}
          className="w-10 h-10 rounded-full bg-gray-700 text-white flex items-center justify-center hover:bg-gray-600 transition-colors transform hover:scale-105"
          aria-label="Show details"
        >
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        
        <div className="flex items-center">
          <button
            onClick={decrementQuantity}
            className="w-10 h-10 rounded-full bg-[#CA3F3F] text-white flex items-center justify-center hover:opacity-90 transition-all transform hover:scale-105"
            aria-label="Decrease quantity"
          >
            <Minus size={18} />
          </button>
          
          <span className="mx-3 font-medium text-white w-6 text-center text-lg">{quantity}</span>
          
          <button
            onClick={incrementQuantity}
            className="w-10 h-10 rounded-full bg-[#CA3F3F] text-white flex items-center justify-center hover:opacity-90 transition-all transform hover:scale-105"
            aria-label="Increase quantity"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
      
      {/* Expanded nutrition section */}
      {expanded && (
        <div className="bg-white/5 p-4 animate-fade-in border-t border-white/10">
          {/* Origin Story */}
          <div className="mb-4 p-3 bg-[#CA3F3F]/20 rounded-lg">
            <h5 className="text-sm font-medium text-white mb-2 flex items-center">
              <Info size={14} className="mr-1.5" /> Dish Story
            </h5>
            <p className="text-sm text-gray-300 italic">"{getDishStory()}"</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white/5 p-3 rounded-lg">
              <h5 className="text-sm font-medium text-white mb-2 border-b border-white/10 pb-1">Nutrition</h5>
              <ul className="space-y-2">
                {item.protein && (
                  <li className="text-sm text-gray-300 flex justify-between">
                    <span className="font-medium">Protein:</span> 
                    <span className="text-white">{item.protein}g</span>
                  </li>
                )}
                {item.calories && (
                  <li className="text-sm text-gray-300 flex justify-between">
                    <span className="font-medium">Calories:</span> 
                    <span className="text-white">{item.calories}</span>
                  </li>
                )}
                <li className="text-sm text-gray-300 flex justify-between">
                  <span className="font-medium">Carbs:</span> 
                  <span className="text-white">{Math.round(item.calories ? item.calories * 0.4 / 4 : 30)}g</span>
                </li>
                <li className="text-sm text-gray-300 flex justify-between">
                  <span className="font-medium">Fat:</span> 
                  <span className="text-white">{Math.round(item.calories ? item.calories * 0.3 / 9 : 15)}g</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white/5 p-3 rounded-lg">
              <h5 className="text-sm font-medium text-white mb-2 border-b border-white/10 pb-1">Allergens</h5>
              {item.allergens && item.allergens.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {item.allergens.map((allergen, idx) => (
                    <span key={idx} className="text-xs bg-red-900/60 text-white px-2 py-1 rounded-full">
                      {allergen}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-300">No common allergens</p>
              )}
              
              <div className="mt-2">
                <p className="text-xs text-gray-400">Allergy Risk: {item.allergens && item.allergens.length > 2 ? 'High' : item.allergens && item.allergens.length > 0 ? 'Medium' : 'Low'}</p>
              </div>
            </div>
          </div>
          
          {item.sourcing && (
            <div className="mb-4 bg-white/5 p-3 rounded-lg">
              <h5 className="text-sm font-medium text-white mb-1 border-b border-white/10 pb-1">Sourcing</h5>
              <p className="text-sm text-gray-300">{item.sourcing}</p>
            </div>
          )}
          
          <div className="mt-4">
            <button
              onClick={handleAddToCart}
              className="w-full py-3 rounded-lg bg-[#CA3F3F] text-white font-medium hover:opacity-90 transition-all flex items-center justify-center transform hover:scale-[1.02] active:scale-[0.98]"
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
