import { useState } from "react";
import { categories } from "@/data";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, Clock, Copy, Inbox, Lock, Store, XCircle } from "lucide-react";

type SellerApplication = {
  id: number;
  fullName: string;
  projectName: string;
  whatsapp: string;
  category: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  accessToken: string | null;
};

export default function AdminSellerApplications() {
  const [auth, setAuth] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const applicationsQuery = trpc.admin.applications.useQuery({ password }, { enabled: auth, retry: false });
  const decideMutation = trpc.admin.decideApplication.useMutation();

  const login = (event: React.FormEvent) => {
    event.preventDefault();
    if (!password.trim()) { setError("أدخل كلمة مرور الإدارة."); return; }
    setError("");
    setAuth(true);
  };

  const decide = async (id: number, status: "approved" | "rejected") => {
    await decideMutation.mutateAsync({ password, id, status });
    await applicationsQuery.refetch();
  };

  if (!auth) return <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4" dir="rtl"><form onSubmit={login} className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl"><Lock className="mx-auto mb-4 h-12 w-12 text-primary" /><h1 className="text-center text-2xl font-black">الإدارة المركزية</h1><p className="my-3 text-center text-sm text-gray-500">أدخل كلمة مرور الإدارة للوصول إلى الطلبات.</p><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="input mb-3 text-center" placeholder="كلمة المرور" />{error && <p className="mb-3 text-center text-sm text-red-500">{error}</p>}<button className="w-full rounded-xl bg-primary py-3 font-bold text-white">دخول</button></form></div>;

  const items = (applicationsQuery.data || []) as SellerApplication[];
  return <div className="min-h-screen bg-gray-50 py-12" dir="rtl"><div className="container mx-auto max-w-7xl px-4"><div className="mb-8 flex items-center justify-between"><div className="flex items-center gap-3"><Store className="text-primary" /><div><h1 className="text-2xl font-black">طلبات البائعين</h1><p className="text-sm text-gray-500">الطلبات محفوظة الآن في قاعدة البيانات</p></div></div><button onClick={() => { setAuth(false); setPassword(""); }} className="text-sm text-gray-500">تسجيل الخروج</button></div><div className="overflow-x-auto rounded-2xl bg-white shadow-sm">{applicationsQuery.isLoading ? <div className="p-16 text-center text-gray-400">جارٍ تحميل الطلبات...</div> : applicationsQuery.isError ? <div className="p-16 text-center text-red-500">تعذر تحميل الطلبات من الخادم.</div> : items.length === 0 ? <div className="flex flex-col items-center gap-3 p-16 text-gray-400"><Inbox className="h-10 w-10" />لا توجد طلبات حتى الآن.</div> : <table className="w-full min-w-[900px] text-right text-sm"><thead className="bg-gray-50"><tr>{["الاسم", "المشروع", "واتساب", "الفئة", "الوصف", "الحالة", "الرمز", "الإجراء"].map((title) => <th key={title} className="px-4 py-4 font-black">{title}</th>)}</tr></thead><tbody>{items.map((item) => <tr key={item.id} className="border-t"><td className="px-4 py-4 font-bold">{item.fullName}</td><td className="px-4 py-4 text-primary">{item.projectName}</td><td className="px-4 py-4" dir="ltr">{item.whatsapp}</td><td className="px-4 py-4">{categories.find((category) => category.id === item.category)?.label}</td><td className="max-w-xs px-4 py-4 text-gray-500">{item.description}</td><td className="px-4 py-4"><Status status={item.status} /></td><td className="px-4 py-4">{item.accessToken ? <button onClick={() => navigator.clipboard?.writeText(item.accessToken || "")} className="rounded-lg bg-orange-50 px-3 py-1 font-mono text-xs text-orange-700"><Copy className="mr-1 inline h-3 w-3" />{item.accessToken}</button> : "—"}</td><td className="px-4 py-4">{item.status === "pending" ? <div className="flex gap-2"><button disabled={decideMutation.isPending} onClick={() => void decide(item.id, "approved")} className="rounded-lg bg-green-500 px-3 py-1 text-xs font-bold text-white">قبول</button><button disabled={decideMutation.isPending} onClick={() => void decide(item.id, "rejected")} className="rounded-lg bg-red-50 px-3 py-1 text-xs font-bold text-red-600">رفض</button></div> : "تم البت"}</td></tr>)}</tbody></table>}</div></div></div>;
}

function Status({ status }: { status: SellerApplication["status"] }) {
  if (status === "approved") return <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs text-green-700"><CheckCircle2 className="h-3 w-3" />مقبول</span>;
  if (status === "rejected") return <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs text-red-700"><XCircle className="h-3 w-3" />مرفوض</span>;
  return <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs text-amber-700"><Clock className="h-3 w-3" />قيد المراجعة</span>;
}
