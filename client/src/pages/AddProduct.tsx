import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { categories } from "@/data";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, ImagePlus, PackagePlus, UploadCloud } from "lucide-react";

const initial = { name: "", shortDescription: "", description: "", price: "", category: "" };

export default function AddProduct() {
  const [, navigate] = useLocation();
  const [token] = useState(() => (typeof window === "undefined" ? "" : sessionStorage.getItem("sellerToken") || ""));
  const [form, setForm] = useState(initial);
  const [imageData, setImageData] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const createProduct = trpc.seller.createProduct.useMutation();

  const update = (key: keyof typeof initial, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const handleImage = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("يرجى اختيار ملف صورة صالح."); return; }
    if (file.size > 10 * 1024 * 1024) { setError("حجم الصورة يجب أن يكون أقل من 10 ميغابايت."); return; }
    setError("");
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => { const value = String(reader.result || ""); setImageData(value); setImagePreview(value); };
    reader.readAsDataURL(file);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token) { setError("يجب تسجيل الدخول كبائع قبل إضافة منتج."); return; }
    setError("");
    try {
      await createProduct.mutateAsync({
        ...form,
        accessToken: token,
        imageData: imageData || undefined,
        imageFileName: imageFile?.name,
        imageMimeType: imageFile?.type,
      });
      setDone(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "تعذر حفظ المنتج. حاول مرة أخرى.");
    }
  };

  if (!token) return <div className="flex min-h-screen flex-col bg-gray-50" dir="rtl"><Navbar /><main className="flex flex-1 items-center justify-center px-4 py-16"><div className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-xl"><PackagePlus className="mx-auto mb-4 h-14 w-14 text-primary" /><h1 className="text-2xl font-black">تسجيل دخول البائع مطلوب</h1><p className="mt-3 leading-8 text-gray-500">لضمان ملكية المنتجات، سجّل الدخول برمز الموافقة قبل إضافة منتج جديد.</p><Link href="/seller-login" className="mt-7 inline-flex rounded-full bg-primary px-7 py-3 font-bold text-white">دخول البائع</Link></div></main><Footer /></div>;

  return <div className="flex min-h-screen flex-col bg-gray-50" dir="rtl"><Navbar /><main className="flex-1 py-12"><div className="container mx-auto max-w-2xl px-4"><div className="mb-8 text-center"><PackagePlus className="mx-auto mb-3 h-12 w-12 text-primary" /><h1 className="text-3xl font-black">أضف منتجك إلى السوق</h1><p className="mt-2 text-gray-500">سيتم حفظ المنتج في قاعدة البيانات وتخزين صورته بشكل دائم.</p></div><div className="rounded-3xl bg-white p-6 shadow-xl md:p-10">{done ? <div className="flex flex-col items-center gap-4 py-12 text-center"><CheckCircle2 className="h-14 w-14 text-green-500" /><h2 className="text-2xl font-black">تمت إضافة منتجك!</h2><p className="text-gray-500">أصبح المنتج متاحاً في السوق لجميع الزوار.</p><div className="flex gap-3"><button onClick={() => navigate("/")} className="rounded-full bg-primary px-6 py-3 font-bold text-white">عرض السوق</button><button onClick={() => { setForm(initial); setImageData(""); setImagePreview(""); setImageFile(null); setDone(false); }} className="rounded-full border px-6 py-3 font-bold text-primary">إضافة آخر</button></div></div> : <form onSubmit={submit} className="space-y-5"><Field label="اسم المنتج"><input required className="input" value={form.name} onChange={(event) => update("name", event.target.value)} /></Field><div className="grid gap-5 md:grid-cols-2"><Field label="السعر"><input required className="input" placeholder="15 د.أ" value={form.price} onChange={(event) => update("price", event.target.value)} /></Field><Field label="الفئة"><select required className="input bg-white" value={form.category} onChange={(event) => update("category", event.target.value)}><option value="">اختر الفئة</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}</select></Field></div><Field label="وصف مختصر"><input required className="input" value={form.shortDescription} onChange={(event) => update("shortDescription", event.target.value)} /></Field><Field label="الوصف الكامل"><textarea required rows={4} className="input py-3" value={form.description} onChange={(event) => update("description", event.target.value)} /></Field><label className="block text-sm font-bold text-gray-700">صورة المنتج<div className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50/60 p-5 text-center transition hover:border-primary"><input type="file" accept="image/*" className="sr-only" onChange={(event) => handleImage(event.target.files?.[0])} />{imagePreview ? <img src={imagePreview} alt="معاينة المنتج" className="h-44 w-full rounded-xl object-cover" /> : <><UploadCloud className="mb-2 h-9 w-9 text-primary" /><span>اختر صورة من جهازك</span><small className="mt-1 text-gray-400">PNG أو JPG حتى 10 ميغابايت</small></>}</div></label>{error && <p className="rounded-xl bg-red-50 px-4 py-3 text-center text-sm text-red-600">{error}</p>}<button disabled={createProduct.isPending} className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-secondary to-primary text-lg font-black text-white disabled:opacity-60"><ImagePlus className="h-5 w-5" />{createProduct.isPending ? "جارٍ رفع الصورة وحفظ المنتج..." : "أضف المنتج"}</button></form>}</div></div></main><Footer /></div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block text-sm font-bold text-gray-700">{label}{children}</label>; }
