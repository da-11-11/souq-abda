import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { categories } from "@/data";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { CheckCircle2, LogOut, PackagePlus, ShoppingBag, User } from "lucide-react";

type SellerData = { id: number; fullName: string; projectName: string; whatsapp: string; category: string; description: string; status: "approved" | "pending" | "rejected" | "expired"; accessToken: string | null };

export default function SellerDashboard() {
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  const [token, setToken] = useState(() => (typeof window === "undefined" ? "" : sessionStorage.getItem("sellerToken") || ""));
  const [profile, setProfile] = useState<SellerData | null>(null);
  const [saved, setSaved] = useState(false);
  const accountQuery = trpc.seller.loginWithAccount.useQuery(undefined, { enabled: isAuthenticated && !token, retry: false });
  const profileQuery = trpc.seller.login.useQuery({ accessToken: token }, { enabled: Boolean(token), retry: false });
  const updateMutation = trpc.seller.updateProfile.useMutation();

  useEffect(() => {
    if (accountQuery.data?.accessToken) { sessionStorage.setItem("sellerToken", accountQuery.data.accessToken); setToken(accountQuery.data.accessToken); }
  }, [accountQuery.data]);
  useEffect(() => {
    if (!token && !isAuthenticated && !accountQuery.isLoading) { navigate("/seller/login"); return; }
    if (profileQuery.data) setProfile(profileQuery.data);
    if (profileQuery.isError) navigate("/seller/login");
  }, [navigate, token, isAuthenticated, accountQuery.isLoading, profileQuery.data, profileQuery.isError]);

  if (!token || profileQuery.isLoading || !profile) return <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-500" dir="rtl">جارٍ تحميل لوحة البائع...</div>;
  const update = (key: "projectName" | "whatsapp" | "category" | "description", value: string) => setProfile((current) => current ? { ...current, [key]: value } : current);
  const submit = async (event: React.FormEvent) => { event.preventDefault(); await updateMutation.mutateAsync({ accessToken: token, fullName: profile.fullName, projectName: profile.projectName, whatsapp: profile.whatsapp, category: profile.category, description: profile.description }); setSaved(true); window.setTimeout(() => setSaved(false), 2000); };
  const logout = () => { sessionStorage.removeItem("sellerToken"); navigate("/seller/login"); };

  return <div className="min-h-screen bg-gray-50" dir="rtl"><nav className="sticky top-0 z-40 border-b bg-white shadow-sm"><div className="container mx-auto flex h-16 items-center justify-between px-4"><Link href="/" className="flex items-center gap-2"><ShoppingBag className="text-primary" /><b className="text-xl text-primary">سوق أبدع</b><span className="text-sm text-gray-400">| لوحة البائع</span></Link><div className="flex items-center gap-3"><Link href="/add-product" className="hidden items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-bold text-white sm:flex"><PackagePlus className="h-4 w-4" />إضافة منتج</Link><span className="hidden items-center gap-1 text-sm text-gray-600 md:flex"><User className="h-4 w-4" />{profile.fullName}</span><button onClick={logout} className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-500"><LogOut className="h-4 w-4" />خروج</button></div></div></nav><main className="container mx-auto max-w-2xl px-4 py-10"><div className="mb-8 rounded-3xl bg-gradient-to-r from-primary to-secondary p-6 text-white"><p className="text-sm text-white/80">أهلاً وسهلاً،</p><h1 className="text-2xl font-black">{profile.fullName}</h1><p>{profile.projectName}</p><Link href="/add-product" className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-bold text-white sm:hidden"><PackagePlus className="h-4 w-4" />إضافة منتج</Link></div><form onSubmit={submit} className="space-y-5 rounded-3xl bg-white p-6 shadow-sm md:p-8"><h2 className="text-xl font-black">بيانات مشروعك</h2><Field label="اسم المشروع"><input required className="input" value={profile.projectName} onChange={(event) => update("projectName", event.target.value)} /></Field><Field label="رقم واتساب"><input required className="input text-right" dir="ltr" value={profile.whatsapp} onChange={(event) => update("whatsapp", event.target.value)} /></Field><Field label="الفئة"><select className="input bg-white" value={profile.category} onChange={(event) => update("category", event.target.value)}>{categories.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}</select></Field><Field label="الوصف"><textarea required className="input py-3" rows={5} value={profile.description} onChange={(event) => update("description", event.target.value)} /></Field><button disabled={updateMutation.isPending} className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-secondary to-primary font-black text-white disabled:opacity-60">{saved ? <><CheckCircle2 className="h-5 w-5" />تم الحفظ في قاعدة البيانات!</> : updateMutation.isPending ? "جارٍ الحفظ..." : "حفظ التغييرات"}</button></form></main></div>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block text-sm font-bold text-gray-700">{label}{children}</label>; }
