import { useState } from "react";
import { categories } from "@/data";
import { trpc } from "@/lib/trpc";
import { Check, CheckCircle2, Clock, Copy, ExternalLink, Inbox, Lock, Store, X, XCircle } from "lucide-react";

export default function AdminSellerApplications() {
  const [auth, setAuth] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<string | null>(null);
  const applicationsQuery = trpc.admin.applications.useQuery({ password }, { enabled: auth, retry: false });
  const decideMutation = trpc.admin.decideApplication.useMutation();

  const login = (event: React.FormEvent) => {
    event.preventDefault();
    if (!password.trim()) { setError("أدخل كلمة مرور الإدارة."); return; }
    setError("");
    setAuth(true);
  };
  const decide = async (id: number, status: "approved" | "rejected") => {
    try {
      await decideMutation.mutateAsync({ password, id, status });
      await applicationsQuery.refetch();
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "تعذر تنفيذ الإجراء");
    }
  };

  if (!auth) return <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4" dir="rtl"><form onSubmit={login} className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl"><Lock className="mx-auto mb-4 h-12 w-12 text-primary" /><h1 className="text-center text-2xl font-black">الإدارة المركزية</h1><p className="my-3 text-center text-sm text-gray-500">أدخل كلمة مرور الإدارة للوصول إلى طلبات الاشتراك.</p><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="input mb-3 text-center" placeholder="كلمة المرور" />{error && <p className="mb-3 text-center text-sm text-red-500">{error}</p>}<button className="w-full rounded-xl bg-primary py-3 font-bold text-white">دخول</button></form></div>;

  const items = applicationsQuery.data ?? [];
  return <div className="min-h-screen bg-gray-50 py-12" dir="rtl"><div className="container mx-auto max-w-[1500px] px-4"><div className="mb-8 flex items-center justify-between"><div className="flex items-center gap-3"><Store className="text-primary" /><div><h1 className="text-2xl font-black">طلبات اشتراك البائعين</h1><p className="text-sm text-gray-500">راجع إيصال الدفع ثم فعّل المتجر — الحد الأقصى 30 متجراً نشطاً</p></div></div><button onClick={() => { setAuth(false); setPassword(""); }} className="text-sm text-gray-500">تسجيل الخروج</button></div>{error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-center text-sm text-red-600">{error}</p>}<div className="overflow-x-auto rounded-2xl bg-white shadow-sm">{applicationsQuery.isLoading ? <div className="p-16 text-center text-gray-400">جارٍ تحميل الطلبات...</div> : applicationsQuery.isError ? <div className="p-16 text-center text-red-500">تعذر تحميل الطلبات من الخادم.</div> : items.length === 0 ? <div className="flex flex-col items-center gap-3 p-16 text-gray-400"><Inbox className="h-10 w-10" />لا توجد طلبات حتى الآن.</div> : <table className="w-full min-w-[1250px] text-right text-sm"><thead className="bg-gray-50"><tr>{["الاسم والمتجر", "الباقة", "بيانات التحويل", "الإيصال", "الفئة والوصف", "الحالة", "الإجراء"].map((title) => <th key={title} className="px-4 py-4 font-black">{title}</th>)}</tr></thead><tbody>{items.map((item) => <tr key={item.id} className="border-t align-top"><td className="px-4 py-4"><b>{item.fullName}</b><p className="mt-1 text-primary">{item.projectName}</p><p className="mt-1 text-gray-400" dir="ltr">{item.whatsapp}</p></td><td className="px-4 py-4"><span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">{item.planType === "monthly" ? "10 دنانير / شهري" : "100 دينار / سنوي"}</span></td><td className="space-y-2 px-4 py-4"><p><span className="text-gray-400">صاحب الحساب:</span> <b>{item.senderAccountName}</b></p><p><span className="text-gray-400">المرجع:</span> {item.referenceNumber || "غير مذكور"}</p></td><td className="px-4 py-4"><button type="button" onClick={() => setReceipt(item.receiptUrl)} className="group relative block overflow-hidden rounded-xl border border-orange-200 bg-orange-50"><img src={item.receiptUrl} alt="إيصال التحويل" className="h-20 w-28 object-cover transition group-hover:scale-105" /><span className="absolute inset-0 flex items-center justify-center bg-black/40 text-xs font-bold text-white opacity-0 transition group-hover:opacity-100">تكبير</span></button><a href={item.receiptUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs text-primary"><ExternalLink className="h-3 w-3" />فتح الأصل</a></td><td className="max-w-xs px-4 py-4"><b>{categories.find((category) => category.id === item.category)?.label}</b><p className="mt-2 leading-6 text-gray-500">{item.description}</p></td><td className="px-4 py-4"><Status status={item.status} />{item.accessToken && <button onClick={() => void navigator.clipboard?.writeText(item.accessToken || "")} className="mt-3 block rounded-lg bg-green-50 px-3 py-2 font-mono text-xs font-bold text-green-700"><Copy className="mr-1 inline h-3 w-3" />{item.accessToken}</button>}</td><td className="px-4 py-4">{item.status === "pending" ? <div className="flex min-w-48 flex-col gap-2"><button disabled={decideMutation.isPending} onClick={() => void decide(item.id, "approved")} className="rounded-xl bg-green-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-50">تأكيد الدفع وتفعيل المتجر</button><button disabled={decideMutation.isPending} onClick={() => void decide(item.id, "rejected")} className="rounded-xl bg-red-50 px-3 py-2 text-xs font-bold text-red-600 disabled:opacity-50">رفض الطلب</button></div> : <span className="text-xs text-gray-400">تمت المعالجة</span>}</td></tr>)}</tbody></table>}</div></div>{receipt && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true" onClick={() => setReceipt(null)}><div className="relative max-h-[90vh] max-w-3xl rounded-2xl bg-white p-3" onClick={(event) => event.stopPropagation()}><button type="button" onClick={() => setReceipt(null)} className="absolute -left-3 -top-3 rounded-full bg-white p-2 shadow-lg"><X className="h-5 w-5" /></button><img src={receipt} alt="معاينة مكبرة لإيصال التحويل" className="max-h-[85vh] max-w-full rounded-xl object-contain" /></div></div>}</div>;
}

function Status({ status }: { status: "pending" | "approved" | "rejected" }) {
  if (status === "approved") return <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs text-green-700"><CheckCircle2 className="h-3 w-3" />مفعّل</span>;
  if (status === "rejected") return <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs text-red-700"><XCircle className="h-3 w-3" />مرفوض</span>;
  return <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs text-amber-700"><Clock className="h-3 w-3" />قيد المراجعة</span>;
}
