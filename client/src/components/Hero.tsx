import { motion } from "framer-motion";
import { assets } from "@/data";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function Hero() {
  const scrollToProducts = () => {
    const el = document.getElementById("featured-products");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative flex min-h-[360px] w-full items-center justify-center overflow-hidden md:min-h-[85vh]">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={assets.hero} 
          alt="Arabic Souk Market" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/50 to-gray-950/30" />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 md:px-6 mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <span className="mb-3 inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium tracking-wide text-white sm:mb-6 sm:px-4 sm:py-1.5 sm:text-sm">
            السوق الحرفي الأول في الأردن
          </span>
          <h1 className="mb-3 text-2xl font-extrabold leading-tight text-white sm:text-4xl md:mb-6 md:text-6xl lg:text-7xl">
            أبدع واختار من أفضل المنتجات اليدوية في{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-secondary to-primary">
              الأردن
            </span>
          </h1>
          <p className="mx-auto mb-5 max-w-2xl text-sm font-light leading-6 text-gray-200 sm:text-lg sm:leading-relaxed md:mb-10 md:text-2xl">
            ادعم الحرفيين المحليين واكتشف قطعاً فريدة صنعت بحب وإتقان، تصلك مباشرة من صناعها.
          </p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button onClick={scrollToProducts} className="rounded-full bg-gradient-to-r from-secondary to-primary px-6 py-3 text-sm font-bold text-white shadow-[0_0_40px_rgba(221,107,32,0.3)] transition-all hover:-translate-y-1 sm:px-10 sm:py-7 sm:text-lg">تصفح المنتجات</Button>
              <Button asChild variant="outline" className="rounded-full border-white/50 bg-white/10 px-5 py-3 text-sm font-bold text-white hover:bg-white/20 sm:px-8 sm:py-7 sm:text-lg"><Link href="/register-seller">انضم كبائع</Link></Button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Bottom Arch */}
      <div className="absolute bottom-0 inset-x-0 w-full h-16 bg-gray-50 rounded-t-[100%] scale-x-150" />
    </section>
  );
}
