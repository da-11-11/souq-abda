import { categories } from "@/data";
import { motion } from "framer-motion";
import { LayoutGrid } from "lucide-react";
import { useState } from "react";

type PriceFilter = "all" | "under10" | "10to20" | "over20";

export function Categories({
  selectedCategory,
  onSelectCategory,
}: {
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
}) {
  const [selectedPrice, setSelectedPrice] = useState<PriceFilter>("all");
  const priceFilters: { id: PriceFilter; label: string }[] = [
    { id: "all", label: "الكل" },
    { id: "under10", label: "أقل من 10 دنانير" },
    { id: "10to20", label: "10 - 20 ديناراً" },
    { id: "over20", label: "أكثر من 20 ديناراً" },
  ];

  const selectPrice = (id: PriceFilter) => {
    setSelectedPrice(id);
    window.dispatchEvent(new CustomEvent<PriceFilter>("souq-price-filter", { detail: id }));
  };

  return (
    <section id="categories" className="py-16 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">تسوق حسب الفئة</h2>
        </div>

        {/* Horizontal scroll container with hidden scrollbar */}
        <div className="flex overflow-x-auto pb-6 gap-4 md:gap-6 snap-x snap-mandatory hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          {/* "All" reset chip */}
          <motion.button
            type="button"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            onClick={() => onSelectCategory(null)}
            className="snap-start shrink-0 cursor-pointer group"
            aria-pressed={selectedCategory === null}
          >
            <div
              className={`w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-gray-100 text-gray-700 border-2 flex flex-col items-center justify-center gap-3 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-lg ${
                selectedCategory === null
                  ? "border-primary ring-2 ring-primary/30 shadow-lg bg-primary/10 text-primary"
                  : "border-gray-200"
              }`}
            >
              <div className="p-3 bg-white/50 rounded-full group-hover:scale-110 transition-transform duration-300">
                <LayoutGrid className="w-8 h-8 md:w-10 md:h-10" />
              </div>
              <span className="font-bold text-sm md:text-base">الكل</span>
            </div>
          </motion.button>

          {categories.map((category, index) => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.id;
            return (
              <motion.button
                type="button"
                key={category.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (index + 1) * 0.1, duration: 0.5 }}
                onClick={() => onSelectCategory(isActive ? null : category.id)}
                className="snap-start shrink-0 cursor-pointer group"
                aria-pressed={isActive}
              >
                <div
                  className={`w-32 h-32 md:w-40 md:h-40 rounded-3xl ${category.color} border-2 flex flex-col items-center justify-center gap-3 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-lg ${
                    isActive ? "ring-2 ring-primary border-primary shadow-lg -translate-y-2" : ""
                  }`}
                >
                  <div className="p-3 bg-white/50 rounded-full group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 md:w-10 md:h-10" />
                  </div>
                  <span className="font-bold text-sm md:text-base">{category.label}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-2" aria-label="فلترة حسب السعر">
          <span className="ml-2 text-sm font-bold text-gray-500">السعر بالدينار الأردني:</span>
          {priceFilters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => selectPrice(filter.id)}
              aria-pressed={selectedPrice === filter.id}
              className={`rounded-full border px-4 py-2 text-sm font-bold transition ${selectedPrice === filter.id ? "border-primary bg-primary text-white shadow-md" : "border-gray-200 bg-white text-gray-600 hover:border-primary/50 hover:text-primary"}`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
