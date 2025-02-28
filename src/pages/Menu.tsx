
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
        <div className="flex justify-center py-4 animate-fade-in">
          <img 
            src="/lovable-uploads/200a4b3d-1a93-4c57-bd31-4fde23ab825d.png" 
            alt="Thai Cookery Logo" 
            className="h-24 w-24 rounded-full shadow-lg animate-pulse-subtle"
          />
        </div>
        
        <h1 className="text-2xl font-bold text-center text-white animate-fade-in" style={{ animationDelay: "100ms" }}>Thai Cookery</h1>
        
        {/* Search Bar */}
        <div className="px-4 mb-4 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <SearchBar onSearchResults={handleSearchResults} onClear={clearSearchResults} />
        </div>
        
        {/* Display Search Results or Normal Categories */}
        {searchResults ? (
          <div className="px-4 space-y-4 animate-fade-in">
            <div className="bg-[#CA3F3F] py-4 px-4 rounded-t-xl">
              <h2 className="text-xl font-bold text-white">{searchResults.title || "Search Results"}</h2>
            </div>
            <div className="space-y-4">
              {searchResults.items.map((item: any, index: number) => (
                <div 
                  key={item.id} 
                  className="animate-fade-in" 
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <MenuItem item={item} />
                </div>
              ))}
              {searchResults.items.length === 0 && (
                <p className="text-center text-gray-400 py-4">No items found matching your search.</p>
              )}
              
              <button 
                onClick={clearSearchResults}
                className="w-full text-[#CA3F3F] bg-white/10 py-3 rounded-lg font-medium hover:bg-white/15 transition-colors border border-[#CA3F3F]/20"
              >
                Back to Menu
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Categories Scroll */}
            <div className="relative px-2 animate-fade-in" style={{ animationDelay: "300ms" }}>
              <button 
                onClick={() => scrollCategories('left')} 
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/70 rounded-full p-1.5 shadow-lg hover:bg-black/90 transition-all"
                aria-label="Scroll left"
              >
                <ChevronLeft size={24} className="text-white" />
              </button>
              
              <div 
                ref={categoryScrollRef}
                className="flex overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {menuCategories.map((category, index) => (
                  <div 
                    key={category.id}
                    className={`flex-shrink-0 w-28 mx-2 snap-center cursor-pointer transition-all duration-300 ${
                      activeCategory === category.id ? "scale-105" : "opacity-70 hover:opacity-100"
                    }`}
                    onClick={() => setActiveCategory(category.id)}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className={`aspect-square rounded-lg overflow-hidden mb-2 border-2 shadow-md transform transition-all duration-300 ${
                      activeCategory === category.id 
                        ? "border-white scale-105" 
                        : "border-transparent hover:border-white/50"
                    }`}>
                      <div className="w-full h-full flex items-center justify-center bg-[#CA3F3F] text-white overflow-hidden">
                        {category.image ? (
                          <img 
                            src={category.image} 
                            alt={category.name} 
                            className={`w-full h-full object-cover transition-all duration-500 ${
                              activeCategory === category.id ? "scale-110" : "scale-100"
                            }`} 
                          />
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
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/70 rounded-full p-1.5 shadow-lg hover:bg-black/90 transition-all"
                aria-label="Scroll right"
              >
                <ChevronRight size={24} className="text-white" />
              </button>
            </div>

            {/* Active Category Header */}
            <div className="bg-[#CA3F3F] py-4 px-4 rounded-t-xl shadow-md animate-fade-in" style={{ animationDelay: "400ms" }}>
              <h2 className="text-xl font-bold text-white">{selectedCategory.name}</h2>
              {selectedCategory.description && (
                <p className="text-white/90 text-sm">{selectedCategory.description}</p>
              )}
            </div>

            {/* Menu Items for Selected Category */}
            <div className="space-y-3 px-2 pb-10 animate-fade-in" style={{ animationDelay: "500ms" }}>
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
