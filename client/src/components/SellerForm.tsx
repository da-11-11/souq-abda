import { useRef, useState } from "react";
import { categories } from "@/data";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Check, CheckCircle2, Copy, Gift, Store, UploadCloud } from "lucide-react";
import { motion } from "framer-motion";

type PlanType = "free_trial" | "monthly" | "yearly";
const CLIQ_ALIAS = "0781410388";
const WHATSAPP = "962781410388";

export function SellerForm() {
  const [planType, setPlanType] = useState<PlanType>("monthly");
  const [copied, setCopied] = useState<"alias" | "amount" | null>(null);
  const [receiptData, setReceiptData] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const trialStatusQuery = trpc.trial.getTrialStatus.useQuery();
  const submitMutation = trpc.seller.submitApplication.useMutation();
  const [values, setValues] = useState({ fullName: "", projectName: "", whatsapp: "", socialUrl: "", category: "", description: "", senderAccountName: "", referenceNumber: "" });
  const freeAvailable = Boolean(trialStatusQuery.data?.isOpen && (trialStatusQuery.data.remaining ?? 0) > 0);
  const amount = planType === "monthly" ? "10" : "100";
  const amountLabel = planType === "monthly" ? "10 دنانير - لمدة شهر" : "100 دينار - لمدة سنة";
  const isTrial = planType === "free_trial";

  const update = (key: keyof typeof values, value: string) => setValues((current) => ({ ...current, [key]: value }));
  const copyValue = async (kind: "alias" | "amount", value: string) => { await navigator.clipboard?.writeText(value); setCopied(kind); window.setTimeout(() => setCopied(null), 1800); };
  const chooseReceipt = (file?: File) => {
    if (!file) return;
    if (!["image/jpeg", "image/png"].includes(file.type)) { setSubmitError("يرجى رفع إيصال بصيغة JPG أو PNG فقط."); return; }
    if (file.size > 10 * 1024 * 1024) { setSubmitError("حجم الإيصال يجب ألا يتجاوز 10 ميغابايت."); return; }
    setSubmitError(""); setReceiptFile(file);
    const reader = new FileReader(); reader.onload = () => { const data = String(reader.result || ""); setReceiptData(data); setReceiptPreview(data); }; reader.readAsDataURL(file);
  };
  const resetForm = () => { setSubmitted(false); setReceiptData(""); setReceiptFile(null); setReceiptPreview(""); setValues({ fullName: "", projectName: "", whatsapp: "", socialUrl: "", category: "", description: "", senderAccountName: "", referenceNumber: "" }); };
  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); setSubmitError("");
    if (isTrial && !freeAvailable) { setSubmitError("المقاعد المجانية مكتملة أو التسجيل مغلق حالياً."); return; }
    if (!values.whatsapp.trim() && !values.socialUrl.trim()) { setSubmitError("يرجى إدخال رقم واتساب أو رابط حساب إنستغرام/فيسبوك للتواصل"); return; }
    if (!isTrial && (!receiptFile || !receiptData)) { setSubmitError("يرجى رفع صورة إيصال التحويل قبل الإرسال."); return; }
    if (!isTrial && !values.senderAccountName.trim()) { setSubmitError("اسم صاحب الحساب المحوّل إجباري."); return; }
    try {
      const application = {
        ...values,
        planType,
        senderAccountName: values.senderAccountName.trim() || undefined,
        referenceNumber: values.referenceNumber.trim() || undefined,
        ...(isTrial ? {} : { receiptData, receiptFileName: receiptFile?.name, receiptMimeType: receiptFile?.type as "image/jpeg" | "image/png" }),
      };
      await submitMutation.mutateAsync(application);
      setSubmitted(true);
    } catch (error) { setSubmitError(getArabicErrorMessage(error)); }
  };

  if (submitted) {
    const label = isTrial ? "التجربة المجانية لمدة 30 يوماً" : amountLabel;
    const message = encodeURIComponent(`مرحباً، أرسلت طلب ${isTrial ? "التجربة المجانية" : "اشتراك"} لمتجر ${values.projectName} في سوق أبدع. الباقة: ${label}.`);
    return <section id="seller-form" className="bg-[#fff8ed] py-20" dir="rtl"><div className="container mx-auto px-4"><motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto max-w-2xl rounded-[2rem] bg-white p-8 text-center shadow-xl md:p-14"><div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600"><CheckCircle2 className="h-11 w-11" /></div><h2 className="text-2xl font-black text-gray-950">تم استلام طلبك بنجاح!</h2><p className="mx-auto mt-5 max-w-xl text-lg leading-9 text-gray-500">تم استلام طلبك بنجاح! ستتم مراجعة طلبك والتواصل معك عبر الواتساب أو حساب التواصل المرفق لفحص المنتجات وتفعيل متجرك خلال 24 ساعة.</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><a href={`https://wa.me/${WHATSAPP}?text=${message}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-full bg-[#25D366] px-6 py-3 font-bold text-white">إرسال إشعار سريع عبر واتساب</a><a href="/" className="inline-flex items-center justify-center rounded-full border border-primary/30 px-6 py-3 font-bold text-primary">العودة للصفحة الرئيسية</a><button type="button" onClick={resetForm} className="rounded-full border border-gray-200 px-6 py-3 font-bold text-gray-600">إرسال طلب آخر</button></div></motion.div></div></section>;
  }

  return <section id="seller-form" className="relative overflow-hidden bg-[#fff8ed] py-20 md:py-28" dir="rtl"><div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-[#ffb300]/10 blur-3xl" /><div className="container relative z-10 mx-auto px-4 md:px-6"><div className="mx-auto flex max-w-6xl flex-col overflow-hidden rounded-[2.5rem] bg-white shadow-[0_20px_80px_rgba(105,62,23,0.12)] md:flex-row"><div className="flex flex-col justify-between bg-gradient-to-br from-[#dd6b20] to-[#f59e0b] p-8 text-white md:w-5/12 md:p-10"><div><div className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20"><Store className="h-8 w-8" /></div><p className="mb-3 text-sm font-bold text-white/75">مساحتك لتكبر</p><h2 className="text-3xl font-black leading-tight md:text-4xl">حوّل موهبتك إلى مشروع يُرى</h2><p className="mt-5 text-lg leading-8 text-white/80">اشترك في سوق أبدع وشارك منتجاتك اليدوية مع مشترين يبحثون عن القطع الأصيلة.</p></div><div className="mt-10 space-y-4 text-sm font-bold text-white/90">{["متجر مستقل باسمك", "تواصل مباشر مع المشترين", "تجربة مجانية محدودة للمقاعد المتاحة"].map((item) => <div key={item} className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#ffe29a]" />{item}</div>)}</div></div><div className="p-7 md:w-7/12 md:p-10"><form onSubmit={onSubmit} className="space-y-6"><div><h3 className="text-2xl font-black text-gray-950">سجّل كبائع</h3><p className="mt-2 text-sm leading-7 text-gray-500">اختر التجربة المجانية إن كان أحد المقاعد متاحاً، أو اختر باقة الدفع.</p></div><div className="space-y-3"><h4 className="text-lg font-black text-gray-950">اختر الباقة</h4><button type="button" disabled={!freeAvailable} onClick={() => setPlanType("free_trial")} className={`w-full rounded-2xl border-2 p-5 text-right transition ${isTrial && freeAvailable ? "border-green-500 bg-green-50" : freeAvailable ? "border-green-200 bg-gradient-to-l from-green-50 to-emerald-50 hover:border-green-400" : "cursor-not-allowed border-gray-200 bg-gray-50 opacity-70"}`}><div className="flex items-center justify-between gap-3"><span className="flex items-center gap-2 text-lg font-black text-green-700"><Gift className="h-5 w-5" />تجربة مجانية لمدة 30 يوماً</span><span className={`rounded-full px-3 py-1 text-xs font-black ${freeAvailable ? "bg-green-600 text-white" : "bg-gray-300 text-gray-700"}`}>{freeAvailable ? `متبقي ${trialStatusQuery.data?.remaining ?? 0} مقعد من أصل ${trialStatusQuery.data?.max ?? 30}` : `اكتملت المقاعد المجانية (${trialStatusQuery.data?.max ?? 30}/${trialStatusQuery.data?.max ?? 30})`}</span></div><p className="mt-2 text-sm text-gray-600">بدون رسوم وبدون تحويل بنكي — لفترة محدودة.</p></button><div className="grid grid-cols-2 gap-3"><button type="button" onClick={() => setPlanType("monthly")} className={`rounded-xl border p-3 text-sm font-bold ${planType === "monthly" ? "border-primary bg-primary/10 text-primary" : "border-gray-200"}`}>شهري — 10 دنانير</button><button type="button" onClick={() => setPlanType("yearly")} className={`rounded-xl border p-3 text-sm font-bold ${planType === "yearly" ? "border-primary bg-primary/10 text-primary" : "border-gray-200"}`}>سنوي — 100 دينار</button></div></div>{!isTrial && <><div className="rounded-2xl border border-orange-200 bg-orange-50/70 p-5"><div className="mb-4 flex items-center gap-2"><span className="rounded-full bg-[#00a884] px-3 py-1 text-xs font-black text-white">CliQ</span><b>تحويل فوري (بنك أو محفظة إلكترونية)</b></div><div className="space-y-3 text-sm"><CopyRow label="الاسم المستعار (Alias)" value={CLIQ_ALIAS} copied={copied === "alias"} onCopy={() => void copyValue("alias", CLIQ_ALIAS)} /><CopyRow label="المبلغ المطلوب" value={amountLabel} copied={copied === "amount"} onCopy={() => void copyValue("amount", amount)} /></div></div><ol className="space-y-2 text-sm leading-7 text-gray-600"><li><b className="ml-2 rounded-full bg-orange-100 px-2 py-1 text-primary">1</b> افتح تطبيق بنكك أو محفظتك واختر CliQ ← تحويل لاسم مستعار.</li><li><b className="ml-2 rounded-full bg-orange-100 px-2 py-1 text-primary">2</b> حوّل {amountLabel} على {CLIQ_ALIAS}.</li><li><b className="ml-2 rounded-full bg-orange-100 px-2 py-1 text-primary">3</b> خذ صورة شاشة للإيصال وارفعها تحت.</li></ol></>}<div className="grid grid-cols-1 gap-4 md:grid-cols-2"><Field label="الاسم الكامل"><input required className="input" value={values.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="محمد أحمد" /></Field><Field label="اسم المتجر"><input required className="input" value={values.projectName} onChange={(e) => update("projectName", e.target.value)} placeholder="مخبز السعادة" /></Field><Field label="رقم واتساب (اختياري في حال توفر حساب إنستغرام أو فيسبوك)"><input className="input" dir="ltr" value={values.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} placeholder="0790000000" /></Field><Field label="حساب أو رابط إنستغرام / فيسبوك (اختياري)"><input className="input" dir="ltr" value={values.socialUrl} onChange={(e) => update("socialUrl", e.target.value)} placeholder="instagram.com/yourshop أو رابط صفحتك على فيسبوك" /></Field><Field label="الفئة"><select required className="input bg-white" value={values.category} onChange={(e) => update("category", e.target.value)}><option value="">اختر الفئة</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}</select></Field></div><Field label="وصف مشروعك"><textarea required rows={3} className="input py-3" value={values.description} onChange={(e) => update("description", e.target.value)} placeholder="حدثنا باختصار عن المنتجات التي تصنعها..." /><span className="mt-1 block text-xs font-bold text-gray-500">(يجب كتابة 10 أحرف على الأقل)</span></Field>{!isTrial && <><div><h4 className="mb-2 text-lg font-black">أرسل صورة إيصال التحويل</h4><button type="button" onClick={() => fileRef.current?.click()} className="flex min-h-36 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-orange-300 bg-orange-50/60 p-4 text-center hover:border-primary">{receiptPreview ? <img src={receiptPreview} alt="معاينة إيصال التحويل" className="max-h-40 rounded-xl object-contain" /> : <><UploadCloud className="mb-2 h-9 w-9 text-primary" /><b>ارفع صورة إيصال التحويل</b><span className="mt-1 text-sm text-gray-500">اسحب وأفلت أو اضغط للاختيار - JPG أو PNG حتى 10 ميجا</span></>}<input ref={fileRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={(e) => chooseReceipt(e.target.files?.[0])} /></button></div><div className="grid grid-cols-1 gap-4 md:grid-cols-2"><Field label="اسم صاحب الحساب المحوّل"><input required className="input" value={values.senderAccountName} onChange={(e) => update("senderAccountName", e.target.value)} placeholder="محمد أحمد" /></Field><Field label="رقم المرجع (اختياري)"><input className="input" dir="ltr" value={values.referenceNumber} onChange={(e) => update("referenceNumber", e.target.value)} placeholder="رقم المرجع" /></Field></div></>}{submitError && <p className="rounded-xl bg-red-50 px-4 py-3 text-center text-sm text-red-600">{submitError}</p>}<button type="submit" disabled={submitMutation.isPending || (!values.whatsapp.trim() && !values.socialUrl.trim())} className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#dd6b20] to-[#f59e0b] text-lg font-black text-white disabled:opacity-60">{submitMutation.isPending ? "جارٍ إرسال الطلب..." : isTrial ? "إرسال طلب التجربة المجانية" : "إرسال طلب الاشتراك"}<ArrowLeft className="h-5 w-5" /></button></form></div></div></div></section>;
}

function CopyRow({ label, value, copied, onCopy }: { label: string; value: string; copied: boolean; onCopy: () => void }) { return <div className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-3"><span className="text-gray-500">{label}</span><div className="flex items-center gap-2"><b dir="ltr" className="text-base text-gray-950">{value}</b><button type="button" onClick={onCopy} className="inline-flex items-center gap-1 rounded-lg bg-orange-100 px-2 py-1 text-xs font-bold text-primary">{copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}{copied ? "تم النسخ" : "نسخ"}</button></div></div>; }
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block text-sm font-bold text-gray-700">{label}{children}</label>; }

function getArabicErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  if (message.includes("وصف") || message.toLowerCase().includes("description") || message.includes("10")) return "يرجى كتابة وصف للمشروع لا يقل عن 10 أحرف.";
  if (message.includes("الاسم الكامل") || message.toLowerCase().includes("fullname")) return "يرجى كتابة الاسم الكامل بشكل صحيح.";
  if (message.includes("اسم المتجر") || message.toLowerCase().includes("projectname")) return "يرجى كتابة اسم المتجر بشكل صحيح.";
  if (message.includes("واتساب") || message.toLowerCase().includes("whatsapp")) return "يرجى إدخال رقم واتساب صحيح.";
  if (message.includes("الفئة") || message.toLowerCase().includes("category")) return "يرجى اختيار فئة المشروع.";
  if (message.includes("صاحب الحساب") || message.toLowerCase().includes("senderaccountname")) return "يرجى كتابة اسم صاحب الحساب المحوّل.";
  if (message.includes("إيصال") || message.toLowerCase().includes("receipt")) return "يرجى رفع صورة إيصال التحويل بصيغة JPG أو PNG.";
  if (/[ -]/.test(message) && message) return "يرجى مراجعة الحقول المطلوبة وإكمال البيانات بشكل صحيح.";
  return message || "تعذر إرسال الطلب. يرجى المحاولة مرة أخرى.";
}
