import { useEffect, useMemo, useState } from "react";
import { categories, categoryLabel, products, type Product } from "@/data";
import { ProductModal } from "@/components/ProductModal";
import { motion } from "framer-motion";
import { Crown, MessageCircle, PackageSearch, Search } from "lucide-react";
import { trpc } from "@/lib/trpc";

type PriceFilter = "all" | "under10" | "10to20" | "over20";

export function ProductGrid({ selectedCategory }: { selectedCategory: string | null }) {
  const [selected, setSelected] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");
  const { data: storedProducts = [], isLoading } = trpc.catalog.list.useQuery();
  const all = useMemo(() => [...storedProducts, ...products], [storedProducts]);

  useEffect(() => {
    const onPriceFilter = (event: Event) => setPriceFilter((event as CustomEvent<PriceFilter>).detail);
    const onSearch = (event: Event) => setSearchTerm((event as CustomEvent<string>).detail);
    window.addEventListener("souq-price-filter", onPriceFilter);
    window.addEventListener("souq-product-search", onSearch);
    return () => { window.removeEventListener("souq-price-filter", onPriceFilter); window.removeEventListener("souq-product-search", onSearch); };
  }, []);

  const filtered = useMemo(() => {
    const query = searchTerm.trim().toLocaleLowerCase("ar");
    return all.filter((product) => {
      const price = Number(String(product.price).replace(",", ".").match(/\d+(?:\.\d+)?/)?.[0] ?? 0);
      const matchesPrice = priceFilter === "all" || (priceFilter === "under10" && price < 10) || (priceFilter === "10to20" && price >= 10 && price <= 20) || (priceFilter === "over20" && price > 20);
      return (!selectedCategory || product.category === selectedCategory) && (!query || `${product.name} ${product.seller}`.toLocaleLowerCase("ar").includes(query)) && matchesPrice;
    });
  }, [all, selectedCategory, searchTerm, priceFilter]);
  const category = selectedCategory ? categories.find((item) => item.id === selectedCategory) : null;

  const handleWhatsApp = (event: React.MouseEvent, product: Product) => {
    event.stopPropagation();
    const text = encodeURIComponent(`مرحباً، أرغب بطلب منتج "${product.name}" من متجر ${product.seller}. السعر: ${product.price}. هل المنتج متاح؟`);
    window.dispatchEvent(new CustomEvent("souq-whatsapp-click", { detail: { productId: product.id, productName: product.name, seller: product.seller, price: product.price } }));
    window.open(`https://wa.me/${product.sellerPhone}?text=${text}`, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="featured-products" className="bg-white py-8 sm:py-12" dir="rtl">
      <div className="mx-auto max-w-7xl px-3 sm:px-6">
        <div className="mb-5 flex items-end justify-between gap-3"><div><p className="mb-1 text-xs font-black text-[#D4AF37]">مختارات اليوم</p><h2 className="text-2xl font-black text-[#1A1A1A] sm:text-3xl">{category ? `إبداعات ${category.label}` : "منتجات تستحق التجربة"}</h2></div><span className="text-xs font-bold text-gray-400">{filtered.length} منتج</span></div>
        <label className="relative mb-5 block md:hidden" htmlFor="product-search"><Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><input id="product-search" type="search" value={searchTerm} onChange={(event) => { setSearchTerm(event.target.value); window.dispatchEvent(new CustomEvent("souq-product-search", { detail: event.target.value })); }} placeholder="ابحث عن منتج أو متجر..." className="h-10 w-full rounded-full border border-gray-200 bg-gray-50 px-10 text-sm outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10" /></label>
        {isLoading && <div className="py-16 text-center text-gray-400">جارٍ تحميل المنتجات...</div>}
        {!isLoading && filtered.length === 0 && <div className="flex flex-col items-center gap-3 py-16 text-gray-400"><PackageSearch className="h-10 w-10" />لا توجد منتجات مطابقة لبحثك</div>}
        {!isLoading && filtered.length > 0 && <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3.5 md:grid-cols-4 lg:grid-cols-5">
          {filtered.map((product, index) => <motion.article key={product.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: Math.min(index * .03, .3) }} className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
            <button type="button" className="relative block aspect-square w-full overflow-hidden bg-orange-50" onClick={() => setSelected(product)} aria-label={`عرض تفاصيل ${product.name}`}><img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />{product.isVIP && <span className="absolute right-2 top-2 rounded-full bg-[#D4AF37] px-2 py-1 text-[10px] font-black text-[#1A1A1A]"><Crown className="ml-0.5 inline h-3 w-3" /> مميز</span>}</button>
            <div className="flex min-h-[154px] flex-col p-2.5 sm:min-h-[166px] sm:p-3"><button type="button" onClick={() => setSelected(product)} className="text-right"><h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-black leading-5 text-[#1A1A1A] transition group-hover:text-[#b28e16] sm:text-[15px]">{product.name}</h3></button><div className="mt-1 flex items-center justify-between gap-1"><span className="max-w-[60%] truncate text-[10px] font-bold text-gray-500">{product.seller}</span><span className="rounded bg-orange-50 px-1.5 py-0.5 text-[10px] font-bold text-[#b28e16]">{categoryLabel(product.category)}</span></div><div className="mt-auto flex items-center justify-between gap-1 pt-2"><b className="text-sm font-black text-[#1A1A1A]">{product.price}</b><button type="button" onClick={(event) => handleWhatsApp(event, product)} className="flex items-center gap-1 rounded-lg bg-[#25D366] px-2 py-1.5 text-[10px] font-black text-white transition hover:bg-[#1fad58] sm:text-xs"><MessageCircle className="h-3.5 w-3.5" />واتساب</button></div></div>
          </motion.article>)}
        </div>}
        <ProductModal product={selected} isOpen={!!selected} onClose={() => setSelected(null)} />
      </div>
    </section>
  );
}
