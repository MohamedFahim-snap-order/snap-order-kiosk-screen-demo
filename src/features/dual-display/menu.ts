export type DisplayProduct = {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  price: number;
  image: string;
};

export type DisplaySection = {
  id: string;
  title: string;
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
  products: DisplayProduct[];
};

const asset = (name: string) => `/assets/dual-screen/products/${name}.webp`;

export const DISPLAY_MENU: DisplaySection[] = [
  {
    id: "hot", title: "Hot & handcrafted", titleAr: "ساخنة وعلى ذوقك",
    subtitle: "Your daily ritual, done right.", subtitleAr: "قهوتك اليومية، كما تحبها.",
    products: [
      { id: "cappuccino", name: "Cappuccino", nameAr: "كابتشينو", description: "Espresso. Milk. Cloud-like foam.", descriptionAr: "إسبريسو وحليب ورغوة خفيفة.", price: 13, image: asset("cappuccino") },
      { id: "signature", name: "Snap Signature", nameAr: "سناب سجنتشر", description: "A little sweet. A lot to love.", descriptionAr: "حلاوة خفيفة ومذاق مميز.", price: 15, image: asset("signature") },
      { id: "latte", name: "Caffè Latte", nameAr: "كافيه لاتيه", description: "Smooth, silky, never ordinary.", descriptionAr: "ناعم وغني، بطعم مختلف.", price: 13, image: asset("latte") },
    ],
  },
  {
    id: "iced", title: "On the cooler side", titleAr: "على الجانب البارد",
    subtitle: "Ice-cold sips. Feel-good energy.", subtitleAr: "رشفات باردة ومزاج أجمل.",
    products: [
      { id: "iced-latte", name: "Iced Latte", nameAr: "آيس لاتيه", description: "Your latte, with a little chill.", descriptionAr: "لاتيه بلمسة باردة.", price: 18, image: asset("iced-latte") },
      { id: "iced-spanish", name: "Spanish Latte", nameAr: "سبانيش لاتيه", description: "Creamy, caramel-kissed comfort.", descriptionAr: "حليب كريمي بلمسة كراميل.", price: 20, image: asset("iced-spanish") },
      { id: "cold-brew", name: "Cold Brew", nameAr: "كولد برو", description: "Slow brewed. Bold by nature.", descriptionAr: "تحضير بطيء ومذاق غني.", price: 17, image: asset("cold-brew") },
    ],
  },
  {
    id: "bites", title: "A little on the side", titleAr: "شيء لذيذ مع قهوتك",
    subtitle: "Because coffee loves company.", subtitleAr: "لأن القهوة تحب الرفقة.",
    products: [
      { id: "choc-croissant", name: "Chocolate Croissant", nameAr: "كرواسون شوكولاتة", description: "Golden layers. Chocolate heart.", descriptionAr: "طبقات ذهبية وقلب من الشوكولاتة.", price: 10, image: asset("choc-croissant") },
      { id: "chicken", name: "Grilled Chicken Melt", nameAr: "ساندويتش دجاج", description: "Toasty, melty, made for lunch.", descriptionAr: "دجاج مشوي وجبن ذائب.", price: 16, image: asset("chicken") },
      { id: "brownie", name: "Chocolate Brownie", nameAr: "براوني الشوكولاتة", description: "Big chocolate. Little indulgence.", descriptionAr: "شوكولاتة غنية ولحظة حلوة.", price: 12, image: asset("brownie") },
    ],
  },
];

export const DISPLAY_PRODUCTS = DISPLAY_MENU.flatMap((section) => section.products);

export function displayMoney(value: number) {
  return value.toFixed(2);
}
