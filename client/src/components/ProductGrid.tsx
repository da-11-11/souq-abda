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
    <section id="featured-products" className="bg-white py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12">
          <p className="mb-4 text-sm font-bold text-primary">مختارات صُنّاعنا</p>
          <h2 className="text-3xl font-black md:text-5xl">{category ? `إبداعات ${category.label}` : "أشياء جميلة، صنعت بحب"}</h2>
          <p className="mt-4 text-lg text-gray-500">مجموعة مختارة من المنتجات اليدوية المصنوعة بشغف وإتقان من حرفيين أردنيين.</p>
          <label className="relative mt-7 block max-w-2xl" htmlFor="product-search">
            <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input id="product-search" type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="ابحث باسم المنتج أو اسم المتجر..." className="h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 px-12 text-base outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10" />
          </label>
        </div>
        {isLoading && <div className="py-12 text-center text-gray-400">جارٍ تحميل أحدث المنتجات...</div>}
        {!isLoading && filtered.length === 0 && <div className="flex flex-col items-center gap-4 py-20 text-gray-400"><PackageSearch className="h-12 w-12" />لا توجد منتجات في هذه الفئة حالياً</div>}
        {!isLoading && filtered.length > 0 && <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {filtered.map((product, index) => {
            const favorite = favorites.includes(product.id);
            return <motion.article key={product.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} onClick={() => setSelected(product)} className="group cursor-pointer overflow-hidden rounded-[1.75rem] border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="relative aspect-[4/3] overflow-hidden bg-orange-50">
                <img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                {product.isVIP && <span className="absolute right-4 top-4 rounded-full bg-[#ffb300] px-3 py-1 text-xs font-black"><Crown className="inline h-3 w-3" /> مميز</span>}
                <button type="button" aria-label="المفضلة" onClick={(event) => { event.stopPropagation(); setFavorites((current) => favorite ? current.filter((id) => id !== product.id) : [...current, product.id]); }} className={`absolute left-4 top-4 rounded-full p-2.5 ${favorite ? "bg-red-500 text-white" : "bg-white/90 text-gray-500"}`}><Heart className={`h-5 w-5 ${favorite ? "fill-current" : ""}`} /></button>
              </div>
              <div className="flex min-h-[210px] flex-col p-5">
                <div className="mb-3 flex justify-between gap-3"><span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-primary">{product.seller}</span><b>{product.price}</b></div>
                <h3 className="text-xl font-black group-hover:text-primary">{product.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-7 text-gray-500">{product.shortDescription}</p>
                <div className="border-t pt-4 text-sm font-bold text-primary">عرض التفاصيل ←</div>
              </div>
            </motion.article>;
          })}
        </div>}
        <ProductModal product={selected} isOpen={!!selected} onClose={() => setSelected(null)} />
      </div>
    </section>
  );
}
