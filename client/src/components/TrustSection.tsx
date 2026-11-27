import { MessageCircle, Truck, Users } from "lucide-react";

const benefits = [{ title: "توصيل لجميع المحافظات", icon: Truck }, { title: "دعم المشاريع المنزلية الأردنية", icon: Users }, { title: "طلب مباشر بدون عمولات", icon: MessageCircle }];

export function TrustSection() {
  return <section id="trust-section" className="bg-[#1A1A1A] py-5 text-white" dir="rtl"><div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-white/10 px-3 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:divide-x-reverse sm:px-6">{benefits.map(({ title, icon: Icon }) => <div key={title} className="flex items-center justify-center gap-3 py-3 text-center sm:py-2"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/15 text-[#D4AF37]"><Icon className="h-4 w-4" /></span><span className="text-sm font-bold text-white/90">{title}</span></div>)}</div></section>;
}
