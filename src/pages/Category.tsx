
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import MenuCategory from "@/components/MenuCategory";
import { useMenuCategories } from "@/hooks/useMenu";
import { MenuCategory as FrontendMenuCategory } from "@/data/menuData";

const Category = () => {
  const { id } = useParams<{id: string}>();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Fetch menu categories from database
  const { categories, loading: categoriesLoading, error: categoriesError } = useMenuCategories();
  
  // Find the category by slug
  const category = categories.find(c => c.slug === id);
  
  useEffect(() => {
    // If categories are loaded but we can't find this category, redirect to home
    if (!categoriesLoading && categories.length > 0 && !category) {
      navigate('/');
      return;
    }
    
    if (category) {
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 100);
  
      return () => clearTimeout(timer);
    }
  }, [category, navigate, categoriesLoading, categories]);
  
  if (categoriesLoading && !isLoaded) {
    return (
      <Layout title="Loading..." showHeader={true}>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ea384c]"></div>
        </div>
      </Layout>
    );
  }

  if (categoriesError) {
    return (
      <Layout title="Error" showHeader={true}>
        <div className="flex flex-col items-center justify-center h-screen p-4">
          <div className="text-red-500 mb-4">Failed to load category data</div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-[#ea384c] text-white px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </Layout>
    );
  }
  
  if (!category) return null;

  // Convert database category to frontend format
  const frontendCategory: FrontendMenuCategory = {
    id: category.slug,
    name: category.name,
    description: category.description || undefined,
    image: category.image_url,
    items: category.items.map(item => ({
      id: item.slug,
      name: item.name,
      description: item.description || "",
      price: Number(item.price),
      image: item.image_url,
      popular: item.is_popular,
      spicy: item.is_spicy,
      vegetarian: item.is_vegetarian,
      glutenFree: item.is_gluten_free,
      protein: item.protein ? Number(item.protein) : undefined,
      calories: item.calories,
      allergens: item.allergens?.map(a => a.name),
      sourcing: item.sourcing,
    }))
  };

  return (
    <Layout title={category.name} showHeader={true}>
      <div 
        className={`space-y-4 ${isLoaded ? "animate-fade-in" : "opacity-0"}`}
        style={{ backgroundColor: "#000000", color: "#FFFFFF", minHeight: "100vh" }}
      >
        {/* Category Header */}
        <div className="py-4 px-4 mb-4">
          <h2 className="text-sm font-medium text-white tracking-wide">{category.name}</h2>
          <div className="h-0.5 bg-[#ea384c] w-20 mt-1"></div>
          {category.description && (
            <p className="text-white/80 text-xs mt-2">{category.description}</p>
          )}
        </div>
        
        <MenuCategory 
          category={frontendCategory}
          expanded={true}
          showViewAll={false}
        />
      </div>
    </Layout>
  );
};

export default Category;
