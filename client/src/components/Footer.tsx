import { Link } from "wouter";
import { ShoppingBag, Instagram, Facebook, Twitter } from "lucide-react";

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function Footer() {
  const linkClass = "text-gray-500 hover:text-primary transition-colors cursor-pointer bg-transparent p-0 text-right";

  return (
    <footer className="border-t border-gray-100 bg-white pb-5 pt-8 md:pb-8 md:pt-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-6 grid grid-cols-1 gap-6 md:mb-12 md:grid-cols-4 md:gap-10">
          
          {/* Brand Info */}
          <div className="md:col-span-2">
            <Link href="/" className="group mb-3 inline-flex items-center gap-2 md:mb-6">
              <div className="rounded-xl bg-primary/10 p-1.5 md:p-2">
                <ShoppingBag className="h-5 w-5 text-primary md:h-6 md:w-6" />
              </div>
              <span className="text-xl font-bold text-gray-900 md:text-2xl">
                سوق أبدع
              </span>
            </Link>
            <p className="mb-3 max-w-sm text-xs leading-5 text-gray-500 md:mb-6 md:text-base md:leading-relaxed">
              المنصة الأردنية الأولى لدعم وتمكين الحرفيين وأصحاب المشاريع المنزلية، نصلك بأفضل المنتجات اليدوية المصنوعة بشغف.
            </p>
            <div className="flex items-center gap-2 md:gap-4">
              <a href="https://www.instagram.com/souqabda" target="_blank" rel="noopener noreferrer" aria-label="إنستغرام" className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-500 transition-colors hover:bg-primary hover:text-white md:h-10 md:w-10">
                <Instagram className="h-4 w-4 md:h-5 md:w-5" />
              </a>
              <a href="https://www.facebook.com/souqabda" target="_blank" rel="noopener noreferrer" aria-label="فيسبوك" className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-500 transition-colors hover:bg-primary hover:text-white md:h-10 md:w-10">
                <Facebook className="h-4 w-4 md:h-5 md:w-5" />
              </a>
              <a href="https://www.x.com/souqabda" target="_blank" rel="noopener noreferrer" aria-label="تويتر" className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-500 transition-colors hover:bg-primary hover:text-white md:h-10 md:w-10">
                <Twitter className="h-4 w-4 md:h-5 md:w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-3 text-base font-bold text-gray-900 md:mb-6 md:text-lg">روابط سريعة</h4>
            <ul className="space-y-2 text-sm md:space-y-4 md:text-base">
              <li><button type="button" onClick={() => scrollToSection("trust-section")} className={linkClass}>من نحن</button></li>
              <li><button type="button" onClick={() => scrollToSection("categories")} className={linkClass}>تصفح الفئات</button></li>
              <li><button type="button" onClick={() => scrollToSection("featured-products")} className={linkClass}>أحدث الإبداعات</button></li>
              <li><button type="button" onClick={() => scrollToSection("seller-form")} className={linkClass}>انضم كبائع</button></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-3 text-base font-bold text-gray-900 md:mb-6 md:text-lg">تواصل معنا</h4>
            <ul className="space-y-2 text-sm md:space-y-4 md:text-base">
              <li>
                <a href="mailto:info@souqabda.com" className="text-gray-500 hover:text-primary transition-colors">
                  info@souqabda.com
                </a>
              </li>
              <li className="text-gray-500">عمّان، الأردن</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-2 border-t border-gray-100 pt-5 text-xs text-gray-400 md:flex-row md:gap-4 md:pt-8 md:text-sm">
          <p>جميع الحقوق محفوظة © {new Date().getFullYear()} سوق أبدع.</p>
          <p>صنع بحب في الأردن</p>
        </div>
      </div>
    </footer>
  );
}
