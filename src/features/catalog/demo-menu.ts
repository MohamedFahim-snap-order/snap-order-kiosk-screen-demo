export type MenuCategory = {
  id: string;
  name: string;
};

export type MenuChoice = {
  id: string;
  name: string;
  nameAr: string;
  priceDelta: number;
};

export type MenuGroup = {
  id: string;
  name: string;
  nameAr: string;
  kind: "size" | "option";
  options: MenuChoice[];
};

export type MenuItem = {
  id: string;
  categoryId: string;
  name: string;
  price: number;
  kcal: number;
  groups?: MenuGroup[];
};

const drinkGroups: MenuGroup[] = [
  {
    id: "size",
    name: "Size",
    nameAr: "الحجم",
    kind: "size",
    options: [
      { id: "sm", name: "Small", nameAr: "صغير", priceDelta: 0 },
      { id: "md", name: "Medium", nameAr: "وسط", priceDelta: 2 },
      { id: "lg", name: "Large", nameAr: "كبير", priceDelta: 4 },
    ],
  },
  {
    id: "milk",
    name: "Milk",
    nameAr: "الحليب",
    kind: "option",
    options: [
      { id: "regular", name: "Regular", nameAr: "عادي", priceDelta: 0 },
      { id: "oat", name: "Oat", nameAr: "شوفان", priceDelta: 2 },
      { id: "almond", name: "Almond", nameAr: "لوز", priceDelta: 2 },
    ],
  },
];

const sandwichGroups: MenuGroup[] = [
  {
    id: "extra",
    name: "Extra",
    nameAr: "إضافة",
    kind: "option",
    options: [
      { id: "none", name: "None", nameAr: "بدون", priceDelta: 0 },
      { id: "cheese", name: "Cheese", nameAr: "جبن", priceDelta: 3 },
    ],
  },
];

export function choiceName(choice: { name: string; nameAr: string }, locale: string) {
  return locale === "ar" ? choice.nameAr : choice.name;
}

export const MENU_CATEGORIES: MenuCategory[] = [
  { id: "hot", name: "Hot Drinks" },
  { id: "cold", name: "Cold Drinks" },
  { id: "sandwiches", name: "Sandwiches" },
  { id: "desserts", name: "Desserts" },
  { id: "ice", name: "Ice Cream" },
  { id: "juice", name: "Juices & Water" },
  { id: "beans", name: "Coffee Beans" },
  { id: "mugs", name: "Mugs" },
];

const menuItems: MenuItem[] = [
  { id: "cappuccino", categoryId: "hot", name: "Cappuccino", price: 13, kcal: 140 },
  { id: "signature", categoryId: "hot", name: "Hot Signature", price: 15, kcal: 180 },
  { id: "chocolate", categoryId: "hot", name: "Hot Chocolate", price: 19, kcal: 340 },
  { id: "americano", categoryId: "hot", name: "Hot Americano", price: 13, kcal: 15 },
  { id: "latte", categoryId: "hot", name: "Hot Latte", price: 13, kcal: 140 },
  { id: "flat", categoryId: "hot", name: "Flat White", price: 10, kcal: 60 },
  { id: "cortado", categoryId: "hot", name: "Cortado", price: 10, kcal: 35 },
  { id: "drip", categoryId: "hot", name: "Hot Brazilian Drip", price: 10, kcal: 8 },
  { id: "piccolo", categoryId: "hot", name: "Piccolo", price: 10, kcal: 40 },
  { id: "ethiopian", categoryId: "hot", name: "Hot Drip Ethiopian", price: 12, kcal: 8 },
  { id: "espresso", categoryId: "hot", name: "Espresso", price: 8, kcal: 5 },
  { id: "box", categoryId: "hot", name: "Hot Brazilian Drip Box", price: 40, kcal: 8 },
  { id: "iced-latte", categoryId: "cold", name: "Iced Latte", price: 16, kcal: 160 },
  { id: "iced-spanish", categoryId: "cold", name: "Iced Spanish Latte", price: 18, kcal: 220 },
  { id: "cold-brew", categoryId: "cold", name: "Cold Brew", price: 15, kcal: 12 },
  { id: "halloumi", categoryId: "sandwiches", name: "Halloumi Sandwich", price: 16, kcal: 340 },
  { id: "tuna", categoryId: "sandwiches", name: "Tuna Sandwich", price: 16, kcal: 380 },
  { id: "zaatar", categoryId: "sandwiches", name: "Zaatar Cheese Croissant", price: 10, kcal: 290 },
  { id: "chicken", categoryId: "sandwiches", name: "Chicken Sandwich", price: 16, kcal: 330 },
  { id: "plain", categoryId: "sandwiches", name: "Plain Croissant", price: 10, kcal: 240 },
  { id: "choc-croissant", categoryId: "sandwiches", name: "Chocolate Croissant", price: 10, kcal: 280 },
  { id: "cookie", categoryId: "desserts", name: "Cookie", price: 8, kcal: 180 },
  { id: "brownie", categoryId: "desserts", name: "Brownie", price: 12, kcal: 260 },
  { id: "vanilla", categoryId: "ice", name: "Vanilla Cup", price: 12, kcal: 210 },
  { id: "water", categoryId: "juice", name: "Water", price: 4, kcal: 0 },
  { id: "orange", categoryId: "juice", name: "Orange Juice", price: 10, kcal: 110 },
  { id: "beans-250", categoryId: "beans", name: "House Beans 250g", price: 44, kcal: 0 },
  { id: "mug", categoryId: "mugs", name: "House Mug", price: 35, kcal: 0 },
];

export const MENU_ITEMS: MenuItem[] = menuItems.map((item) => {
  if (item.categoryId === "hot" || item.categoryId === "cold") return { ...item, groups: drinkGroups };
  if (item.categoryId === "sandwiches") return { ...item, groups: sandwichGroups };
  return item;
});

export function money(value: number) {
  return `SAR ${value.toFixed(2)}`;
}
