import { useEffect, useMemo, useState } from "react";
import { categories, products, type Product } from "@/data";
import { ProductModal } from "@/components/ProductModal";
import { motion } from "framer-motion";
import { Crown, Heart, PackageSearch, Search } from "lucide-react";
import { trpc } from "@/lib/trpc";

export function ProductGrid({ selectedCategory }: { selectedCategory: string | null }) {
  const [selected, setSelected] = useState<Product | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState<"all" | "under10" | "10to20" | "over20">("all");
  const { data: storedProducts = [], isLoading } = trpc.catalog.list.useQuery();
  const all = useMemo(() => [...storedProducts, ...products], [storedProducts]);
  useEffect(() => {
    const onPriceFilter = (event: Event) => setPriceFilter((event as CustomEvent<typeof priceFilter>).detail);
    window.addEventListener("souq-price-filter", onPriceFilter);
    return () => window.removeEventListener("souq-price-filter", onPriceFilter);
  }, []);
  const filtered = useMemo(
    () => {
      const query = searchTerm.trim().toLocaleLowerCase("ar");
      return all.filter((product) => {
        const matchesCategory = !selectedCategory || product.category === selectedCategory;
        const matchesSearch = !query || `${product.name} ${product.seller}`.toLocaleLowerCase("ar").includes(query);
        const price = Number(String(product.price).replace(",", ".").match(/\d+(?:\.\d+)?/)?.[0] ?? 0);
        const matchesPrice = priceFilter === "all" || (priceFilter === "under10" && price < 10) || (priceFilter === "10to20" && price >= 10 && price <= 20) || (priceFilter === "over20" && price > 20);
        return matchesCategory && matchesSearch && matchesPrice;
      });
    },
    [all, selectedCategory, searchTerm, priceFilter],
  );
  const category = selectedCategory ? categories.find((item) => item.id === selectedCategory) : null;

  return (
    <section id="featured-products" className="bg-white py-8 md:py-28">
      <div className="container mx-auto px-3 md:px-6">
        <div className="mb-5 md:mb-12">
          <p className="mb-2 text-xs font-bold text-primary md:mb-4 md:text-sm">مختارات صُنّاعنا</p>
          <h2 className="text-xl font-black md:text-5xl">{category ? `إبداعات ${category.label}` : "أشياء جميلة، صنعت بحب"}</h2>
          <p className="mt-2 text-sm leading-6 text-gray-500 md:mt-4 md:text-lg">مجموعة مختارة من المنتجات اليدوية المصنوعة بشغف وإتقان من حرفيين أردنيين.</p>
          <label className="relative mt-4 block max-w-2xl md:mt-7" htmlFor="product-search">
            <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input id="product-search" type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="ابحث باسم المنتج أو اسم المتجر..." className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-10 text-sm outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 md:h-14 md:rounded-2xl md:px-12 md:text-base" />
          </label>
        </div>
        {isLoading && <div className="py-8 text-center text-sm text-gray-400 md:py-12">جارٍ تحميل أحدث المنتجات...</div>}
        {!isLoading && filtered.length === 0 && <div className="flex flex-col items-center gap-3 py-12 text-sm text-gray-400 md:gap-4 md:py-20"><PackageSearch className="h-10 w-10 md:h-12 md:w-12" />لا توجد منتجات في هذه الفئة حالياً</div>}
        {!isLoading && filtered.length > 0 && <div className="grid grid-cols-2 gap-2.5 sm:gap-6 lg:grid-cols-4">
          {filtered.map((product, index) => {
            const favorite = favorites.includes(product.id);
            return <motion.article key={product.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} onClick={() => setSelected(product)} className="group cursor-pointer overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:rounded-[1.75rem]">
              <div className="relative aspect-square overflow-hidden bg-orange-50 sm:aspect-[4/3]">
                <img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                {product.isVIP && <span className="absolute right-2 top-2 rounded-full bg-[#ffb300] px-2 py-0.5 text-[10px] font-black sm:right-4 sm:top-4 sm:px-3 sm:py-1 sm:text-xs"><Crown className="inline h-3 w-3" /> مميز</span>}
                <button type="button" aria-label="المفضلة" onClick={(event) => { event.stopPropagation(); setFavorites((current) => favorite ? current.filter((id) => id !== product.id) : [...current, product.id]); }} className={`absolute left-2 top-2 rounded-full p-1.5 ${favorite ? "bg-red-500 text-white" : "bg-white/90 text-gray-500"} sm:left-4 sm:top-4 sm:p-2.5`}><Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${favorite ? "fill-current" : ""}`} /></button>
              </div>
              <div className="flex min-h-[165px] flex-col p-2.5 sm:min-h-[210px] sm:p-5">
                <div className="mb-1.5 flex items-center justify-between gap-1 sm:mb-3 sm:gap-3"><span className="max-w-[62%] truncate rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-bold text-primary sm:px-3 sm:py-1 sm:text-xs">{product.seller}</span><b className="shrink-0 text-xs sm:text-base">{product.price}</b></div>
                <h3 className="line-clamp-2 text-sm font-black leading-5 group-hover:text-primary sm:text-xl sm:leading-normal">{product.name}</h3>
                <p className="mt-1 line-clamp-2 flex-1 text-xs leading-5 text-gray-500 sm:mt-2 sm:text-sm sm:leading-7">{product.shortDescription}</p>
                <div className="border-t pt-2 text-[11px] font-bold text-primary sm:pt-4 sm:text-sm">عرض التفاصيل ←</div>
              </div>
            </motion.article>;
          })}
        </div>}
        <ProductModal product={selected} isOpen={!!selected} onClose={() => setSelected(null)} />
      </div>
    </section>
  );
}
