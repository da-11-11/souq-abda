import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, KeyRound, ShoppingBag } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function SellerLogin() {
  const [, navigate] = useLocation();
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const loginQuery = trpc.seller.login.useQuery(
    { accessToken: token.trim().toUpperCase() },
    { enabled: false, retry: false },
  );

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

  return <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50 px-4" dir="rtl"><div className="w-full max-w-md"><Link href="/" className="mb-8 flex items-center justify-center gap-2"><span className="rounded-2xl bg-primary/10 p-3"><ShoppingBag className="h-8 w-8 text-primary" /></span><span className="bg-gradient-to-l from-primary to-secondary bg-clip-text text-3xl font-black text-transparent">سوق أبدع</span></Link><div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl"><div className="mb-8 text-center"><div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100"><KeyRound className="h-8 w-8 text-orange-500" /></div><h1 className="text-2xl font-black">دخول البائعين</h1><p className="mt-2 text-sm leading-7 text-gray-500">أدخل رمز الدخول بعد قبول طلبك من الإدارة.</p></div><form onSubmit={submit} className="space-y-5"><label className="block text-sm font-bold">رمز الدخول السري<input value={token} onChange={(event) => setToken(event.target.value.toUpperCase())} maxLength={10} dir="ltr" placeholder="AB3C7X" className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-4 text-center font-mono text-2xl font-bold tracking-[.4em] outline-none focus:border-primary" /></label>{error && <p className="rounded-xl bg-red-50 px-4 py-3 text-center text-sm text-red-600">{error}</p>}<button disabled={!token.trim() || loginQuery.isFetching} className="w-full rounded-2xl bg-gradient-to-r from-secondary to-primary py-4 text-lg font-bold text-white disabled:opacity-50">{loginQuery.isFetching ? "جارٍ التحقق..." : "دخول"}</button></form><Link href="/" className="mt-6 flex items-center justify-center gap-2 border-t pt-6 text-sm text-gray-400 hover:text-primary"><ArrowLeft className="h-4 w-4" />العودة إلى المتجر</Link></div></div></div>;
}
