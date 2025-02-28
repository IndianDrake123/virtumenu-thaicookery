
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  popular?: boolean;
  spicy?: boolean;
  vegetarian?: boolean;
  glutenFree?: boolean;
  protein?: number;
  calories?: number;
  allergens?: string[];
  sourcing?: string;
  options?: {
    name: string;
    choices: {
      name: string;
      price?: number;
    }[];
    required?: boolean;
  }[];
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  image?: string;
  items: MenuItem[];
}

export const menuCategories: MenuCategory[] = [
  {
    id: "starters",
    name: "Starters",
    image: "/lovable-uploads/973e961b-2c3d-4553-ac5c-ba9a8b3182f8.png",
    items: [
      {
        id: "spring-rolls",
        name: "Thai Spring Rolls",
        description: "Crispy vegetable spring rolls served with sweet chili sauce",
        price: 8.95,
        popular: true,
        vegetarian: true,
        protein: 5,
        calories: 290,
        allergens: ["Gluten", "Soy"],
        sourcing: "All vegetables locally sourced",
      },
      {
        id: "steamed-dumplings",
        name: "Steamed Dumplings",
        description: "Chicken and shrimp dumplings in a bamboo steamer",
        price: 9.95,
        popular: true,
        protein: 15,
        calories: 320,
        allergens: ["Shellfish", "Gluten", "Soy"],
        sourcing: "Sustainably sourced shrimp",
      },
      {
        id: "chicken-satay",
        name: "Chicken Satay",
        description: "Grilled marinated chicken skewers with peanut sauce",
        price: 10.95,
        protein: 22,
        calories: 310,
        allergens: ["Peanuts"],
        sourcing: "Free-range chicken",
      },
      {
        id: "papaya-salad",
        name: "Papaya Salad",
        description: "Green papaya, tomatoes, peanuts in spicy lime dressing",
        price: 9.95,
        spicy: true,
        vegetarian: true,
        glutenFree: true,
        protein: 7,
        calories: 180,
        allergens: ["Peanuts", "Fish sauce"],
        sourcing: "Fresh locally sourced vegetables",
      },
      {
        id: "crispy-calamari",
        name: "Crispy Calamari",
        description: "Lightly battered and fried calamari with sriracha mayo",
        price: 12.95,
        protein: 18,
        calories: 340,
        allergens: ["Shellfish", "Gluten", "Eggs"],
        sourcing: "Sustainably sourced calamari",
      }
    ]
  },
  {
    id: "soups",
    name: "Soups",
    image: "/lovable-uploads/973e961b-2c3d-4553-ac5c-ba9a8b3182f8.png",
    items: [
      {
        id: "tom-yum",
        name: "Tom Yum Soup",
        description: "Spicy and sour soup with lemongrass, galangal, and kaffir lime leaves",
        price: 8.95,
        spicy: true,
        popular: true,
        protein: 14,
        calories: 230,
        allergens: ["Shellfish", "Fish sauce"],
        sourcing: "Authentic Thai herbs and spices",
        options: [
          {
            name: "Protein",
            choices: [
              { name: "Chicken" },
              { name: "Shrimp", price: 2.00 },
              { name: "Vegetable", price: -1.00 }
            ],
            required: true
          }
        ]
      },
      {
        id: "tom-kha",
        name: "Tom Kha Soup",
        description: "Coconut milk soup with galangal, lemongrass, and lime",
        price: 8.95,
        protein: 13,
        calories: 350,
        allergens: ["Tree nuts", "Fish sauce"],
        sourcing: "Fresh coconut milk",
        options: [
          {
            name: "Protein",
            choices: [
              { name: "Chicken" },
              { name: "Shrimp", price: 2.00 },
              { name: "Vegetable", price: -1.00 }
            ],
            required: true
          }
        ]
      },
      {
        id: "wonton-soup",
        name: "Wonton Soup",
        description: "Clear broth with pork and shrimp wontons, vegetables",
        price: 9.95,
        protein: 16,
        calories: 280,
        allergens: ["Shellfish", "Gluten", "Soy"],
        sourcing: "Homemade wontons"
      }
    ]
  },
  {
    id: "curries",
    name: "Curries",
    image: "/lovable-uploads/973e961b-2c3d-4553-ac5c-ba9a8b3182f8.png",
    items: [
      {
        id: "green-curry",
        name: "Green Curry",
        description: "Spicy green curry with bamboo shoots, bell peppers, and basil",
        price: 15.95,
        spicy: true,
        popular: true,
        protein: 24,
        calories: 450,
        allergens: ["Tree nuts", "Fish sauce"],
        sourcing: "House-made curry paste",
        options: [
          {
            name: "Protein",
            choices: [
              { name: "Chicken" },
              { name: "Beef", price: 2.00 },
              { name: "Shrimp", price: 3.00 },
              { name: "Tofu", price: -1.00 }
            ],
            required: true
          },
          {
            name: "Spice Level",
            choices: [
              { name: "Mild" },
              { name: "Medium" },
              { name: "Hot" },
              { name: "Thai Hot" }
            ],
            required: true
          }
        ]
      },
      {
        id: "red-curry",
        name: "Red Curry",
        description: "Spicy red curry with bamboo shoots, bell peppers, and basil",
        price: 15.95,
        spicy: true,
        protein: 23,
        calories: 460,
        allergens: ["Tree nuts", "Fish sauce"],
        sourcing: "House-made curry paste",
        options: [
          {
            name: "Protein",
            choices: [
              { name: "Chicken" },
              { name: "Beef", price: 2.00 },
              { name: "Shrimp", price: 3.00 },
              { name: "Tofu", price: -1.00 }
            ],
            required: true
          },
          {
            name: "Spice Level",
            choices: [
              { name: "Mild" },
              { name: "Medium" },
              { name: "Hot" },
              { name: "Thai Hot" }
            ],
            required: true
          }
        ]
      },
      {
        id: "panang-curry",
        name: "Panang Curry",
        description: "Creamy curry with bell peppers, kaffir lime leaves",
        price: 16.95,
        spicy: true,
        protein: 25,
        calories: 480,
        allergens: ["Peanuts", "Tree nuts", "Fish sauce"],
        sourcing: "Authentic Thai spices",
        options: [
          {
            name: "Protein",
            choices: [
              { name: "Chicken" },
              { name: "Beef", price: 2.00 },
              { name: "Shrimp", price: 3.00 },
              { name: "Tofu", price: -1.00 }
            ],
            required: true
          },
          {
            name: "Spice Level",
            choices: [
              { name: "Mild" },
              { name: "Medium" },
              { name: "Hot" },
              { name: "Thai Hot" }
            ],
            required: true
          }
        ]
      },
      {
        id: "yellow-curry",
        name: "Yellow Curry",
        description: "Mild curry with potatoes, carrots, and onions",
        price: 15.95,
        protein: 22,
        calories: 470,
        allergens: ["Tree nuts"],
        sourcing: "House-made curry paste with turmeric",
        options: [
          {
            name: "Protein",
            choices: [
              { name: "Chicken" },
              { name: "Beef", price: 2.00 },
              { name: "Shrimp", price: 3.00 },
              { name: "Tofu", price: -1.00 }
            ],
            required: true
          },
          {
            name: "Spice Level",
            choices: [
              { name: "Mild" },
              { name: "Medium" },
              { name: "Hot" },
              { name: "Thai Hot" }
            ],
            required: true
          }
        ]
      }
    ]
  },
  {
    id: "noodles",
    name: "Noodles",
    image: "/lovable-uploads/973e961b-2c3d-4553-ac5c-ba9a8b3182f8.png",
    items: [
      {
        id: "pad-thai",
        name: "Pad Thai",
        description: "Stir-fried rice noodles with eggs, tofu, bean sprouts, and peanuts",
        price: 14.95,
        popular: true,
        protein: 20,
        calories: 520,
        allergens: ["Peanuts", "Eggs", "Fish sauce", "Soy"],
        sourcing: "Traditional recipe with authentic ingredients",
        options: [
          {
            name: "Protein",
            choices: [
              { name: "Chicken" },
              { name: "Beef", price: 2.00 },
              { name: "Shrimp", price: 3.00 },
              { name: "Tofu", price: -1.00 }
            ],
            required: true
          }
        ]
      },
      {
        id: "pad-see-ew",
        name: "Pad See Ew",
        description: "Wide rice noodles with egg, Chinese broccoli in sweet soy sauce",
        price: 14.95,
        protein: 22,
        calories: 540,
        allergens: ["Eggs", "Soy", "Gluten"],
        sourcing: "Fresh rice noodles made daily",
        options: [
          {
            name: "Protein",
            choices: [
              { name: "Chicken" },
              { name: "Beef", price: 2.00 },
              { name: "Shrimp", price: 3.00 },
              { name: "Tofu", price: -1.00 }
            ],
            required: true
          }
        ]
      },
      {
        id: "drunken-noodles",
        name: "Drunken Noodles",
        description: "Spicy stir-fried wide rice noodles with basil, vegetables",
        price: 15.95,
        spicy: true,
        protein: 23,
        calories: 530,
        allergens: ["Soy", "Gluten"],
        sourcing: "Fresh Thai basil",
        options: [
          {
            name: "Protein",
            choices: [
              { name: "Chicken" },
              { name: "Beef", price: 2.00 },
              { name: "Shrimp", price: 3.00 },
              { name: "Tofu", price: -1.00 }
            ],
            required: true
          },
          {
            name: "Spice Level",
            choices: [
              { name: "Mild" },
              { name: "Medium" },
              { name: "Hot" },
              { name: "Thai Hot" }
            ],
            required: true
          }
        ]
      }
    ]
  },
  {
    id: "rice",
    name: "Rice Dishes",
    image: "/lovable-uploads/973e961b-2c3d-4553-ac5c-ba9a8b3182f8.png",
    items: [
      {
        id: "basil-fried-rice",
        name: "Basil Fried Rice",
        description: "Spicy fried rice with basil, bell peppers, and onions",
        price: 14.95,
        spicy: true,
        protein: 21,
        calories: 510,
        allergens: ["Eggs", "Soy"],
        sourcing: "Jasmine rice, fresh Thai basil",
        options: [
          {
            name: "Protein",
            choices: [
              { name: "Chicken" },
              { name: "Beef", price: 2.00 },
              { name: "Shrimp", price: 3.00 },
              { name: "Tofu", price: -1.00 }
            ],
            required: true
          },
          {
            name: "Spice Level",
            choices: [
              { name: "Mild" },
              { name: "Medium" },
              { name: "Hot" },
              { name: "Thai Hot" }
            ],
            required: true
          }
        ]
      },
      {
        id: "pineapple-fried-rice",
        name: "Pineapple Fried Rice",
        description: "Fried rice with pineapple, cashews, raisins, and curry powder",
        price: 15.95,
        popular: true,
        protein: 18,
        calories: 520,
        allergens: ["Tree nuts", "Eggs", "Soy"],
        sourcing: "Fresh pineapple",
        options: [
          {
            name: "Protein",
            choices: [
              { name: "Chicken" },
              { name: "Beef", price: 2.00 },
              { name: "Shrimp", price: 3.00 },
              { name: "Tofu", price: -1.00 }
            ],
            required: true
          }
        ]
      }
    ]
  },
  {
    id: "specials",
    name: "Signature Specials",
    image: "/lovable-uploads/973e961b-2c3d-4553-ac5c-ba9a8b3182f8.png",
    items: [
      {
        id: "duck-curry",
        name: "Roasted Duck Curry",
        description: "Red curry with roasted duck, pineapple, tomatoes, and basil",
        price: 22.95,
        spicy: true,
        popular: true,
        protein: 28,
        calories: 580,
        allergens: ["Tree nuts", "Fish sauce"],
        sourcing: "Duck sourced from local farms"
      },
      {
        id: "seafood-pad-cha",
        name: "Seafood Pad Cha",
        description: "Spicy stir-fry with mixed seafood, young peppercorns, rhizome",
        price: 24.95,
        spicy: true,
        protein: 30,
        calories: 490,
        allergens: ["Shellfish", "Fish sauce"],
        sourcing: "Sustainable seafood",
        options: [
          {
            name: "Spice Level",
            choices: [
              { name: "Mild" },
              { name: "Medium" },
              { name: "Hot" },
              { name: "Thai Hot" }
            ],
            required: true
          }
        ]
      }
    ]
  },
  {
    id: "desserts",
    name: "Desserts",
    image: "/lovable-uploads/973e961b-2c3d-4553-ac5c-ba9a8b3182f8.png",
    items: [
      {
        id: "mango-sticky-rice",
        name: "Mango Sticky Rice",
        description: "Sweet sticky rice with fresh mango and coconut cream",
        price: 8.95,
        popular: true,
        vegetarian: true,
        glutenFree: true,
        protein: 4,
        calories: 340,
        allergens: ["Tree nuts"],
        sourcing: "Seasonal fresh mangoes"
      },
      {
        id: "coconut-ice-cream",
        name: "Coconut Ice Cream",
        description: "Homemade coconut ice cream with peanuts and sticky rice",
        price: 6.95,
        vegetarian: true,
        protein: 5,
        calories: 290,
        allergens: ["Peanuts", "Tree nuts", "Dairy"],
        sourcing: "Made in house with fresh coconut"
      }
    ]
  },
  {
    id: "drinks",
    name: "Drinks",
    image: "/lovable-uploads/973e961b-2c3d-4553-ac5c-ba9a8b3182f8.png",
    items: [
      {
        id: "thai-tea",
        name: "Thai Iced Tea",
        description: "Sweet and creamy tea with milk",
        price: 4.95,
        vegetarian: true,
        protein: 2,
        calories: 220,
        allergens: ["Dairy"],
        sourcing: "Authentic Thai tea leaves"
      },
      {
        id: "thai-coffee",
        name: "Thai Iced Coffee",
        description: "Strong coffee with sweetened condensed milk",
        price: 4.95,
        vegetarian: true,
        protein: 3,
        calories: 230,
        allergens: ["Dairy"],
        sourcing: "Premium coffee beans"
      },
      {
        id: "coconut-water",
        name: "Fresh Coconut Water",
        description: "Served in a whole young coconut",
        price: 5.95,
        vegetarian: true,
        glutenFree: true,
        protein: 1,
        calories: 90,
        sourcing: "Young Thai coconuts"
      }
    ]
  }
];
