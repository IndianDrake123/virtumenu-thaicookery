
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

  return (
    <Layout title="Item Details" showHeader={true}>
      <div className={`space-y-6 pb-24 ${isLoaded ? "animate-fade-in" : "opacity-0"}`}>
        {/* Item Image */}
        {item.image && (
          <div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
            <img 
              src={item.image} 
              alt={item.name} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {/* Item Info */}
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-gray-900">{item.name}</h1>
          <p className="text-gray-600">{item.description}</p>
          <div className="flex items-center space-x-2 mt-1">
            {item.popular && <span className="badge-popular">Popular</span>}
            {item.spicy && <span className="badge-spicy">Spicy</span>}
            {item.vegetarian && <span className="badge-vegan">Vegetarian</span>}
            {item.glutenFree && <span className="badge">Gluten-Free</span>}
          </div>
          <p className="text-lg font-medium text-gray-900">${item.price.toFixed(2)}</p>
        </div>
        
        {/* Options */}
        {item.options && item.options.length > 0 && (
          <div className="space-y-4">
            {item.options.map((option, idx) => (
              <div key={idx} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">{option.name}</h3>
                  {option.required && (
                    <span className="badge">Required</span>
                  )}
                </div>
                
                <div className="space-y-2">
                  {option.choices.map((choice, choiceIdx) => (
                    <button
                      key={choiceIdx}
                      onClick={() => handleOptionChange(option.name, choice.name, choice.price)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg border ${
                        selectedOptions[option.name]?.choice === choice.name
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-5 h-5 flex items-center justify-center rounded-full mr-3 ${
                          selectedOptions[option.name]?.choice === choice.name
                            ? "bg-primary text-white"
                            : "bg-gray-100"
                        }`}>
                          {selectedOptions[option.name]?.choice === choice.name && (
                            <Check size={12} />
                          )}
                        </div>
                        <span className="text-gray-800">{choice.name}</span>
                      </div>
                      {choice.price && <span className="text-gray-600">+${choice.price.toFixed(2)}</span>}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Special Instructions */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-medium text-gray-900 mb-2">Special Instructions</h3>
          <Textarea
            placeholder="Add notes (e.g. allergies, spice preference, etc.)"
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            className="w-full mt-1"
          />
        </div>
        
        {/* Quantity */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-medium text-gray-900 mb-2">Quantity</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600"
                disabled={quantity <= 1}
              >
                <Minus size={16} />
              </button>
              <span className="mx-4 font-medium text-gray-800 w-4 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600"
              >
                <Plus size={16} />
              </button>
            </div>
            <p className="font-medium text-gray-900">${totalPrice.toFixed(2)}</p>
          </div>
        </div>
      </div>
      
      {/* Add to Cart Button */}
      <div className="fixed bottom-16 left-0 right-0 p-4 bg-white border-t border-gray-100">
        <Button 
          onClick={handleAddToCart}
          className="w-full py-6 text-white text-lg font-medium rounded-xl bg-primary hover:opacity-90"
        >
          Add {quantity} to Cart · ${totalPrice.toFixed(2)}
        </Button>
      </div>
    </Layout>
  );
};

export default ItemDetail;
