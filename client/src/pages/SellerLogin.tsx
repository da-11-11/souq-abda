import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, KeyRound, LogIn, ShoppingBag } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";

export default function SellerLogin() {
  const [, navigate] = useLocation();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const loginQuery = trpc.seller.login.useQuery({ accessToken: token.trim().toUpperCase() }, { enabled: false, retry: false });
  const accountQuery = trpc.seller.loginWithAccount.useQuery(undefined, { enabled: isAuthenticated, retry: false });

  useEffect(() => {
    if (accountQuery.data?.accessToken) {
      sessionStorage.setItem("sellerToken", accountQuery.data.accessToken);
      navigate("/seller-dashboard");
    }
  }, [accountQuery.data, navigate]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!token.trim()) return;
    setError("");
    try {
      const result = await loginQuery.refetch();
      if (!result.data) throw new Error("رمز الدخول غير صحيح");
      sessionStorage.setItem("sellerToken", token.trim().toUpperCase());
      navigate("/seller-dashboard");
    } catch {
      setError("رمز الدخول غير صحيح أو لم تتم الموافقة على الطلب بعد.");
    }
  }

  const loginWithManus = () => {
    sessionStorage.setItem("sellerAuthReturn", "/seller/login");
    startLogin();
  };

  return <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1A1A1A] via-gray-900 to-[#3c3010] px-4" dir="rtl"><div className="w-full max-w-md"><Link href="/" className="mb-8 flex items-center justify-center gap-2 text-white"><span className="rounded-2xl bg-[#D4AF37]/15 p-3"><ShoppingBag className="h-8 w-8 text-[#D4AF37]" /></span><span className="text-3xl font-black">سوق أبدع</span></Link><div className="rounded-3xl bg-white p-8 shadow-xl"><div className="mb-8 text-center"><div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#D4AF37]/15"><KeyRound className="h-8 w-8 text-[#9c7d12]" /></div><h1 className="text-2xl font-black text-[#1A1A1A]">دخول البائعين</h1><p className="mt-2 text-sm leading-7 text-gray-500">استخدم حساب Manus للوصول المباشر، أو أدخل الرمز السري الذي أرسلته الإدارة.</p></div><button onClick={loginWithManus} disabled={authLoading || accountQuery.isFetching} className="mb-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#1A1A1A] py-4 font-bold text-white disabled:opacity-60"><LogIn className="h-5 w-5 text-[#D4AF37]" />{accountQuery.isFetching ? "جارٍ فتح المتجر..." : "الدخول عبر Google / Microsoft / Apple"}</button>{isAuthenticated && accountQuery.isError && <p className="mb-5 rounded-xl bg-amber-50 px-4 py-3 text-center text-sm text-amber-700">الحساب مسجل، لكن لا يوجد متجر مفعّل مرتبط به بعد.</p>}<div className="mb-5 flex items-center gap-3 text-xs text-gray-400"><span className="h-px flex-1 bg-gray-200" />أو بالرمز السري<span className="h-px flex-1 bg-gray-200" /></div><form onSubmit={submit} className="space-y-5"><label className="block text-sm font-bold text-[#1A1A1A]">رمز الدخول السري<input value={token} onChange={(event) => setToken(event.target.value.toUpperCase())} maxLength={32} dir="ltr" placeholder="AB3C7X" className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-4 text-center font-mono text-2xl font-bold tracking-[.3em] outline-none focus:border-[#D4AF37]" /></label>{error && <p className="rounded-xl bg-red-50 px-4 py-3 text-center text-sm text-red-600">{error}</p>}<button disabled={!token.trim() || loginQuery.isFetching} className="w-full rounded-2xl bg-gradient-to-r from-[#9c7d12] to-[#D4AF37] py-4 text-lg font-bold text-white disabled:opacity-50">{loginQuery.isFetching ? "جارٍ التحقق..." : "دخول بالرمز"}</button></form><Link href="/" className="mt-6 flex items-center justify-center gap-2 border-t pt-6 text-sm text-gray-400 hover:text-[#9c7d12]"><ArrowLeft className="h-4 w-4" />العودة إلى المتجر</Link></div></div></div>;
}
