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
    <section id="trust-section" className="py-20 bg-gray-900 text-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">لماذا سوق أبدع؟</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            نحن لسنا مجرد متجر إلكتروني، نحن مجتمع يجمع صناع الجمال بمقدري الفن الأصيل.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-8 rounded-3xl text-center hover:bg-gray-800 transition-colors"
              >
                <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6 ${benefit.color} bg-opacity-20`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-gray-400 leading-relaxed">
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
