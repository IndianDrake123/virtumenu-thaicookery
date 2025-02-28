
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { menuCategories } from "@/data/menuData";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Info, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

const ItemDetail = () => {
  const { id } = useParams<{id: string}>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [isLoaded, setIsLoaded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<Record<string, {choice: string, price?: number}>>({});
  
  // Find the item across all categories
  const item = menuCategories.flatMap(c => c.items).find(i => i.id === id);
  
  useEffect(() => {
    if (!item) {
      navigate('/');
      return;
    }
    
    // Set default options for required choices
    if (item.options) {
      const defaultSelections = item.options.reduce((acc, option) => {
        if (option.required && option.choices.length > 0) {
          acc[option.name] = {
            choice: option.choices[0].name,
            price: option.choices[0].price
          };
        }
        return acc;
      }, {} as Record<string, {choice: string, price?: number}>);
      
      setSelectedOptions(defaultSelections);
    }
    
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [item, navigate]);
  
  if (!item) return null;

  const handleOptionChange = (optionName: string, choiceName: string, price?: number) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: {
        choice: choiceName,
        price
      }
    }));
  };

  const handleAddToCart = () => {
    const options = Object.entries(selectedOptions).map(([name, { choice, price }]) => ({
      name,
      choice,
      price
    }));
    
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity,
      options,
      specialInstructions: specialInstructions || undefined
    });
    
    toast({
      title: "Added to cart",
      description: `${quantity} × ${item.name} added to your cart`,
    });
    
    navigate(-1);
  };

  // Calculate total price including options
  const optionsTotal = Object.values(selectedOptions).reduce((sum, { price }) => sum + (price || 0), 0);
  const totalPrice = (item.price + optionsTotal) * quantity;

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
    <Layout title="" showHeader={true}>
      <div className={`space-y-6 pb-24 ${isLoaded ? "animate-fade-in" : "opacity-0"}`}>
        {/* Item Image */}
        <div className="relative">
          <div className="aspect-video h-[300px] overflow-hidden bg-gray-900">
            <img 
              src={item.image || "/lovable-uploads/973e961b-2c3d-4553-ac5c-ba9a8b3182f8.png"} 
              alt={item.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h1 className="text-3xl font-bold shadow-text">{item.name}</h1>
            <div className="flex items-center space-x-2 mt-2">
              {item.popular && <span className="badge-popular">Popular</span>}
              {item.spicy && <span className="badge-spicy">Spicy</span>}
              {item.vegetarian && <span className="badge-vegan">Vegetarian</span>}
              {item.glutenFree && <span className="badge">Gluten-Free</span>}
            </div>
          </div>
          
          <div className="absolute top-4 right-4 bg-[#CA3F3F] text-white px-3 py-1.5 rounded-full font-bold shadow-lg">
            ${item.price.toFixed(2)}
          </div>
        </div>
        
        {/* Item Info */}
        <div className="space-y-3 px-4">
          <p className="text-gray-300 leading-relaxed">{item.description}</p>
          
          {/* Story Card */}
          <div className="bg-[#CA3F3F]/20 p-4 rounded-lg border border-[#CA3F3F]/30 mt-4">
            <h3 className="flex items-center text-white font-medium mb-2">
              <Info size={18} className="mr-2" /> Our Story
            </h3>
            <p className="text-gray-300 italic text-sm leading-relaxed">{getDishStory()}</p>
          </div>
          
          {/* Nutrition and Allergens */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
              <h3 className="text-white font-medium mb-2 border-b border-white/10 pb-1">Nutrition</h3>
              <ul className="space-y-2 text-sm">
                {item.protein && (
                  <li className="flex justify-between text-gray-300">
                    <span>Protein</span>
                    <span className="text-white font-medium">{item.protein}g</span>
                  </li>
                )}
                {item.calories && (
                  <li className="flex justify-between text-gray-300">
                    <span>Calories</span>
                    <span className="text-white font-medium">{item.calories}</span>
                  </li>
                )}
                <li className="flex justify-between text-gray-300">
                  <span>Carbs</span>
                  <span className="text-white font-medium">{Math.round(item.calories ? item.calories * 0.4 / 4 : 30)}g</span>
                </li>
                <li className="flex justify-between text-gray-300">
                  <span>Fat</span>
                  <span className="text-white font-medium">{Math.round(item.calories ? item.calories * 0.3 / 9 : 15)}g</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
              <h3 className="text-white font-medium mb-2 border-b border-white/10 pb-1">Allergens</h3>
              {item.allergens && item.allergens.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {item.allergens.map((allergen, idx) => (
                    <span key={idx} className="text-xs bg-red-900/60 text-white px-2 py-1 rounded-full">
                      {allergen}
                    </span>
                  ))}
                  <p className="w-full mt-2 text-xs text-gray-400">
                    Allergy Risk: {item.allergens.length > 2 ? 'High' : 'Medium'}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-300">No common allergens</p>
                  <p className="mt-2 text-xs text-gray-400">Allergy Risk: Low</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Sourcing */}
          {item.sourcing && (
            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
              <h3 className="text-white font-medium mb-2 border-b border-white/10 pb-1">Sourcing</h3>
              <p className="text-sm text-gray-300 leading-relaxed">{item.sourcing}</p>
            </div>
          )}
        </div>
        
        {/* Options */}
        {item.options && item.options.length > 0 && (
          <div className="space-y-4 px-4">
            <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">Customize</h2>
            {item.options.map((option, idx) => (
              <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/10 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-white">{option.name}</h3>
                  {option.required && (
                    <span className="badge bg-[#CA3F3F]/80 text-white">Required</span>
                  )}
                </div>
                
                <div className="space-y-2">
                  {option.choices.map((choice, choiceIdx) => (
                    <button
                      key={choiceIdx}
                      onClick={() => handleOptionChange(option.name, choice.name, choice.price)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                        selectedOptions[option.name]?.choice === choice.name
                          ? "border-[#CA3F3F] bg-[#CA3F3F]/10"
                          : "border-gray-700 hover:border-gray-600"
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-5 h-5 flex items-center justify-center rounded-full mr-3 ${
                          selectedOptions[option.name]?.choice === choice.name
                            ? "bg-[#CA3F3F] text-white"
                            : "bg-gray-700"
                        }`}>
                          {selectedOptions[option.name]?.choice === choice.name && (
                            <Check size={12} />
                          )}
                        </div>
                        <span className="text-white">{choice.name}</span>
                      </div>
                      {choice.price && <span className="text-gray-300">+${choice.price.toFixed(2)}</span>}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Special Instructions */}
        <div className="px-4">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 shadow-sm">
            <h3 className="font-medium text-white mb-2 border-b border-white/10 pb-1">Special Instructions</h3>
            <Textarea
              placeholder="Add notes (e.g. allergies, spice preference, etc.)"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full mt-2 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
            />
          </div>
        </div>
        
        {/* Quantity */}
        <div className="px-4">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 shadow-sm">
            <h3 className="font-medium text-white mb-3 border-b border-white/10 pb-1">Quantity</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center bg-black/30 rounded-lg p-1.5">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-[#CA3F3F] text-white hover:opacity-90 disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  <Minus size={18} />
                </button>
                <span className="mx-6 font-medium text-white text-xl">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-[#CA3F3F] text-white hover:opacity-90"
                >
                  <Plus size={18} />
                </button>
              </div>
              <p className="font-bold text-xl text-white">${totalPrice.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add to Cart Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-black border-t border-white/10 backdrop-blur-md">
        <Button 
          onClick={handleAddToCart}
          className="w-full py-6 text-white text-lg font-bold rounded-xl bg-[#CA3F3F] hover:opacity-90 shadow-lg transition-all"
        >
          Add {quantity} to Cart · ${totalPrice.toFixed(2)}
        </Button>
      </div>
    </Layout>
  );
};

export default ItemDetail;
