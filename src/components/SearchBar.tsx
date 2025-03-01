
import React, { useState, useRef, useEffect } from 'react';
import { X, AlertTriangle, Award, Zap, Clock, UserCheck, MessageCircle, Search } from 'lucide-react';
import { menuCategories } from '@/data/menuData';
import { trackUserInteraction } from '@/utils/analytics';
import { fetchSearchSuggestions, SearchSuggestion } from '@/utils/searchSuggestions';
import { useToast } from '@/hooks/use-toast';

interface SearchBarProps {
  onSearchResults: (results: any) => void;
  onClear: () => void;
  currentSearchQuery?: string;
  isSearchActive?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearchResults, 
  onClear, 
  currentSearchQuery = '',
  isSearchActive = false
}) => {
  const [query, setQuery] = useState('');
  const [displayQuery, setDisplayQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<'left' | 'right'>('left');
  const [placeholderVisible, setPlaceholderVisible] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [faqs, setFaqs] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  // Load suggestions from Supabase when component mounts
  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        setIsLoading(true);
        const suggestions = await fetchSearchSuggestions();
        if (suggestions.length > 0) {
          setFaqs(suggestions);
        } else {
          // Fallback to hardcoded suggestions if database fetch fails
          console.warn('Using fallback search suggestions');
          setFaqs([
            { id: 'popular', text: 'What is the most popular dish?', type: 'faq', icon: <Award size={16} className="text-amber-400" /> },
            { id: 'spicy', text: 'Show me spicy dishes', type: 'faq', icon: <Zap size={16} className="text-red-500" /> },
            { id: 'vegetarian', text: 'I am vegetarian', type: 'faq', icon: <UserCheck size={16} className="text-green-500" /> },
            { id: 'protein', text: 'Which dish has the highest protein?', type: 'faq', icon: <Award size={16} className="text-blue-500" /> },
            { id: 'gluten', text: 'Show gluten-free options', type: 'faq', icon: <AlertTriangle size={16} className="text-yellow-500" /> },
            { id: 'quick', text: 'Quick lunch options', type: 'faq', icon: <Clock size={16} className="text-cyan-500" /> },
            { id: 'spanish', text: 'Menu en español', type: 'faq', icon: <MessageCircle size={16} className="text-purple-500" /> },
          ]);
        }
      } catch (error) {
        console.error('Error loading search suggestions:', error);
        toast({
          title: "Error loading suggestions",
          description: "Using default suggestions instead",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSuggestions();
  }, [toast]);
  
  // Update displayQuery when currentSearchQuery changes
  useEffect(() => {
    if (isSearchActive && currentSearchQuery) {
      setDisplayQuery(currentSearchQuery);
    } else {
      setDisplayQuery('');
    }
  }, [isSearchActive, currentSearchQuery]);
  
  // Rotate through placeholder suggestions when not in search mode
  useEffect(() => {
    if (!isSearchActive && !isExpanded && faqs.length > 0) {
      const interval = setInterval(() => {
        // Alternate direction for each animation
        setAnimationDirection(prev => prev === 'left' ? 'right' : 'left');
        
        // Start fade out animation
        setIsAnimating(true);
        setPlaceholderVisible(false);
        
        // After fade out, change the text and fade in
        setTimeout(() => {
          setPlaceholderIndex(prev => (prev + 1) % faqs.length);
          setPlaceholderVisible(true);
          
          // Reset animation state after completing the transition
          setTimeout(() => {
            setIsAnimating(false);
          }, 600);
        }, 600);
      }, 10000); // Change every 10 seconds as requested
      
      return () => clearInterval(interval);
    }
  }, [isSearchActive, isExpanded, faqs.length]);

  // Close expanded search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (searchText: string = query || displayQuery) => {
    // If search input is empty, clear search and return to default menu
    if (!searchText.trim()) {
      clearSearch();
      return;
    }

    // Track search interaction
    trackUserInteraction('search', { query: searchText });
    
    // Process search text
    const searchLower = searchText.toLowerCase();
    let results;

    if (searchLower.includes('popular') || searchLower.includes('best seller')) {
      results = handlePopularQuery();
    } else if (searchLower.includes('spicy') || searchLower.includes('spiciest')) {
      results = handleSpicyQuery();
    } else if (searchLower.includes('vegetarian') || searchLower.includes('vegan')) {
      results = handleVegetarianQuery();
    } else if (searchLower.includes('gluten')) {
      results = handleGlutenFreeQuery();
    } else if (searchLower.includes('protein') || searchLower.includes('highest protein')) {
      results = handleProteinQuery();
    } else if (searchLower.includes('quick') || searchLower.includes('fast') || searchLower.includes('lunch')) {
      results = handleQuickOptions();
    } else if (searchLower.includes('spanish') || searchLower === 'spanish') {
      handleSpanishQuery();
      return;
    } else {
      // General text search
      results = textSearch(searchLower);
    }

    // Pass results up to parent component
    onSearchResults(results);
    
    // Clear search field
    setQuery('');
    setIsExpanded(false);
  };

  const handleFaqClick = (faq: SearchSuggestion) => {
    // Track FAQ click
    trackUserInteraction('faq_click', { faq: faq.text });
    
    setQuery(faq.text);
    handleSearch(faq.text);
  };

  const handleProteinQuery = () => {
    // Sort all menu items by protein content
    const allItems = menuCategories.flatMap(category => category.items);
    const sortedByProtein = [...allItems]
      .filter(item => item.protein !== undefined)
      .sort((a, b) => (b.protein || 0) - (a.protein || 0))
      .slice(0, 5);

    return {
      title: "Highest Protein Dishes",
      items: sortedByProtein
    };
  };

  const handleSpicyQuery = () => {
    const spicyItems = menuCategories
      .flatMap(category => category.items)
      .filter(item => item.spicy);

    return {
      title: "Spicy Dishes",
      items: spicyItems
    };
  };

  const handleVegetarianQuery = () => {
    const vegItems = menuCategories
      .flatMap(category => category.items)
      .filter(item => item.vegetarian);

    return {
      title: "Vegetarian Options",
      items: vegItems
    };
  };

  const handleGlutenFreeQuery = () => {
    const gfItems = menuCategories
      .flatMap(category => category.items)
      .filter(item => item.glutenFree);

    return {
      title: "Gluten-Free Options",
      items: gfItems
    };
  };

  const handlePopularQuery = () => {
    const popularItems = menuCategories
      .flatMap(category => category.items)
      .filter(item => item.popular);

    return {
      title: "Most Popular Dishes",
      items: popularItems
    };
  };

  const handleQuickOptions = () => {
    // Filter for items that would be quick to prepare
    const quickItems = menuCategories
      .flatMap(category => category.items)
      .filter(item => {
        const categoryId = menuCategories.find(cat => 
          cat.items.some(i => i.id === item.id)
        )?.id;
        
        return categoryId === 'starters' || 
               categoryId === 'soups' || 
               item.name.toLowerCase().includes('fried rice');
      });

    return {
      title: "Quick Lunch Options",
      items: quickItems
    };
  };

  const handleSpanishQuery = () => {
    const translations = {
      "Starters": "Entrantes",
      "Soups": "Sopas",
      "Curries": "Curry",
      "Noodles": "Fideos",
      "Rice Dishes": "Platos de Arroz",
      "Signature Specials": "Especialidades",
      "Desserts": "Postres",
      "Drinks": "Bebidas"
    };

    const spanishResponse = "¡Aquí está nuestro menú en español!\n\n" + 
      Object.entries(translations).map(([eng, spa]) => `${eng} → ${spa}`).join('\n');

    // Return empty results to show the conversation
    return {
      title: "Spanish Menu",
      items: []
    };
  };

  const textSearch = (searchText: string) => {
    const allItems = menuCategories.flatMap(category => category.items);
    const matchedItems = allItems.filter(item => 
      item.name.toLowerCase().includes(searchText) || 
      item.description.toLowerCase().includes(searchText)
    );

    return {
      title: `Search Results for "${searchText}"`,
      items: matchedItems
    };
  };

  const clearSearch = () => {
    setQuery('');
    setDisplayQuery('');
    onClear();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Always update the query state with input value
    setQuery(e.target.value);
    
    // When user starts typing in search mode, clear the display query
    if (isSearchActive) {
      setDisplayQuery('');
    }
  };

  const handleFocus = () => {
    setIsExpanded(true);
    setIsFocused(true);
  };

  return (
    <div ref={searchRef} className="relative animate-fade-in">
      <div className={`relative flex items-center transition-all duration-300 ${isFocused ? 'transform scale-[1.02]' : ''}`}>
        <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-all duration-300 ${isFocused ? 'text-[#CA3F3F]' : 'text-white'}`}>
          <Search size={22} strokeWidth={2.5} className="transition-all duration-300" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query || displayQuery}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder={
            isSearchActive && currentSearchQuery
              ? currentSearchQuery
              : faqs[placeholderIndex]?.text || "Search..."
          }
          className={`block w-full pl-10 pr-12 py-3.5 bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#CA3F3F] focus:border-transparent transition-all duration-500 shadow-lg hover:shadow-xl ${
            isFocused ? 'bg-black/80 border-[#CA3F3F]/50 shadow-[0_0_15px_rgba(202,63,63,0.15)]' : 'hover:bg-gray-800/70'
          }`}
        />
        
        {/* Animated placeholder text that transitions between suggestions */}
        {!isSearchActive && !query && !displayQuery && faqs.length > 0 && (
          <div className="absolute inset-y-0 left-0 pl-10 flex items-center pointer-events-none overflow-hidden">
            <span 
              className={`text-gray-400 transition-all duration-600 ease-in-out ${
                placeholderVisible 
                  ? 'opacity-100 transform translate-y-0' 
                  : `opacity-0 transform ${animationDirection === 'left' 
                      ? '-translate-y-8' 
                      : 'translate-y-8'}`
              }`}
            >
              {faqs[placeholderIndex]?.text}
            </span>
          </div>
        )}
        
        {(query || displayQuery) && (
          <button 
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors duration-300"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      
      {/* Expanded Search with FAQs */}
      {isExpanded && (
        <div className="absolute top-full left-0 right-0 mt-2 py-2 bg-gray-800/95 backdrop-blur-md rounded-lg shadow-xl border border-gray-700/50 z-40 max-h-96 overflow-y-auto animate-fade-in">
          {/* FAQ suggestions */}
          <div className="px-4 py-2">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Suggested searches</h3>
            
            {isLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-pulse flex space-x-2">
                  <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {faqs.map((faq) => (
                  <button
                    key={faq.id}
                    onClick={() => handleFaqClick(faq)}
                    className="text-left p-2.5 rounded-md hover:bg-gray-700 transition-colors duration-300 text-gray-300 hover:text-white flex items-center group"
                  >
                    {faq.icon && (
                      <span className="mr-2 transition-transform duration-300 group-hover:scale-110">
                        {faq.icon}
                      </span>
                    )}
                    <span>{faq.text}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
