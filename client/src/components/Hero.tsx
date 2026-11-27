import { motion } from "framer-motion";
import { assets } from "@/data";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function Hero() {
  const scrollToProducts = () => document.getElementById("featured-products")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative overflow-hidden bg-[#1A1A1A]" dir="rtl">
      <div className="absolute inset-0"><img src={assets.hero} alt="منتجات يدوية أردنية" className="h-full w-full object-cover opacity-35" /><div className="absolute inset-0 bg-gradient-to-l from-[#1A1A1A]/95 via-[#1A1A1A]/75 to-[#1A1A1A]/40" /></div>
      <div className="relative mx-auto flex min-h-[250px] max-w-7xl items-center px-4 py-10 sm:min-h-[290px] sm:px-6 md:py-12">
        <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .5 }} className="max-w-2xl text-white">
          <span className="mb-3 inline-flex rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/10 px-3 py-1 text-xs font-bold text-[#D4AF37]">صناعة أردنية بحب</span>
          <h1 className="text-3xl font-black leading-tight sm:text-5xl">اكتشف قطعاً <span className="text-[#D4AF37]">تستحق الاقتناء</span></h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-white/75 sm:text-base">منتجات يدوية أصيلة من أصحاب المشاريع المنزلية الأردنية، بطلب مباشر وبدون عمولات.</p>
          <Button onClick={scrollToProducts} className="mt-5 rounded-full bg-[#D4AF37] px-6 font-black text-[#1A1A1A] hover:bg-[#e4c45b]"><ArrowLeft className="ml-2 h-4 w-4" />تصفح المنتجات</Button>
        </motion.div>
      </div>
    </section>
  );
}
