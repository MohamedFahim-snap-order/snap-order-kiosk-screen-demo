export type MenuCategory = {
  id: string;
  name: string;
  nameAr: string;
  image: string;
  displayCount: number;
};

export type MenuChoice = {
  id: string;
  name: string;
  nameAr: string;
  priceDelta: number;
  kcal?: number | null;
};

export type MenuGroup = {
  id: string;
  name: string;
  nameAr: string;
  kind: "size" | "option";
  defaultOptionId?: string;
  options: MenuChoice[];
};

export type MenuItem = {
  id: string;
  categoryId: string;
  name: string;
  nameAr: string;
  image?: string;
  price: number;
  kcal: number | null;
  groups?: MenuGroup[];
};

function sizedDrinkGroup(
  smallPrice: number,
  mediumPrice: number,
  smallCalories: number | null,
  mediumCalories: number | null,
): MenuGroup[] {
  return [
    {
      id: "size",
      name: "Size",
      nameAr: "الحجم",
      kind: "size",
      defaultOptionId: "md",
      options: [
        { id: "sm", name: "Small", nameAr: "صغير", priceDelta: 0, kcal: smallCalories },
        {
          id: "md",
          name: "Medium",
          nameAr: "وسط",
          priceDelta: mediumPrice - smallPrice,
          kcal: mediumCalories,
        },
      ],
    },
  ];
}

const coldDrinkGroups: MenuGroup[] = [
  {
    id: "size",
    name: "Size",
    nameAr: "الحجم",
    kind: "size",
    defaultOptionId: "md",
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

export function bilingualName(entry: { name: string; nameAr: string }, locale: string) {
  const arabic = locale === "ar";
  return {
    primary: arabic ? entry.nameAr : entry.name,
    secondary: arabic ? entry.name : entry.nameAr,
    primaryLang: arabic ? "ar" : "en",
    secondaryLang: arabic ? "en" : "ar",
  } as const;
}

export const MENU_CATEGORIES: MenuCategory[] = [
  { id: "hot", name: "Hot Drinks", nameAr: "مشروبات ساخنة", image: "/assets/lane-stage/cat_hm_hot.svg", displayCount: 14 },
  { id: "cold", name: "Cold Drinks", nameAr: "مشروبات باردة", image: "/assets/lane-stage/cat_hm_cold.svg", displayCount: 20 },
  { id: "sandwiches", name: "Sandwiches", nameAr: "ساندويتشات", image: "/assets/lane-stage/cat_hm_sand.svg", displayCount: 6 },
  { id: "desserts", name: "Desserts", nameAr: "حلويات", image: "/assets/lane-stage/cat_hm_des.svg", displayCount: 5 },
  { id: "ice", name: "Ice Cream", nameAr: "آيس كريم", image: "/assets/lane-stage/cat_hm_ice.svg", displayCount: 5 },
  { id: "juice", name: "Juices & Water", nameAr: "عصائر ومياه", image: "/assets/lane-stage/cat_hm_water.svg", displayCount: 2 },
  { id: "beans", name: "Coffee Beans", nameAr: "حبوب القهوة", image: "/assets/lane-stage/cat_hm_beans.svg", displayCount: 5 },
  { id: "mugs", name: "Mugs", nameAr: "أكواب", image: "/assets/lane-stage/cat_hm_cups.svg", displayCount: 14 },
];

const menuItems: MenuItem[] = [
  {
    id: "cappuccino",
    categoryId: "hot",
    name: "Cappuccino",
    nameAr: "كابتشينو",
    image: "/assets/snap-coffee/cappuccino.webp",
    price: 10,
    kcal: 140,
    groups: sizedDrinkGroup(10, 13, 105, 140),
  },
  {
    id: "signature",
    categoryId: "hot",
    name: "Hot Signature",
    nameAr: "سجنتشر حار",
    image: "/assets/snap-coffee/signature.webp",
    price: 12,
    kcal: 180,
    groups: sizedDrinkGroup(12, 15, 135, 180),
  },
  {
    id: "chocolate",
    categoryId: "hot",
    name: "Hot Chocolate",
    nameAr: "هوت تشوكلت",
    image: "/assets/snap-coffee/chocolate.webp",
    price: 16,
    kcal: 540,
    groups: sizedDrinkGroup(16, 19, 405, 540),
  },
  {
    id: "americano",
    categoryId: "hot",
    name: "Hot Americano",
    nameAr: "أمريكانو حار",
    image: "/assets/snap-coffee/americano.webp",
    price: 10,
    kcal: null,
    groups: sizedDrinkGroup(10, 13, null, null),
  },
  {
    id: "latte",
    categoryId: "hot",
    name: "Hot Latte",
    nameAr: "لاتيه حار",
    image: "/assets/snap-coffee/latte.webp",
    price: 10,
    kcal: 140,
    groups: sizedDrinkGroup(10, 13, 105, 140),
  },
  {
    id: "flat",
    categoryId: "hot",
    name: "Flat White",
    nameAr: "فلات وايت",
    image: "/assets/snap-coffee/flat.webp",
    price: 10,
    kcal: 60,
  },
  {
    id: "cortado",
    categoryId: "hot",
    name: "Cortado",
    nameAr: "كورتادو",
    image: "/assets/snap-coffee/cortado.svg",
    price: 10,
    kcal: 35,
  },
  {
    id: "drip",
    categoryId: "hot",
    name: "Hot Brazilian Drip Coffee",
    nameAr: "قهوة برازيلية مقطرة حارة",
    image: "/assets/snap-coffee/hot_brazilian_drip_coffee.svg",
    price: 7,
    kcal: null,
    groups: sizedDrinkGroup(7, 10, null, null),
  },
  {
    id: "piccolo",
    categoryId: "hot",
    name: "Piccolo",
    nameAr: "بيكولو",
    image: "/assets/snap-coffee/piccolo.svg",
    price: 10,
    kcal: 35,
  },
  {
    id: "ethiopian",
    categoryId: "hot",
    name: "Hot Drip Ethiopian Coffee",
    nameAr: "قهوة مقطرة إثيوبية حارة",
    image: "/assets/snap-coffee/hot_drip_ethiopian_coffee.svg",
    price: 9,
    kcal: null,
    groups: sizedDrinkGroup(9, 12, null, null),
  },
  {
    id: "espresso",
    categoryId: "hot",
    name: "Espresso",
    nameAr: "إسبرسو",
    image: "/assets/snap-coffee/espresso.svg",
    price: 8,
    kcal: null,
  },
  {
    id: "box",
    categoryId: "hot",
    name: "Hot Brazilian Drip Coffee Box",
    nameAr: "بوكس قهوة برازيلية مقطرة حارة",
    image: "/assets/snap-coffee/hot_brazilian_drip_coffee_box.svg",
    price: 40,
    kcal: null,
  },
  {
    id: "ethiopian-box",
    categoryId: "hot",
    name: "Hot Ethiopian Drip Coffee Box",
    nameAr: "بوكس قهوة مقطرة إثيوبيّة حارة",
    image: "/assets/snap-coffee/ethiopian_drip_coffee_box.svg",
    price: 44,
    kcal: null,
  },
  {
    id: "chocolate-box",
    categoryId: "hot",
    name: "Hot Chocolate Box",
    nameAr: "بوكس هوت تشوكلت",
    image: "/assets/snap-coffee/hot_chocolate_box.svg",
    price: 90,
    kcal: null,
  },
  { id: "iced-latte", categoryId: "cold", name: "Iced Latte", nameAr: "لاتيه مثلج", price: 16, kcal: 160 },
  { id: "iced-spanish", categoryId: "cold", name: "Iced Spanish Latte", nameAr: "لاتيه إسباني مثلج", price: 18, kcal: 220 },
  { id: "cold-brew", categoryId: "cold", name: "Cold Brew", nameAr: "كولد برو", price: 15, kcal: 12 },
  { id: "halloumi", categoryId: "sandwiches", name: "Halloumi Sandwich", nameAr: "ساندويتش حلوم", price: 16, kcal: 340 },
  { id: "tuna", categoryId: "sandwiches", name: "Tuna Sandwich", nameAr: "ساندويتش تونة", price: 16, kcal: 380 },
  { id: "zaatar", categoryId: "sandwiches", name: "Zaatar Cheese Croissant", nameAr: "كرواسون جبنة وزعتر", price: 10, kcal: 290 },
  { id: "chicken", categoryId: "sandwiches", name: "Chicken Sandwich", nameAr: "ساندويتش دجاج", price: 16, kcal: 330 },
  { id: "plain", categoryId: "sandwiches", name: "Plain Croissant", nameAr: "كرواسون سادة", price: 10, kcal: 240 },
  { id: "choc-croissant", categoryId: "sandwiches", name: "Chocolate Croissant", nameAr: "كرواسون شوكولاتة", price: 10, kcal: null },
  { id: "cookie", categoryId: "desserts", name: "Cookie", nameAr: "كوكي", price: 8, kcal: 180 },
  { id: "brownie", categoryId: "desserts", name: "Brownie", nameAr: "براوني", price: 12, kcal: 260 },
  { id: "vanilla", categoryId: "ice", name: "Vanilla Cup", nameAr: "كوب فانيلا", price: 12, kcal: 210 },
  { id: "water", categoryId: "juice", name: "Water", nameAr: "مياه", price: 4, kcal: 0 },
  { id: "orange", categoryId: "juice", name: "Orange Juice", nameAr: "عصير برتقال", price: 10, kcal: 110 },
  { id: "beans-250", categoryId: "beans", name: "House Beans 250g", nameAr: "حبوب المنزل ٢٥٠ غ", price: 44, kcal: 0 },
  { id: "mug", categoryId: "mugs", name: "House Mug", nameAr: "كوب المنزل", price: 35, kcal: 0 },
];

const photographedItems = new Set([
  "iced-latte", "iced-spanish", "cold-brew", "choc-croissant", "chicken",
  "brownie", "orange", "vanilla", "beans-250",
]);

export const MENU_ITEMS: MenuItem[] = menuItems.map((original) => {
  const item = photographedItems.has(original.id)
    ? { ...original, image: `/assets/snap-coffee/${original.id}.webp` }
    : original;
  if (item.categoryId === "cold") return { ...item, groups: coldDrinkGroups };
  if (item.categoryId === "sandwiches") return { ...item, groups: sandwichGroups };
  return item;
});

export function money(value: number) {
  return `SAR ${value.toFixed(2)}`;
}


