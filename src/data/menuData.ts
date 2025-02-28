
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
  items: MenuItem[];
}

export const menuCategories: MenuCategory[] = [
  {
    id: "soon-tofu",
    name: "Soon Tofu",
    description: "Served with steamed rice",
    items: [
      {
        id: "original-soon-tofu",
        name: "Original Soon Tofu",
        description: "Our signature tofu soup with silken tofu in a spicy broth",
        price: 15.95,
        popular: true,
        spicy: true,
        options: [
          {
            name: "Spice Level",
            choices: [
              { name: "Mild" },
              { name: "Medium" },
              { name: "Spicy" },
              { name: "Extra Spicy" }
            ],
            required: true
          }
        ]
      },
      {
        id: "seafood-soon-tofu",
        name: "Seafood Soon Tofu",
        description: "Silken tofu soup with a mix of fresh seafood",
        price: 17.95,
        spicy: true,
        options: [
          {
            name: "Spice Level",
            choices: [
              { name: "Mild" },
              { name: "Medium" },
              { name: "Spicy" },
              { name: "Extra Spicy" }
            ],
            required: true
          }
        ]
      },
      {
        id: "beef-soon-tofu",
        name: "Beef Soon Tofu",
        description: "Tender sliced beef in our signature soup",
        price: 16.95,
        spicy: true,
        options: [
          {
            name: "Spice Level",
            choices: [
              { name: "Mild" },
              { name: "Medium" },
              { name: "Spicy" },
              { name: "Extra Spicy" }
            ],
            required: true
          }
        ]
      },
      {
        id: "vegetable-soon-tofu",
        name: "Vegetable Soon Tofu",
        description: "Assortment of fresh seasonal vegetables",
        price: 14.95,
        vegetarian: true,
        spicy: true,
        options: [
          {
            name: "Spice Level",
            choices: [
              { name: "Mild" },
              { name: "Medium" },
              { name: "Spicy" },
              { name: "Extra Spicy" }
            ],
            required: true
          }
        ]
      },
      {
        id: "kimchi-soon-tofu",
        name: "Kimchi Soon Tofu",
        description: "Traditional tofu soup with our house-made kimchi",
        price: 15.95,
        spicy: true,
        options: [
          {
            name: "Spice Level",
            choices: [
              { name: "Mild" },
              { name: "Medium" },
              { name: "Spicy" },
              { name: "Extra Spicy" }
            ],
            required: true
          }
        ]
      },
      {
        id: "ham-sausage-soon-tofu",
        name: "Ham & Sausage Soon Tofu",
        description: "Hearty tofu soup with ham and sausage",
        price: 16.95,
        spicy: true,
        options: [
          {
            name: "Spice Level",
            choices: [
              { name: "Mild" },
              { name: "Medium" },
              { name: "Spicy" },
              { name: "Extra Spicy" }
            ],
            required: true
          }
        ]
      }
    ]
  },
  {
    id: "bbq",
    name: "BBQ",
    description: "Korean style BBQ plates",
    items: [
      {
        id: "bulgogi",
        name: "Bulgogi",
        description: "Thinly sliced marinated beef",
        price: 19.95,
        popular: true,
        options: [
          {
            name: "Rice Choice",
            choices: [
              { name: "White Rice" },
              { name: "Brown Rice", price: 1.50 }
            ]
          }
        ]
      },
      {
        id: "galbi",
        name: "Galbi",
        description: "Marinated beef short ribs",
        price: 21.95,
        options: [
          {
            name: "Rice Choice",
            choices: [
              { name: "White Rice" },
              { name: "Brown Rice", price: 1.50 }
            ]
          }
        ]
      },
      {
        id: "spicy-pork-bulgogi",
        name: "Spicy Pork Bulgogi",
        description: "Thinly sliced pork in spicy marinade",
        price: 18.95,
        spicy: true,
        options: [
          {
            name: "Rice Choice",
            choices: [
              { name: "White Rice" },
              { name: "Brown Rice", price: 1.50 }
            ]
          },
          {
            name: "Spice Level",
            choices: [
              { name: "Medium" },
              { name: "Spicy" },
              { name: "Extra Spicy" }
            ]
          }
        ]
      },
      {
        id: "bbq-chicken",
        name: "BBQ Chicken",
        description: "Marinated chicken thigh meat",
        price: 17.95,
        options: [
          {
            name: "Rice Choice",
            choices: [
              { name: "White Rice" },
              { name: "Brown Rice", price: 1.50 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "combos",
    name: "Combos",
    description: "Value meals with multiple items",
    items: [
      {
        id: "tofu-bbq-combo-a",
        name: "Tofu & BBQ Combo A",
        description: "Soon tofu with bulgogi",
        price: 25.95,
        popular: true,
        options: [
          {
            name: "Spice Level for Tofu",
            choices: [
              { name: "Mild" },
              { name: "Medium" },
              { name: "Spicy" },
              { name: "Extra Spicy" }
            ],
            required: true
          },
          {
            name: "Rice Choice",
            choices: [
              { name: "White Rice" },
              { name: "Brown Rice", price: 1.50 }
            ]
          }
        ]
      },
      {
        id: "tofu-bbq-combo-b",
        name: "Tofu & BBQ Combo B",
        description: "Soon tofu with galbi",
        price: 27.95,
        options: [
          {
            name: "Spice Level for Tofu",
            choices: [
              { name: "Mild" },
              { name: "Medium" },
              { name: "Spicy" },
              { name: "Extra Spicy" }
            ],
            required: true
          },
          {
            name: "Rice Choice",
            choices: [
              { name: "White Rice" },
              { name: "Brown Rice", price: 1.50 }
            ]
          }
        ]
      },
      {
        id: "tofu-bbq-combo-c",
        name: "Tofu & BBQ Combo C",
        description: "Soon tofu with spicy pork bulgogi",
        price: 24.95,
        spicy: true,
        options: [
          {
            name: "Spice Level for Tofu",
            choices: [
              { name: "Mild" },
              { name: "Medium" },
              { name: "Spicy" },
              { name: "Extra Spicy" }
            ],
            required: true
          },
          {
            name: "Rice Choice",
            choices: [
              { name: "White Rice" },
              { name: "Brown Rice", price: 1.50 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "appetizers",
    name: "Appetizers",
    items: [
      {
        id: "kimchi-pancake",
        name: "Kimchi Pancake",
        description: "Traditional Korean kimchi pancake",
        price: 12.95,
        spicy: true
      },
      {
        id: "japchae",
        name: "Japchae",
        description: "Sweet potato noodles with vegetables",
        price: 14.95,
        vegetarian: true,
        options: [
          {
            name: "Add Protein",
            choices: [
              { name: "No Protein" },
              { name: "Beef", price: 3.00 },
              { name: "Chicken", price: 2.50 }
            ]
          }
        ]
      },
      {
        id: "mandu",
        name: "Mandu",
        description: "Korean dumplings",
        price: 10.95,
        options: [
          {
            name: "Style",
            choices: [
              { name: "Fried" },
              { name: "Steamed" }
            ],
            required: true
          }
        ]
      },
      {
        id: "pa-jun",
        name: "Pa Jun",
        description: "Korean style pancake with green onions",
        price: 11.95,
        vegetarian: true
      }
    ]
  },
  {
    id: "sides",
    name: "Sides",
    items: [
      {
        id: "white-rice",
        name: "White Rice",
        description: "Steamed white rice",
        price: 2.50,
        vegetarian: true,
        glutenFree: true
      },
      {
        id: "brown-rice",
        name: "Brown Rice",
        description: "Steamed brown rice",
        price: 3.00,
        vegetarian: true,
        glutenFree: true
      },
      {
        id: "kimchi",
        name: "Kimchi",
        description: "Traditional fermented napa cabbage",
        price: 3.95,
        spicy: true,
        vegetarian: true
      },
      {
        id: "banchan-set",
        name: "Banchan Set",
        description: "Assorted Korean side dishes",
        price: 8.95,
        popular: true
      }
    ]
  },
  {
    id: "drinks",
    name: "Drinks",
    items: [
      {
        id: "soda",
        name: "Soda",
        description: "Coke, Diet Coke, Sprite, or Root Beer",
        price: 2.50,
        options: [
          {
            name: "Type",
            choices: [
              { name: "Coke" },
              { name: "Diet Coke" },
              { name: "Sprite" },
              { name: "Root Beer" }
            ],
            required: true
          }
        ]
      },
      {
        id: "iced-tea",
        name: "Iced Tea",
        description: "Unsweetened black tea",
        price: 2.50
      },
      {
        id: "hot-tea",
        name: "Hot Tea",
        description: "Green tea or barley tea",
        price: 2.00,
        options: [
          {
            name: "Type",
            choices: [
              { name: "Green Tea" },
              { name: "Barley Tea" }
            ],
            required: true
          }
        ]
      },
      {
        id: "korean-beer",
        name: "Korean Beer",
        description: "Hite or Cass",
        price: 5.95,
        options: [
          {
            name: "Type",
            choices: [
              { name: "Hite" },
              { name: "Cass" }
            ],
            required: true
          }
        ]
      }
    ]
  }
];
