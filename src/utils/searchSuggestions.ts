
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import React, { useState, useEffect } from "react";
import * as LucideIcons from "lucide-react";

export type SearchSuggestion = {
  id: string;
  text: string;
  type: 'faq' | 'query';
  icon?: React.ReactNode;
};

// Function to get all active search suggestions from Supabase
export async function fetchSearchSuggestions(): Promise<SearchSuggestion[]> {
  const { data, error } = await supabase
    .from('search_suggestions')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching search suggestions:', error);
    return [];
  }

  // Transform the database records into SearchSuggestion objects with React components for icons
  return data.map(suggestion => {
    // Dynamically get the icon component from Lucide
    let iconComponent = null;
    if (suggestion.icon_name) {
      const IconComponent = LucideIcons[suggestion.icon_name as keyof typeof LucideIcons] as React.ComponentType<{
        size?: number;
        className?: string;
      }>;
      
      if (IconComponent) {
        // Create the icon component correctly
        iconComponent = React.createElement(IconComponent, {
          size: 16,
          className: suggestion.icon_color || ''
        });
      }
    }

    return {
      id: suggestion.id.toString(),
      text: suggestion.text,
      type: suggestion.type as 'faq' | 'query',
      icon: iconComponent
    };
  });
}

// Custom hook for managing search suggestions
export function useSearchSuggestions() {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSuggestions() {
      try {
        setLoading(true);
        const data = await fetchSearchSuggestions();
        setSuggestions(data);
      } catch (err) {
        console.error('Failed to load suggestions:', err);
        setError('Failed to load search suggestions');
      } finally {
        setLoading(false);
      }
    }

    loadSuggestions();
  }, []);

  return { suggestions, loading, error };
}
