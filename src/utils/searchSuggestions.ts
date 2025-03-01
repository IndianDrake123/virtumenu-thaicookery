
import { supabase } from "@/integrations/supabase/client";
import type { LucideIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'faq' | 'query';
  icon?: React.ReactNode;
  iconName?: string;
  iconColor?: string;
}

// This function converts the icon name from the database to the actual Lucide icon component
const getIconComponent = (iconName: string | null, iconColor: string | null) => {
  if (!iconName) return null;
  
  // Get the icon component from Lucide
  const IconComponent = (LucideIcons as Record<string, LucideIcon>)[iconName];
  
  if (!IconComponent) {
    console.warn(`Icon ${iconName} not found in Lucide icons`);
    return null;
  }
  
  return <IconComponent size={16} className={iconColor || ""} />;
};

// Fetch search suggestions from Supabase
export const fetchSearchSuggestions = async (): Promise<SearchSuggestion[]> => {
  try {
    const { data, error } = await supabase
      .from('search_suggestions')
      .select('*')
      .order('sort_order');
      
    if (error) {
      console.error('Error fetching search suggestions:', error);
      throw error;
    }
    
    // Map the database results to our SearchSuggestion interface
    return data.map(suggestion => ({
      id: suggestion.id.toString(),
      text: suggestion.text,
      type: suggestion.type as 'faq' | 'query',
      iconName: suggestion.icon_name,
      iconColor: suggestion.icon_color,
      icon: getIconComponent(suggestion.icon_name, suggestion.icon_color)
    }));
    
  } catch (error) {
    console.error('Error in fetchSearchSuggestions:', error);
    // Return empty array in case of error
    return [];
  }
};
