import { useMemo, useState } from "react";
import { categories, products, type Product } from "@/data";
import { ProductModal } from "@/components/ProductModal";
import { motion } from "framer-motion";
import { Crown, Heart, PackageSearch } from "lucide-react";

export function ProductGrid({ selectedCategory }: { selectedCategory: string | null }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  const filteredProducts = useMemo(
    () => selectedCategory ? products.filter((product) => product.category === selectedCategory) : products,
    [selectedCategory],
  );
  const category = selectedCategory ? categories.find((item) => item.id === selectedCategory) : null;

  const toggleFavorite = (id: string) => {
    setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  return (
    <section id="featured-products" className="relative overflow-hidden bg-white py-20 md:py-28">
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-3 text-sm font-bold text-primary">
              <span className="h-px w-10 bg-primary" />
              مختارات صُنّاعنا
            </div>
            <h2 className="text-3xl font-black tracking-tight text-gray-950 md:text-5xl">
              {category ? `إبداعات ${category.label}` : "أشياء جميلة، صنعت بحب"}
            </h2>
            <p className="mt-4 text-base leading-8 text-gray-500 md:text-lg">
              مجموعة مختارة من المنتجات اليدوية المصنوعة بشغف وإتقان من قبل حرفيين أردنيين.
            </p>
          </div>
          <p className="hidden rounded-full bg-orange-50 px-4 py-2 text-sm font-bold text-primary md:block">{filteredProducts.length} منتجات متاحة الآن</p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-[2rem] bg-gray-50 py-20 text-center text-gray-400">
            <PackageSearch className="h-12 w-12" />
            <p className="text-lg">لا توجد منتجات في هذه الفئة حالياً</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product, index) => {
              const isFavorite = favorites.includes(product.id);
              return (
                <motion.article
                  key={product.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: index * 0.07, duration: 0.45 }}
                  className="group cursor-pointer overflow-hidden rounded-[1.75rem] border border-gray-100 bg-white shadow-[0_10px_40px_rgba(24,24,28,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(24,24,28,0.12)]"
                  onClick={() => setSelectedProduct(product)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedProduct(product);
                    }
                  }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-orange-50">
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/25 to-transparent" />
                    {product.isVIP && (
                      <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-[#ffb300] px-3 py-1.5 text-xs font-black text-gray-950 shadow-lg">
                        <Crown className="h-3.5 w-3.5" />
                        مميز
                      </div>
                    )}
                    <button
                      type="button"
                      aria-label={isFavorite ? "إزالة من المفضلة" : "أضف إلى المفضلة"}
                      onClick={(event) => { event.stopPropagation(); toggleFavorite(product.id); }}
                      className={`absolute left-4 top-4 rounded-full p-2.5 backdrop-blur-md transition-colors ${isFavorite ? "bg-red-500 text-white" : "bg-white/85 text-gray-500 hover:bg-white hover:text-red-500"}`}
                    >
                      <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
                    </button>
                  </div>
                  <div className="flex min-h-[218px] flex-col p-5 md:p-6">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-primary">{product.seller}</span>
                      <span className="whitespace-nowrap text-lg font-black text-gray-950">{product.price}</span>
                    </div>
                    <h3 className="mb-2 text-xl font-black text-gray-950 transition-colors group-hover:text-primary">{product.name}</h3>
                    <p className="line-clamp-2 flex-1 text-sm leading-7 text-gray-500">{product.shortDescription}</p>
                    <div className="mt-5 border-t border-gray-100 pt-4 text-sm font-black text-primary">عرض التفاصيل <span className="mr-1 inline-block transition-transform group-hover:-translate-x-1">←</span></div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
