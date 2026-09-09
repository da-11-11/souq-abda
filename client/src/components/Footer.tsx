import { Link } from "wouter";
import { ShoppingBag, Instagram, Facebook, Twitter } from "lucide-react";

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function Footer() {
  const linkClass = "text-gray-500 hover:text-primary transition-colors cursor-pointer bg-transparent p-0 text-right";

  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 group mb-6 inline-flex">
              <div className="bg-primary/10 p-2 rounded-xl">
                <ShoppingBag className="w-6 h-6 text-primary" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                سوق أبدع
              </span>
            </Link>
            <p className="text-gray-500 max-w-sm mb-6 leading-relaxed">
              المنصة الأردنية الأولى لدعم وتمكين الحرفيين وأصحاب المشاريع المنزلية، نصلك بأفضل المنتجات اليدوية المصنوعة بشغف.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://www.instagram.com/souqabda" target="_blank" rel="noopener noreferrer" aria-label="إنستغرام" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.facebook.com/souqabda" target="_blank" rel="noopener noreferrer" aria-label="فيسبوك" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.x.com/souqabda" target="_blank" rel="noopener noreferrer" aria-label="تويتر" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6 text-lg">روابط سريعة</h4>
            <ul className="space-y-4">
              <li><button type="button" onClick={() => scrollToSection("trust-section")} className={linkClass}>من نحن</button></li>
              <li><button type="button" onClick={() => scrollToSection("categories")} className={linkClass}>تصفح الفئات</button></li>
              <li><button type="button" onClick={() => scrollToSection("featured-products")} className={linkClass}>أحدث الإبداعات</button></li>
              <li><button type="button" onClick={() => scrollToSection("seller-form")} className={linkClass}>انضم كبائع</button></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6 text-lg">تواصل معنا</h4>
            <ul className="space-y-4">
              <li>
                <a href="mailto:info@souqabda.com" className="text-gray-500 hover:text-primary transition-colors">
                  info@souqabda.com
                </a>
              </li>
              <li className="text-gray-500">عمّان، الأردن</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <p>جميع الحقوق محفوظة © {new Date().getFullYear()} سوق أبدع.</p>
          <p>صنع بحب في الأردن</p>
        </div>
      </div>
    </footer>
  );
}
