
// Database entity types
export type Tag = {
  id: string;
  name: string;
  color: string;
  slug: string;
  description?: string;
  is_active: boolean;
};

export type Allergen = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  is_active: boolean;
};

export type MenuCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
};

export type OptionGroup = {
  id: string;
  name: string;
  is_required: boolean;
  is_active: boolean;
};

export type OptionChoice = {
  id: string;
  option_group_id: string;
  name: string;
  price_adjustment: number;
  sort_order: number;
  is_active: boolean;
};

export type MenuItem = {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  image_url?: string;
  calories?: number;
  protein?: number;
  is_active: boolean;
  is_popular: boolean;
  is_vegetarian: boolean;
  is_gluten_free: boolean;
  is_spicy: boolean;
  sort_order: number;
  sourcing?: string;
  allergens?: Allergen[];
  tags?: Tag[];
  option_groups?: OptionGroup[];
  dish_story?: string;
};

// Frontend model types that combine data from multiple tables
export type MenuCategoryWithItems = MenuCategory & {
  items: MenuItem[];
};

export type MenuItemWithDetails = MenuItem & {
  category?: MenuCategory;
  allergens: Allergen[];
  option_groups: (OptionGroup & {
    choices: OptionChoice[];
  })[];
  dish_story?: string;
};

export type MenuItemOption = {
  name: string;
  choices: {
    name: string;
    price?: number;
  }[];
  required?: boolean;
};
