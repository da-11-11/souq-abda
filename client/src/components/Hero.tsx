import { motion } from "framer-motion";
import { assets } from "@/data";
import { Button } from "@/components/ui/button";

export function Hero() {
  const scrollToProducts = () => {
    const el = document.getElementById("featured-products");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden">
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
          <span className="inline-block py-1.5 px-4 mb-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium tracking-wide">
            السوق الحرفي الأول في الأردن
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight md:leading-tight lg:leading-tight mb-6">
            أبدع واختار من أفضل المنتجات اليدوية في{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-secondary to-primary">
              الأردن
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            ادعم الحرفيين المحليين واكتشف قطعاً فريدة صنعت بحب وإتقان، تصلك مباشرة من صناعها.
          </p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <Button 
              onClick={scrollToProducts}
              className="rounded-full bg-gradient-to-r from-secondary to-primary text-white font-bold text-lg px-10 py-7 shadow-[0_0_40px_rgba(221,107,32,0.3)] hover:shadow-[0_0_60px_rgba(221,107,32,0.5)] transition-all hover:-translate-y-1"
            >
              تصفح المنتجات
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Bottom Arch */}
      <div className="absolute bottom-0 inset-x-0 w-full h-16 bg-gray-50 rounded-t-[100%] scale-x-150" />
    </section>
  );
}
