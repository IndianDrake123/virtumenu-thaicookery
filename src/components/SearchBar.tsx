import React, { useState, useEffect, useRef } from "react";
import { Search, X, Clock, Flame, Star } from "lucide-react";
import { useSearchSuggestions } from "@/utils/searchSuggestions";
import { searchMenuItems } from "@/services/menuService";
import { trackUserInteraction } from "@/utils/analytics";

interface SearchBarProps {
  onSearchResults: (results: any) => void;
  onClear: () => void;
  currentSearchQuery?: string;
  isSearchActive?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearchResults, 
  onClear, 
  currentSearchQuery = "",
  isSearchActive = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState(currentSearchQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Fetch suggestions from Supabase
  const { suggestions: faqs, loading: suggestionsLoading, error: suggestionsError } = useSearchSuggestions();

  // Set query from prop if changed externally
  useEffect(() => {
    setQuery(currentSearchQuery);
  }, [currentSearchQuery]);

  // Auto focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFocus = () => {
    setIsExpanded(true);
    if (query.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleClear = () => {
    setQuery("");
    setIsExpanded(false);
    setShowSuggestions(false);
    onClear();
    
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const handleSearchClick = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } else if (query.trim()) {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
    
    // Track suggestion click
    trackUserInteraction('search_suggestion_click', { suggestion });
  };

  const handleSearch = async (searchQuery?: string) => {
    const finalQuery = searchQuery || query;
    if (!finalQuery.trim()) return;
    
    setShowSuggestions(false);
    
    try {
      // Use the new search function from menuService
      const results = await searchMenuItems(finalQuery);
      
      onSearchResults({
        title: `Search Results for "${finalQuery}"`,
        items: results
      });
      
      // Track search
      trackUserInteraction('search', { query: finalQuery, resultsCount: results.length });
    } catch (error) {
      console.error("Search error:", error);
      onSearchResults({
        title: `Search Results for "${finalQuery}"`,
        items: []
      });
    }
  };

  const recentSearches = [
    "Pad Thai", 
    "Curry", 
    "Vegetarian", 
    "Spicy"
  ];

  return (
    <div className="relative w-full">
      <div 
        className={`flex items-center bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-3 py-2 transition-all duration-300 shadow-sm ${
          isExpanded ? "shadow" : ""
        }`}
      >
        <button 
          onClick={handleSearchClick} 
          className="text-gray-400 hover:text-white transition-colors"
          aria-label="Search"
        >
          <Search size={20} />
        </button>
        
        <input
          ref={inputRef}
          type="text"
          placeholder="Search menu..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.length > 0) {
              setShowSuggestions(true);
            } else {
              setShowSuggestions(false);
            }
          }}
          onFocus={handleFocus}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          className={`bg-transparent border-none focus:outline-none text-white placeholder-gray-500 text-sm flex-grow transition-all duration-300 ${
            isExpanded ? "px-3 w-full" : "px-1 w-0"
          }`}
        />
        
        {isExpanded && query && (
          <button 
            onClick={handleClear} 
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>
      
      {/* Search Suggestions Panel */}
      {showSuggestions && (
        <div 
          ref={suggestionsRef}
          className="absolute z-20 mt-1 w-full bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl overflow-hidden animate-in fade-in duration-300"
        >
          {/* Recent searches */}
          <div className="p-4">
            <h3 className="text-gray-400 text-xs font-medium mb-2 flex items-center">
              <Clock size={14} className="mr-1" />
              RECENT SEARCHES
            </h3>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(search)}
                  className="text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full text-sm transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
          
          {/* Popular and suggestions */}
          <div className="border-t border-white/5">
            <div className="p-4">
              <h3 className="text-gray-400 text-xs font-medium mb-2 flex items-center">
                <Flame size={14} className="mr-1" />
                POPULAR DISHES
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleSuggestionClick("Green Curry")}
                  className="w-full text-left text-white hover:bg-white/5 p-2 rounded flex items-center transition-colors"
                >
                  <Star className="text-yellow-500 mr-2" size={16} />
                  Green Curry
                </button>
                <button
                  onClick={() => handleSuggestionClick("Pad Thai")}
                  className="w-full text-left text-white hover:bg-white/5 p-2 rounded flex items-center transition-colors"
                >
                  <Star className="text-yellow-500 mr-2" size={16} />
                  Pad Thai
                </button>
                <button
                  onClick={() => handleSuggestionClick("Thai Spring Rolls")}
                  className="w-full text-left text-white hover:bg-white/5 p-2 rounded flex items-center transition-colors"
                >
                  <Star className="text-yellow-500 mr-2" size={16} />
                  Thai Spring Rolls
                </button>
              </div>
            </div>
          </div>
          
          {/* FAQs and search suggestions */}
          {faqs && faqs.length > 0 && (
            <div className="border-t border-white/5">
              <div className="p-4">
                <h3 className="text-gray-400 text-xs font-medium mb-2">
                  SUGGESTED SEARCHES
                </h3>
                <div className="space-y-2">
                  {faqs.map((faq) => (
                    <button
                      key={faq.id}
                      onClick={() => handleSuggestionClick(faq.text)}
                      className="w-full text-left text-white hover:bg-white/5 p-2 rounded flex items-center transition-colors"
                    >
                      {faq.icon && (
                        <span className="mr-2">{faq.icon}</span>
                      )}
                      {faq.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
