import { Link } from "wouter";
import { Facebook, Instagram, Mail, MessageCircle, Phone, ShoppingBag } from "lucide-react";
import { CONTACT_EMAIL, FACEBOOK_URL, INSTAGRAM_URL, WHATSAPP_LOCAL_NUMBER, WHATSAPP_NUMBER } from "@/const";
import { formatJordanWhatsappNumber } from "@shared/phone";

const linkClass = "text-gray-600 transition-colors hover:text-primary";
const whatsappUrl = `https://wa.me/${formatJordanWhatsappNumber(WHATSAPP_NUMBER) ?? WHATSAPP_NUMBER}`;

export function Footer() {
  return <footer className="border-t border-orange-100 bg-white pb-5 pt-10 md:pb-8 md:pt-16" dir="rtl">
    <div className="container mx-auto px-4 md:px-6">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12">
        <section>
          <Link href="/" className="mb-4 inline-flex items-center gap-2"><span className="rounded-xl bg-orange-100 p-2"><ShoppingBag className="h-6 w-6 text-primary" /></span><span className="text-2xl font-black text-gray-950">سوق أبدع</span></Link>
          <p className="max-w-sm text-sm leading-7 text-gray-600">منصة أردنية تدعم المشاريع المنزلية والحرفية وتوصلك بمنتجات مميزة مباشرة من أصحابها.</p>
          <div className="mt-5 flex items-center gap-3">
            <SocialLink href={INSTAGRAM_URL} label="إنستغرام"><Instagram /></SocialLink>
            <SocialLink href={FACEBOOK_URL} label="فيسبوك"><Facebook /></SocialLink>
            <SocialLink href={whatsappUrl} label="واتساب"><MessageCircle /></SocialLink>
          </div>
        </section>
        <section>
          <h2 className="mb-5 text-lg font-black text-gray-950">روابط سريعة</h2>
          <nav className="flex flex-col items-start gap-3 text-sm"><Link href="/about" className={linkClass}>من نحن</Link><Link href="/#categories" className={linkClass}>تصفح الفئات</Link><Link href="/#products" className={linkClass}>أحدث الإبداعات</Link><Link href="/register-seller" className={linkClass}>انضمام كبائع</Link></nav>
        </section>
        <section>
          <h2 className="mb-5 text-lg font-black text-gray-950">تواصل معنا</h2>
          <div className="space-y-3 text-sm"><a href={`tel:${WHATSAPP_LOCAL_NUMBER}`} className={`flex items-center gap-2 ${linkClass}`}><Phone className="h-4 w-4 text-primary" />{WHATSAPP_LOCAL_NUMBER}</a><a href={`mailto:${CONTACT_EMAIL}`} className={`flex items-center gap-2 ${linkClass}`}><Mail className="h-4 w-4 text-primary" />{CONTACT_EMAIL}</a><a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 font-black text-white transition hover:-translate-y-0.5"><MessageCircle className="h-5 w-5" />تواصل معنا مباشرة</a></div>
        </section>
      </div>
      <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-orange-100 pt-5 text-xs text-gray-500 md:flex-row md:pt-8 md:text-sm"><p>جميع الحقوق محفوظة © {new Date().getFullYear()} سوق أبدع.</p><p>صنع بحب في الأردن</p></div>
    </div>
  </footer>;
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) { return <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-primary transition hover:bg-primary hover:text-white">{children}</a>; }
