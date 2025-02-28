
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import MenuCategory from "@/components/MenuCategory";
import MenuItem from "@/components/MenuItem";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter } from "lucide-react";

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

  return (
    <Layout title="Menu" showHeader={true}>
      <div className={`space-y-6 ${isLoaded ? "animate-fade-in" : "opacity-0"}`}>
        {/* Search Bar */}
        <div className="premium-card p-2 flex items-center">
          <div className="flex-1 px-2 relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search size={18} className="text-virtumenu-400" />
            </div>
            <input
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border-none focus:outline-none focus:ring-1 focus:ring-virtumenu-300 bg-virtumenu-50 text-virtumenu-900 placeholder:text-virtumenu-400"
            />
          </div>
          <button className="p-2.5 ml-2 rounded-lg bg-virtumenu-50 text-virtumenu-800 hover:bg-virtumenu-100 transition-colors">
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
            <TabsTrigger value="appetizers" className="flex-1 py-2">
              Appetizers
            </TabsTrigger>
            <TabsTrigger value="soups" className="flex-1 py-2">
              Soups
            </TabsTrigger>
            <TabsTrigger value="mains" className="flex-1 py-2">
              Mains
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Menu Categories */}
        <div className="space-y-6">
          <MenuCategory title="Soon Tofu" description="Served with steamed rice" defaultOpen={true}>
            <MenuItem
              name="Original Soon Tofu"
              description="Our signature tofu soup with silken tofu in a spicy broth"
              price="$15.95"
              popular={true}
              spicy={true}
            />
            <MenuItem
              name="Seafood Soon Tofu"
              description="Silken tofu soup with a mix of fresh seafood"
              price="$17.95"
              spicy={true}
            />
            <MenuItem
              name="Beef Soon Tofu"
              description="Tender sliced beef in our signature soup"
              price="$16.95"
              spicy={true}
            />
            <MenuItem
              name="Vegetable Soon Tofu"
              description="Assortment of fresh seasonal vegetables"
              price="$14.95"
              vegetarian={true}
              spicy={true}
            />
          </MenuCategory>

          <MenuCategory title="BBQ" description="Korean style BBQ plates">
            <MenuItem
              name="Bulgogi"
              description="Thinly sliced marinated beef"
              price="$19.95"
              popular={true}
            />
            <MenuItem
              name="Galbi"
              description="Marinated beef short ribs"
              price="$21.95"
            />
            <MenuItem
              name="Spicy Pork Bulgogi"
              description="Thinly sliced pork in spicy marinade"
              price="$18.95"
              spicy={true}
            />
            <MenuItem
              name="BBQ Chicken"
              description="Marinated chicken thigh meat"
              price="$17.95"
            />
          </MenuCategory>

          <MenuCategory title="Combos" description="Value meals with multiple items">
            <MenuItem
              name="Tofu & BBQ Combo A"
              description="Soon tofu with bulgogi"
              price="$25.95"
              popular={true}
            />
            <MenuItem
              name="Tofu & BBQ Combo B"
              description="Soon tofu with galbi"
              price="$27.95"
            />
            <MenuItem
              name="Tofu & BBQ Combo C"
              description="Soon tofu with spicy pork bulgogi"
              price="$24.95"
              spicy={true}
            />
          </MenuCategory>

          <MenuCategory title="Appetizers">
            <MenuItem
              name="Kimchi Pancake"
              description="Traditional Korean kimchi pancake"
              price="$12.95"
              spicy={true}
            />
            <MenuItem
              name="Japchae"
              description="Sweet potato noodles with vegetables"
              price="$14.95"
              vegetarian={true}
            />
            <MenuItem
              name="Mandu"
              description="Korean dumplings, fried or steamed"
              price="$10.95"
            />
            <MenuItem
              name="Pa Jun"
              description="Korean style pancake with green onions"
              price="$11.95"
              vegetarian={true}
            />
          </MenuCategory>
        </div>
      </div>
    </Layout>
  );
};

export default Menu;
