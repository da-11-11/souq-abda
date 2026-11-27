import { motion } from "framer-motion";
import { ShieldCheck, Truck, MessageCircle } from "lucide-react";

const benefits = [
  {
    id: 1,
    title: "منتجات يدوية أصيلة",
    description: "كل قطعة في سوق أبدع مصنوعة بحب وعناية من قبل حرفيين محليين.",
    icon: ShieldCheck,
    color: "bg-blue-100 text-blue-600"
  },
  {
    id: 2,
    title: "تواصل مباشر مع البائع",
    description: "تحدث مع البائع مباشرة عبر واتساب لطلب تعديلات أو تفاصيل إضافية.",
    icon: MessageCircle,
    color: "bg-green-100 text-green-600"
  },
  {
    id: 3,
    title: "دعم الاقتصاد المحلي",
    description: "شراؤك من سوق أبدع يدعم المشاريع الصغيرة وعائلات الحرفيين في الأردن.",
    icon: Truck,
    color: "bg-orange-100 text-orange-600"
  }
];

export function TrustSection() {
  return (
    <section id="trust-section" className="relative overflow-hidden bg-gray-900 py-8 text-white md:py-20">
      {/* Decorative background elements */}
      <div className="absolute right-0 top-0 hidden h-96 w-96 -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/20 blur-3xl md:block" />
      <div className="absolute bottom-0 left-0 hidden h-96 w-96 -translate-x-1/2 translate-y-1/2 rounded-full bg-secondary/20 blur-3xl md:block" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="mb-6 text-center md:mb-16">
          <h2 className="mb-2 text-2xl font-bold md:mb-4 md:text-4xl">لماذا سوق أبدع؟</h2>
          <p className="mx-auto max-w-2xl text-sm leading-6 text-gray-400 md:text-lg">
            نحن لسنا مجرد متجر إلكتروني، نحن مجتمع يجمع صناع الجمال بمقدري الفن الأصيل.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-12">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="rounded-2xl border border-gray-700/50 bg-gray-800/50 p-4 text-center backdrop-blur-sm transition-colors hover:bg-gray-800 md:rounded-3xl md:p-8"
              >
                <div className={`mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${benefit.color} bg-opacity-20 md:mb-6 md:h-16 md:w-16 md:rounded-2xl`}>
                  <Icon className="h-5 w-5 md:h-8 md:w-8" />
                </div>
                <h3 className="mb-1.5 text-base font-bold md:mb-3 md:text-xl">{benefit.title}</h3>
                <p className="text-xs leading-5 text-gray-400 md:text-base md:leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
