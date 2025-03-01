import { supabase } from "@/integrations/supabase/client";
import { 
  MenuCategory, 
  MenuItem, 
  MenuCategoryWithItems, 
  MenuItemWithDetails,
  Allergen,
  OptionGroup,
  OptionChoice,
  Tag,
  MenuItemOption
} from "@/models/types";

// Fetch all active menu categories ordered by sort_order
export async function fetchMenuCategories(): Promise<MenuCategory[]> {
  const { data, error } = await supabase
    .from('menu_categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching menu categories:', error);
    return [];
  }

  return data;
}

// Fetch all tags
export async function fetchTags(): Promise<Tag[]> {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching tags:', error);
    return [];
  }

  return data;
}

// Fetch all allergens
export async function fetchAllergens(): Promise<Allergen[]> {
  const { data, error } = await supabase
    .from('allergens')
    .select('*')
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching allergens:', error);
    return [];
  }

  return data;
}

// Fetch allergens for a specific menu item
export async function fetchMenuItemAllergens(menuItemId: string): Promise<Allergen[]> {
  const { data, error } = await supabase
    .from('menu_items_allergens')
    .select('allergen_id')
    .eq('menu_item_id', menuItemId);

  if (error || !data.length) {
    console.error('Error fetching menu item allergens:', error);
    return [];
  }

  const allergenIds = data.map(item => item.allergen_id);
  
  const { data: allergens, error: allergensError } = await supabase
    .from('allergens')
    .select('*')
    .in('id', allergenIds)
    .eq('is_active', true);

  if (allergensError) {
    console.error('Error fetching allergens by ids:', allergensError);
    return [];
  }

  return allergens;
}

// Fetch option groups with choices for a menu item
export async function fetchMenuItemOptionGroups(menuItemId: string): Promise<(OptionGroup & { choices: OptionChoice[] })[]> {
  // First, get all option groups linked to this menu item
  const { data: linkedGroups, error: linkedError } = await supabase
    .from('menu_items_option_groups')
    .select('option_group_id')
    .eq('menu_item_id', menuItemId);

  if (linkedError || !linkedGroups.length) {
    console.error('Error fetching menu item option groups:', linkedError);
    return [];
  }

  const optionGroupIds = linkedGroups.map(item => item.option_group_id);
  
  // Fetch the option groups
  const { data: groups, error: groupsError } = await supabase
    .from('option_groups')
    .select('*')
    .in('id', optionGroupIds)
    .eq('is_active', true);

  if (groupsError || !groups.length) {
    console.error('Error fetching option groups by ids:', groupsError);
    return [];
  }

  // For each option group, fetch its choices
  const groupsWithChoices = await Promise.all(
    groups.map(async (group) => {
      const { data: choices, error: choicesError } = await supabase
        .from('option_choices')
        .select('*')
        .eq('option_group_id', group.id)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (choicesError) {
        console.error(`Error fetching choices for option group ${group.id}:`, choicesError);
        return { ...group, choices: [] };
      }

      return { ...group, choices: choices || [] };
    })
  );

  return groupsWithChoices;
}

// Fetch dish story for a menu item
export async function fetchMenuItemStory(menuItemId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('dish_stories')
    .select('story')
    .eq('menu_item_id', menuItemId)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching menu item story:', error);
    return null;
  }

  return data ? data.story : null;
}

// Fetch all menu items for a specific category
export async function fetchMenuItemsByCategory(categoryId: string): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching menu items by category:', error);
    return [];
  }

  return data;
}

// Fetch a single menu item with all its details
export async function fetchMenuItemWithDetails(itemId: string): Promise<MenuItemWithDetails | null> {
  // Fetch the basic menu item data
  const { data: item, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('id', itemId)
    .eq('is_active', true)
    .single();

  if (error || !item) {
    console.error('Error fetching menu item:', error);
    return null;
  }

  // Fetch related data
  const [allergens, optionGroups, dishStory] = await Promise.all([
    fetchMenuItemAllergens(itemId),
    fetchMenuItemOptionGroups(itemId),
    fetchMenuItemStory(itemId)
  ]);

  return {
    ...item,
    allergens,
    option_groups: optionGroups,
    dish_story: dishStory || undefined
  };
}

// Fetch a single menu item by slug with all its details
export async function fetchMenuItemBySlug(slug: string): Promise<MenuItemWithDetails | null> {
  // Fetch the basic menu item data
  const { data: item, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error || !item) {
    console.error('Error fetching menu item by slug:', error);
    return null;
  }

  // Fetch related data
  const [allergens, optionGroups, dishStory] = await Promise.all([
    fetchMenuItemAllergens(item.id),
    fetchMenuItemOptionGroups(item.id),
    fetchMenuItemStory(item.id)
  ]);

  return {
    ...item,
    allergens,
    option_groups: optionGroups,
    dish_story: dishStory || undefined
  };
}

// Fetch all categories with their menu items
export async function fetchMenuCategoriesWithItems(): Promise<MenuCategoryWithItems[]> {
  const categories = await fetchMenuCategories();
  
  if (!categories.length) {
    return [];
  }

  const categoriesWithItems = await Promise.all(
    categories.map(async (category) => {
      const items = await fetchMenuItemsByCategory(category.id);
      
      // For each item, fetch its allergens
      const itemsWithAllergens = await Promise.all(
        items.map(async (item) => {
          const allergens = await fetchMenuItemAllergens(item.id);
          return { ...item, allergens };
        })
      );
      
      return {
        ...category,
        items: itemsWithAllergens
      };
    })
  );

  return categoriesWithItems;
}

// Search for menu items based on a query string
export async function searchMenuItems(query: string): Promise<MenuItem[]> {
  if (!query.trim()) {
    return [];
  }

  // Use the Supabase text search functionality with fuzzy matching
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('is_active', true)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`);

  if (error) {
    console.error('Error searching menu items:', error);
    return [];
  }

  return data || [];
}

// Convert database menu item option groups to frontend format
export function convertOptionGroupsToFrontendFormat(
  optionGroups: (OptionGroup & { choices: OptionChoice[] })[]
): MenuItemOption[] {
  return optionGroups.map(group => ({
    name: group.name,
    required: group.is_required,
    choices: group.choices.map(choice => ({
      name: choice.name,
      price: choice.price_adjustment !== 0 ? choice.price_adjustment : undefined
    }))
  }));
}
