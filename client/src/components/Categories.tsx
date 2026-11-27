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
    <section id="categories" className="overflow-hidden bg-gray-50 py-6 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-4 flex items-center justify-between md:mb-8">
          <h2 className="text-xl font-bold text-gray-900 md:text-3xl">تسوق حسب الفئة</h2>
        </div>

        {/* Horizontal scroll container with hidden scrollbar */}
        <div className="-mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-3 md:mx-0 md:gap-6 md:px-0 md:pb-6">
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
                className={`flex h-24 w-24 flex-col items-center justify-center gap-1.5 rounded-2xl border-2 bg-gray-100 text-gray-700 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg md:h-40 md:w-40 md:gap-3 md:rounded-3xl md:group-hover:-translate-y-2 ${
                selectedCategory === null
                  ? "border-primary ring-2 ring-primary/30 shadow-lg bg-primary/10 text-primary"
                  : "border-gray-200"
              }`}
            >
              <div className="rounded-full bg-white/50 p-2 md:p-3">
                <LayoutGrid className="h-5 w-5 md:h-10 md:w-10" />
              </div>
              <span className="text-xs font-bold md:text-base">الكل</span>
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
                  className={`flex h-24 w-24 flex-col items-center justify-center gap-1.5 rounded-2xl border-2 ${category.color} transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg md:h-40 md:w-40 md:gap-3 md:rounded-3xl md:group-hover:-translate-y-2 ${
                    isActive ? "ring-2 ring-primary border-primary shadow-lg -translate-y-2" : ""
                  }`}
                >
                  <div className="rounded-full bg-white/50 p-2 md:p-3">
                    <Icon className="h-5 w-5 md:h-10 md:w-10" />
                  </div>
                  <span className="text-xs font-bold md:text-base">{category.label}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-1.5 md:gap-2" aria-label="فلترة حسب السعر">
          <span className="ml-1 text-xs font-bold text-gray-500 md:ml-2 md:text-sm">السعر بالدينار الأردني:</span>
          {priceFilters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => selectPrice(filter.id)}
              aria-pressed={selectedPrice === filter.id}
              className={`rounded-full border px-2.5 py-1 text-[11px] font-bold transition md:px-4 md:py-2 md:text-sm ${selectedPrice === filter.id ? "border-primary bg-primary text-white shadow-md" : "border-gray-200 bg-white text-gray-600 hover:border-primary/50 hover:text-primary"}`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
