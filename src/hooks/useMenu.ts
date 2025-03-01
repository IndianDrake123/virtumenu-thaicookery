
import { useState, useEffect } from 'react';
import { 
  fetchMenuCategoriesWithItems,
  fetchMenuItemWithDetails,
  fetchMenuItemBySlug,
  searchMenuItems,
  convertOptionGroupsToFrontendFormat
} from '@/services/menuService';
import { MenuCategoryWithItems, MenuItem, MenuItemWithDetails } from '@/models/types';
import { MenuItem as FrontendMenuItem } from '@/data/menuData';

// Hook to fetch all menu categories with items
export function useMenuCategories() {
  const [categories, setCategories] = useState<MenuCategoryWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        setLoading(true);
        const data = await fetchMenuCategoriesWithItems();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load menu categories:', err);
        setError('Failed to load menu data');
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  return { categories, loading, error };
}

// Hook to fetch a single menu item by ID
export function useMenuItem(itemId: string | undefined) {
  const [item, setItem] = useState<FrontendMenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!itemId) {
      setLoading(false);
      return;
    }

    async function loadMenuItem() {
      try {
        setLoading(true);
        const dbItem = await fetchMenuItemWithDetails(itemId);
        
        if (!dbItem) {
          setError('Menu item not found');
          return;
        }

        // Convert from database format to frontend format
        const frontendItem: FrontendMenuItem = {
          id: dbItem.slug,
          name: dbItem.name,
          description: dbItem.description || '',
          price: Number(dbItem.price),
          image: dbItem.image_url,
          popular: dbItem.is_popular,
          spicy: dbItem.is_spicy,
          vegetarian: dbItem.is_vegetarian,
          glutenFree: dbItem.is_gluten_free,
          protein: dbItem.protein ? Number(dbItem.protein) : undefined,
          calories: dbItem.calories,
          allergens: dbItem.allergens?.map(a => a.name),
          sourcing: dbItem.sourcing,
          options: dbItem.option_groups 
            ? convertOptionGroupsToFrontendFormat(dbItem.option_groups)
            : undefined
        };

        setItem(frontendItem);
      } catch (err) {
        console.error('Failed to load menu item:', err);
        setError('Failed to load menu item data');
      } finally {
        setLoading(false);
      }
    }

    loadMenuItem();
  }, [itemId]);

  return { item, loading, error };
}

// Hook to fetch a single menu item by slug
export function useMenuItemBySlug(slug: string | undefined) {
  const [item, setItem] = useState<FrontendMenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    async function loadMenuItem() {
      try {
        setLoading(true);
        const dbItem = await fetchMenuItemBySlug(slug);
        
        if (!dbItem) {
          setError('Menu item not found');
          return;
        }

        // Convert from database format to frontend format
        const frontendItem: FrontendMenuItem = {
          id: dbItem.slug,
          name: dbItem.name,
          description: dbItem.description || '',
          price: Number(dbItem.price),
          image: dbItem.image_url,
          popular: dbItem.is_popular,
          spicy: dbItem.is_spicy,
          vegetarian: dbItem.is_vegetarian,
          glutenFree: dbItem.is_gluten_free,
          protein: dbItem.protein ? Number(dbItem.protein) : undefined,
          calories: dbItem.calories,
          allergens: dbItem.allergens?.map(a => a.name),
          sourcing: dbItem.sourcing,
          options: dbItem.option_groups 
            ? convertOptionGroupsToFrontendFormat(dbItem.option_groups)
            : undefined
        };

        setItem(frontendItem);
      } catch (err) {
        console.error('Failed to load menu item:', err);
        setError('Failed to load menu item data');
      } finally {
        setLoading(false);
      }
    }

    loadMenuItem();
  }, [slug]);

  return { item, loading, error };
}

// Hook to search menu items
export function useMenuSearch(query: string) {
  const [items, setItems] = useState<FrontendMenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setItems([]);
      return;
    }

    async function searchItems() {
      try {
        setLoading(true);
        const results = await searchMenuItems(query);
        
        // Convert to frontend format
        const frontendItems = results.map(dbItem => ({
          id: dbItem.slug,
          name: dbItem.name,
          description: dbItem.description || '',
          price: Number(dbItem.price),
          image: dbItem.image_url,
          popular: dbItem.is_popular,
          spicy: dbItem.is_spicy,
          vegetarian: dbItem.is_vegetarian,
          glutenFree: dbItem.is_gluten_free,
          protein: dbItem.protein ? Number(dbItem.protein) : undefined,
          calories: dbItem.calories,
          allergens: dbItem.allergens?.map(a => a.name),
          sourcing: dbItem.sourcing
        }));

        setItems(frontendItems);
      } catch (err) {
        console.error('Search failed:', err);
        setError('Failed to search menu items');
      } finally {
        setLoading(false);
      }
    }

    searchItems();
  }, [query]);

  return { items, loading, error };
}
