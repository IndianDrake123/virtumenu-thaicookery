
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import MenuCategory from "@/components/MenuCategory";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter } from "lucide-react";
import { menuCategories } from "@/data/menuData";

const Menu = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Filter categories based on active tab
  const filteredCategories = menuCategories.filter(category => {
    if (activeTab === "all") return true;
    if (activeTab === "popular") {
      return category.items.some(item => item.popular);
    }
    return category.id === activeTab;
  });

  return (
    <Layout title="Menu" showHeader={true}>
      <div className={`space-y-6 ${isLoaded ? "animate-fade-in" : "opacity-0"}`}>
        {/* Search Bar */}
        <div className="menu-card p-2 flex items-center">
          <div className="flex-1 px-2 relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border-none focus:outline-none focus:ring-1 focus:ring-primary focus:ring-opacity-50 bg-gray-50 text-gray-900 placeholder:text-gray-400"
            />
          </div>
          <button className="p-2.5 ml-2 rounded-lg bg-gray-50 text-gray-800 hover:bg-gray-100 transition-colors">
            <Filter size={20} />
          </button>
        </div>

        {/* Categories Tabs */}
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="w-full flex overflow-x-auto p-1 bg-white rounded-xl shadow-sm">
            <TabsTrigger value="all" className="flex-1 py-2">
              All
            </TabsTrigger>
            <TabsTrigger value="popular" className="flex-1 py-2">
              Popular
            </TabsTrigger>
            <TabsTrigger value="soon-tofu" className="flex-1 py-2">
              Soon Tofu
            </TabsTrigger>
            <TabsTrigger value="bbq" className="flex-1 py-2">
              BBQ
            </TabsTrigger>
            <TabsTrigger value="appetizers" className="flex-1 py-2">
              Appetizers
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Menu Categories */}
        <div className="space-y-6">
          {filteredCategories.map((category) => (
            <MenuCategory
              key={category.id}
              category={category}
              expanded={filteredCategories.length === 1}
              showViewAll={true}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Menu;
