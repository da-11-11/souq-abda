import { Link } from "wouter";
import { ArrowLeft, Heart, MapPin, MessageCircle, ShieldCheck, Sparkles, Store } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function About() {
  return <div className="min-h-screen bg-white font-sans text-gray-900" dir="rtl">
    <Navbar />
    <main>
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-amber-50 px-4 py-16 md:py-24">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-orange-200/30 blur-3xl" />
        <div className="relative mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-primary"><Sparkles className="h-4 w-4" />قصتنا وهويتنا</span>
            <h1 className="mb-6 text-4xl font-black leading-tight text-gray-950 md:text-6xl">نقرّب الإبداع الأردني من كل بيت</h1>
            <p className="max-w-2xl text-base leading-8 text-gray-600 md:text-xl">سوق أبدع هي المنصة الأردنية المتخصصة في دعم وتمكين المشاريع المنزلية والحرفية، وربط أصحابها بالزبائن مباشرة في جميع المحافظات.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/#products" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 font-black text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5">تصفح المنتجات <ArrowLeft className="h-5 w-5" /></Link>
              <Link href="/register-seller" className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-primary bg-white px-6 py-3.5 font-black text-primary transition hover:bg-orange-50">انضمام كبائع <Store className="h-5 w-5" /></Link>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-5 px-4 py-12 md:grid-cols-3 md:py-16">
        <InfoCard icon={<Heart />} title="نؤمن بالمبدعين" text="كل مشروع منزلي يحمل قصة وجهدًا يستحقان الوصول إلى الزبون المناسب." />
        <InfoCard icon={<MapPin />} title="من كل المحافظات" text="نفتح المجال أمام الحرفيين وأصحاب المشاريع الأردنية ليصلوا إلى عملائهم أينما كانوا." />
        <InfoCard icon={<ShieldCheck />} title="طلب مباشر بلا عمولات" text="يتواصل الزبون مع صاحب المشروع مباشرة عبر واتساب، ببساطة ووضوح." />
      </section>
      <section className="bg-[#fff7ed] px-4 py-14 md:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1.1fr_.9fr]">
          <div><h2 className="mb-5 text-3xl font-black text-gray-950 md:text-4xl">رؤيتنا للمستقبل</h2><p className="text-base leading-8 text-gray-600 md:text-lg">نطمح أن يصبح سوق أبدع الوجهة الأولى لكل من يبحث عن منتج أردني أصيل، وأن يكون مساحة نمو حقيقية لكل موهبة ومشروع صغير. نعمل على بناء سوق محلي دافئ يقدّر الجودة، ويدعم الاستقلال، ويجعل الوصول إلى العملاء أسهل.</p></div>
          <div className="rounded-3xl border border-orange-100 bg-white p-7 shadow-sm"><MessageCircle className="mb-4 h-9 w-9 text-primary" /><h3 className="mb-3 text-xl font-black">ابدأ رحلتك معنا</h3><p className="mb-5 leading-7 text-gray-600">تصفح الإبداعات الأردنية أو سجّل مشروعك وشارك منتجاتك مع مجتمع يهتم بما تصنعه.</p><Link href="/register-seller" className="inline-flex items-center gap-2 font-black text-primary hover:gap-3">سجّل مشروعك الآن <ArrowLeft className="h-4 w-4" /></Link></div>
        </div>
      </section>
    </main>
    <Footer />
  </div>;
}

function InfoCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <article className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm"><div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-primary">{icon}</div><h3 className="mb-3 text-xl font-black">{title}</h3><p className="leading-7 text-gray-600">{text}</p></article>;
}
