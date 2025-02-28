
import React, { useState } from "react";
import { Plus } from "lucide-react";

interface MenuItemProps {
  name: string;
  description?: string;
  price: string;
  image?: string;
  popular?: boolean;
  spicy?: boolean;
  vegetarian?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  name,
  description,
  price,
  image,
  popular = false,
  spicy = false,
  vegetarian = false,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="premium-card p-4 flex items-start gap-4 hover:translate-y-[-2px] transition-all duration-300">
      {image && (
        <div className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
          <img
            src={image}
            alt={name}
            className={`w-full h-full object-cover transition-all duration-500 ${
              imageLoaded ? "" : "img-blur-in"
            }`}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
      )}
      
      <div className="flex-1">
        <div className="flex justify-between">
          <div>
            <h4 className="font-medium text-virtumenu-900 mb-1">{name}</h4>
            {description && (
              <p className="text-sm text-virtumenu-500 line-clamp-2">{description}</p>
            )}
          </div>
          <div className="flex-shrink-0 ml-2">
            <span className="font-medium text-virtumenu-800">{price}</span>
          </div>
        </div>
        
        <div className="flex items-center mt-2 justify-between">
          <div className="flex gap-1.5">
            {popular && <span className="badge-accent">Popular</span>}
            {spicy && <span className="badge">Spicy</span>}
            {vegetarian && <span className="badge">Vegetarian</span>}
          </div>
          
          <button className="w-8 h-8 rounded-full bg-virtumenu-800 text-white flex items-center justify-center hover:bg-virtumenu-700 transition-colors">
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
