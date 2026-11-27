import { Utensils, Scissors, Gift, Home, Sparkles } from "lucide-react";

export type Product = {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  price: string;
  seller: string;
  sellerPhone: string;
  category: string;
  image: string;
  isVIP?: boolean;
};

export const assets = {
  hero: "/manus-storage/hero-souk_8a8e0cb2.jpg",
};

export const categories = [
  { id: "food", label: "طعام منزلي", icon: Utensils, color: "bg-orange-100 text-orange-600 border-orange-200" },
  { id: "crochet", label: "كروشيه", icon: Scissors, color: "bg-rose-100 text-rose-600 border-rose-200" },
  { id: "gifts", label: "هدايا", icon: Gift, color: "bg-purple-100 text-purple-600 border-purple-200" },
  { id: "decor", label: "ديكورات", icon: Home, color: "bg-teal-100 text-teal-600 border-teal-200" },
  { id: "accessories", label: "إكسسوارات", icon: Sparkles, color: "bg-amber-100 text-amber-600 border-amber-200" },
];

export const products: Product[] = [
  {
    id: "cake-1",
    name: "كيكة المناسبات المنزلية (تجريبي)",
    shortDescription: "كيكة طازجة بتصميم خاص للمناسبات والاحتفالات.",
    description: "كيكة إسفنجية هشة تُحضّر عند الطلب بمكونات مختارة، مع إمكانية تخصيص الألوان والعبارة والتزيين حسب مناسبتك.",
    price: "18 د.أ",
    seller: "مخبز السعادة",
    sellerPhone: "962790000000",
    category: "food",
    image: "/manus-storage/product-cake_86aef5c9.jpg",
    isVIP: true,
  },
  {
    id: "candle-1",
    name: "شمعة ياسمين عطرية (تجريبي)",
    shortDescription: "رائحة هادئة ولمسة دافئة لزاوية تحبها.",
    description: "شمعة صويا طبيعية مصبوبة يدوياً برائحة الياسمين، بفتيل خشبي واحتراق هادئ يدوم لساعات طويلة.",
    price: "7 د.أ",
    seller: "لمسة نور",
    sellerPhone: "962790000001",
    category: "decor",
    image: "/manus-storage/product-candle_051920d0.jpg",
    isVIP: true,
  },
  {
    id: "crochet-1",
    name: "حقيبة كروشيه يومية (تجريبي)",
    shortDescription: "قطعة عملية مصنوعة بحب من خيوط قطنية.",
    description: "حقيبة كروشيه متينة بخيوط قطنية ناعمة، مناسبة للاستخدام اليومي ويمكن اختيار لونها وحجمها عند التواصل مع البائعة.",
    price: "14 د.أ",
    seller: "خيط وحكاية",
    sellerPhone: "962790000002",
    category: "crochet",
    image: "/manus-storage/product-crochet_b42283f6.jpg",
  },
  {
    id: "embroidery-1",
    name: "لوحة تطريز فلسطيني (تجريبي)",
    shortDescription: "تطريز يدوي يحتفي بالتفاصيل والهوية.",
    description: "لوحة مطرزة يدوياً بغرز دقيقة وألوان مستوحاة من التراث، تصلح كهدية أو قطعة فنية مميزة للمنزل.",
    price: "22 د.أ",
    seller: "إبرة وحنين",
    sellerPhone: "962790000003",
    category: "decor",
    image: "/manus-storage/product-embroidery_6680b238.jpg",
    isVIP: true,
  },
  {
    id: "giftbox-1",
    name: "صندوق هدية صباحية (تجريبي)",
    shortDescription: "تفاصيل صغيرة تصنع فرحة كبيرة.",
    description: "صندوق هدية منسق يضم منتجات محلية مختارة بعناية، مع بطاقة إهداء وتغليف أنيق جاهز للمناسبة.",
    price: "16 د.أ",
    seller: "هدية من القلب",
    sellerPhone: "962790000004",
    category: "gifts",
    image: "/manus-storage/product-giftbox_dac71a12.jpg",
  },
  {
    id: "jewelry-1",
    name: "طقم إكسسوارات حجر طبيعي (تجريبي)",
    shortDescription: "أناقة بسيطة مستوحاة من ألوان الطبيعة.",
    description: "طقم يدوي من عقد وأقراط بأحجار طبيعية مختارة، خفيف ومناسب للإطلالات اليومية والمناسبات.",
    price: "12 د.أ",
    seller: "تفاصيل ذهبية",
    sellerPhone: "962790000005",
    category: "accessories",
    image: "/manus-storage/product-jewelry_0a06dea5.jpg",
    isVIP: true,
  },
];

export function categoryLabel(id: string) {
  return categories.find((category) => category.id === id)?.label ?? id;
}
