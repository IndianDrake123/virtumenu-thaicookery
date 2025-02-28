
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { menuCategories } from "@/data/menuData";
import MenuCategory from "@/components/MenuCategory";

const Category = () => {
  const { id } = useParams<{id: string}>();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  
  const category = menuCategories.find(c => c.id === id);
  
  useEffect(() => {
    if (!category) {
      navigate('/');
      return;
    }
    
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [category, navigate]);
  
  if (!category) return null;

  return (
    <Layout title={category.name} showHeader={true}>
      <div 
        className={`space-y-4 ${isLoaded ? "animate-fade-in" : "opacity-0"}`}
        style={{ backgroundColor: "#000000", color: "#FFFFFF", minHeight: "100vh" }}
      >
        {/* Category Header */}
        <div className="bg-[#CA3F3F] py-4 px-4 mb-4">
          <h2 className="text-xl font-bold text-white">{category.name}</h2>
          {category.description && (
            <p className="text-white/90 text-sm">{category.description}</p>
          )}
        </div>
        
        <MenuCategory 
          category={category}
          expanded={true}
          showViewAll={false}
        />
      </div>
    </Layout>
  );
};

export default Category;
