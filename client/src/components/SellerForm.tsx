import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { categories } from "@/data";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Store, CheckCircle2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

type SellerApplication = z.infer<typeof formSchema>;
const formSchema = z.object({
  fullName: z.string().min(2, "الاسم الكامل مطلوب"),
  projectName: z.string().min(2, "اسم المشروع مطلوب"),
  whatsapp: z.string().min(10, "رقم الواتساب غير صحيح"),
  category: z.string().min(1, "يرجى اختيار فئة"),
  description: z.string().min(10, "الوصف يجب أن يكون 10 أحرف على الأقل"),
});

export function SellerForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const form = useForm<SellerApplication>({
    resolver: zodResolver(formSchema),
    defaultValues: { fullName: "", projectName: "", whatsapp: "", category: "", description: "" },
  });

  const onSubmit = (values: SellerApplication) => {
    setIsSending(true);
    window.setTimeout(() => {
      console.info("Seller application captured locally", values);
      setIsSending(false);
      setIsSubmitted(true);
      form.reset();
    }, 650);
  };

  return (
    <section id="seller-form" className="relative overflow-hidden bg-[#fff8ed] py-20 md:py-28">
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-[#ffb300]/10 blur-3xl" />
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="mx-auto flex max-w-5xl flex-col overflow-hidden rounded-[2.5rem] bg-white shadow-[0_20px_80px_rgba(105,62,23,0.12)] md:flex-row">
          <div className="flex flex-col justify-between bg-gradient-to-br from-[#dd6b20] to-[#f59e0b] p-8 text-white md:w-5/12 md:p-10">
            <div>
              <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm"><Store className="h-8 w-8" /></div>
              <p className="mb-3 text-sm font-bold text-white/75">مساحتك لتكبر</p>
              <h2 className="text-3xl font-black leading-tight md:text-4xl">حوّل موهبتك إلى مشروع يُرى</h2>
              <p className="mt-5 text-lg leading-8 text-white/80">شارك إبداعك مع مشترين يبحثون عن القطع الأصيلة، وابدأ حضورك في سوق أبدع.</p>
            </div>
            <div className="mt-10 space-y-4 text-sm font-bold text-white/90">
              {['متجر مستقل باسمك', 'تواصل مباشر مع المشترين', 'دعم وتسويق لحرفتك'].map((item) => <div key={item} className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#ffe29a]" />{item}</div>)}
            </div>
          </div>

          <div className="p-7 md:w-7/12 md:p-10">
            {isSubmitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex min-h-[410px] flex-col items-center justify-center text-center">
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600"><CheckCircle2 className="h-10 w-10" /></div>
                <h3 className="text-2xl font-black text-gray-950">وصلنا طلبك بنجاح</h3>
                <p className="mt-3 max-w-sm leading-8 text-gray-500">شكراً لثقتك. سيقوم فريقنا بمراجعة البيانات والتواصل معك قريباً.</p>
                <Button onClick={() => setIsSubmitted(false)} variant="outline" className="mt-7 rounded-full border-primary/30 px-6 text-primary">إرسال طلب آخر <ArrowLeft className="mr-2 h-4 w-4" /></Button>
              </motion.div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <div className="mb-7"><h3 className="text-2xl font-black text-gray-950">سجّل كبائع</h3><p className="mt-2 text-sm leading-7 text-gray-500">أخبرنا عنك، وسنساعدك في عرض منتجاتك.</p></div>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <FormField control={form.control} name="fullName" render={({ field }) => <FormItem><FormLabel>الاسم الكامل</FormLabel><FormControl><Input placeholder="أحمد محمد" className="h-12 rounded-xl bg-gray-50/70" {...field} /></FormControl><FormMessage /></FormItem>} />
                    <FormField control={form.control} name="projectName" render={({ field }) => <FormItem><FormLabel>اسم المشروع</FormLabel><FormControl><Input placeholder="مخبز السعادة" className="h-12 rounded-xl bg-gray-50/70" {...field} /></FormControl><FormMessage /></FormItem>} />
                  </div>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <FormField control={form.control} name="whatsapp" render={({ field }) => <FormItem><FormLabel>رقم واتساب</FormLabel><FormControl><Input dir="ltr" type="tel" placeholder="0790000000" className="h-12 rounded-xl bg-gray-50/70 text-right" {...field} /></FormControl><FormMessage /></FormItem>} />
                    <FormField control={form.control} name="category" render={({ field }) => <FormItem><FormLabel>الفئة</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger className="h-12 rounded-xl bg-gray-50/70"><SelectValue placeholder="اختر الفئة..." /></SelectTrigger></FormControl><SelectContent>{categories.map((category) => <SelectItem key={category.id} value={category.id}>{category.label}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>} />
                  </div>
                  <FormField control={form.control} name="description" render={({ field }) => <FormItem><FormLabel>وصف مشروعك</FormLabel><FormControl><Textarea placeholder="حدثنا باختصار عن المنتجات التي تصنعها..." className="h-28 resize-none rounded-xl bg-gray-50/70" {...field} /></FormControl><FormMessage /></FormItem>} />
                  <Button type="submit" disabled={isSending} className="mt-2 h-14 w-full rounded-xl bg-gradient-to-l from-[#dd6b20] to-[#f59e0b] text-lg font-black text-white shadow-lg shadow-orange-500/20 transition-transform hover:-translate-y-0.5">{isSending ? "جارٍ الإرسال..." : "أرسل طلبك الآن"}</Button>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
