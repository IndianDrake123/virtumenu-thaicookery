
import React, { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import MenuCategory from "@/components/MenuCategory";
import SearchBar from "@/components/SearchBar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { menuCategories } from "@/data/menuData";

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState("starters");
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchResults, setSearchResults] = useState<any>(null);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      categoryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Handle search results
  const handleSearchResults = (results: any) => {
    setSearchResults(results);
  };

  // Clear search results
  const clearSearchResults = () => {
    setSearchResults(null);
  };

  // Get the current selected category
  const selectedCategory = menuCategories.find(cat => cat.id === activeCategory) || menuCategories[0];

  return (
    <Layout title="" showHeader={true}>
      <div className={`space-y-6 ${isLoaded ? "animate-fade-in" : "opacity-0"}`} style={{ backgroundColor: "#000000", color: "#FFFFFF", minHeight: "100vh" }}>
        {/* Logo in the middle */}
        <div className="flex justify-center py-4">
          <img 
            src="/lovable-uploads/200a4b3d-1a93-4c57-bd31-4fde23ab825d.png" 
            alt="Thai Cookery Logo" 
            className="h-24 w-24 rounded-full"
          />
        </div>
        
        <h1 className="text-2xl font-bold text-center text-white">Thai Cookery</h1>
        
        {/* Search Bar */}
        <div className="px-4 mb-4">
          <SearchBar onSearchResults={handleSearchResults} onClear={clearSearchResults} />
        </div>
        
        {/* Display Search Results or Normal Categories */}
        {searchResults ? (
          <div className="px-4 space-y-4">
            <div className="bg-[#CA3F3F] py-4 px-4 rounded-t-xl">
              <h2 className="text-xl font-bold text-white">Search Results</h2>
            </div>
            <div className="space-y-4">
              {searchResults.items.map((item: any) => (
                <div key={item.id} className="rounded-lg overflow-hidden bg-white/10 backdrop-blur-sm p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-white">{item.name}</h3>
                      <p className="text-sm text-gray-300 mt-1">{item.description}</p>
                    </div>
                    <div className="font-medium text-white">${item.price.toFixed(2)}</div>
                  </div>
                  
                  <div className="flex mt-2 gap-2">
                    {item.popular && <span className="badge-popular">Popular</span>}
                    {item.spicy && <span className="badge-spicy">Spicy</span>}
                    {item.vegetarian && <span className="badge-vegan">Vegetarian</span>}
                    {item.glutenFree && <span className="badge">Gluten-Free</span>}
                  </div>
                </div>
              ))}
              {searchResults.items.length === 0 && (
                <p className="text-center text-gray-400 py-4">No items found matching your search.</p>
              )}
              
              <button 
                onClick={clearSearchResults}
                className="w-full text-[#CA3F3F] bg-white/10 py-2 rounded-lg font-medium hover:bg-white/15 transition-colors"
              >
                Back to Menu
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Categories Scroll */}
            <div className="relative px-2">
              <button 
                onClick={() => scrollCategories('left')} 
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 rounded-full p-1"
                aria-label="Scroll left"
              >
                <ChevronLeft size={24} className="text-white" />
              </button>
              
              <div 
                ref={categoryScrollRef}
                className="flex overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {menuCategories.map((category) => (
                  <div 
                    key={category.id}
                    className={`flex-shrink-0 w-28 mx-2 snap-center cursor-pointer transition-all duration-300 ${
                      activeCategory === category.id ? "scale-105" : "opacity-70"
                    }`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    <div className={`aspect-square rounded-lg overflow-hidden mb-2 border-2 ${
                      activeCategory === category.id ? "border-white" : "border-transparent"
                    }`}>
                      <div className="w-full h-full flex items-center justify-center bg-[#CA3F3F] text-white">
                        {category.image ? (
                          <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-lg font-medium">{category.name.charAt(0)}</span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-center text-white font-medium truncate">{category.name}</p>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={() => scrollCategories('right')} 
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 rounded-full p-1"
                aria-label="Scroll right"
              >
                <ChevronRight size={24} className="text-white" />
              </button>
            </div>

            {/* Active Category Header */}
            <div className="bg-[#CA3F3F] py-4 px-4 rounded-t-xl">
              <h2 className="text-xl font-bold text-white">{selectedCategory.name}</h2>
              {selectedCategory.description && (
                <p className="text-white/90 text-sm">{selectedCategory.description}</p>
              )}
            </div>

            {/* Menu Items for Selected Category */}
            <div className="space-y-3 px-2 pb-10">
              <MenuCategory
                key={selectedCategory.id}
                category={selectedCategory}
                expanded={true}
                showViewAll={false}
              />
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Menu;
