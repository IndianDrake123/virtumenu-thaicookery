
import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
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
  const [placeholderText, setPlaceholderText] = useState("Search menu...");
  const [placeholderAnimating, setPlaceholderAnimating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Fetch suggestions from Supabase - ensure we're getting unique values
  const { suggestions: faqs, loading: suggestionsLoading, error: suggestionsError } = useSearchSuggestions();
  
  // Ensure we have unique suggestions by using a Set with the text as the key
  const uniqueFaqs = faqs ? Array.from(
    new Map(faqs.map(item => [item.text, item])).values()
  ) : [];

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

  // Cycle through FAQs for placeholder text
  useEffect(() => {
    if (!uniqueFaqs || uniqueFaqs.length === 0) return;
    
    let currentIndex = 0;
    
    const cycleTexts = () => {
      if (uniqueFaqs.length === 0) return;
      
      setPlaceholderAnimating(true);
      setTimeout(() => {
        setPlaceholderText(uniqueFaqs[currentIndex].text);
        setPlaceholderAnimating(false);
        
        currentIndex = (currentIndex + 1) % uniqueFaqs.length;
      }, 500);
    };
    
    // Set initial placeholder text
    if (uniqueFaqs.length > 0) {
      setPlaceholderText(uniqueFaqs[0].text);
    }
    
    const interval = setInterval(cycleTexts, 5000);
    
    return () => {
      clearInterval(interval);
    };
  }, [uniqueFaqs]);

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
    setShowSuggestions(true); // Show suggestions immediately on focus
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
      setShowSuggestions(true); // Show suggestions immediately when clicking search
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
          placeholder={placeholderText}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.length > 0) {
              setShowSuggestions(true);
            } else {
              setShowSuggestions(true); // Keep suggestions visible even when input is empty
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
          } ${placeholderAnimating ? "animate-placeholder-fade" : ""}`}
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
      
      {/* Search Suggestions Panel - Only show Suggested Searches */}
      {showSuggestions && (
        <div 
          ref={suggestionsRef}
          className="absolute z-20 mt-1 w-full bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl overflow-hidden animate-in fade-in duration-300"
        >
          {/* Show unique FAQs and search suggestions */}
          {uniqueFaqs && uniqueFaqs.length > 0 && (
            <div className="border-t border-white/5">
              <div className="p-4">
                <h3 className="text-gray-400 text-xs font-medium mb-2">
                  SUGGESTED SEARCHES
                </h3>
                <div className="space-y-2">
                  {uniqueFaqs.map((faq) => (
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
