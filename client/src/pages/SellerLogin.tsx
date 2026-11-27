import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, LogIn, ShoppingBag } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";

export default function SellerLogin() {
  const [, navigate] = useLocation();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const accountQuery = trpc.seller.loginWithAccount.useQuery(undefined, { enabled: isAuthenticated, retry: false });

  useEffect(() => {
    if (accountQuery.data?.accessToken) {
      sessionStorage.setItem("sellerToken", accountQuery.data.accessToken);
      navigate("/seller/dashboard");
    }
  }, [accountQuery.data, navigate]);

  const loginWithManus = () => {
    sessionStorage.setItem("sellerAuthReturn", "/seller/login");
    startLogin();
  };

  return <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50 px-4" dir="rtl"><div className="w-full max-w-md"><Link href="/" className="mb-8 flex items-center justify-center gap-2 text-primary"><span className="rounded-2xl bg-orange-100 p-3"><ShoppingBag className="h-8 w-8 text-primary" /></span><span className="text-3xl font-black">سوق أبدع</span></Link><div className="rounded-3xl border border-orange-100 bg-white p-8 shadow-xl"><div className="mb-8 text-center"><div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100"><ShoppingBag className="h-8 w-8 text-primary" /></div><h1 className="text-2xl font-black text-[#1A1A1A]">دخول البائعين</h1><p className="mt-2 text-sm leading-7 text-gray-500">سيتم التحقق من حسابك عبر Manus ثم فتح لوحة متجرك مباشرة.</p></div><button onClick={loginWithManus} disabled={authLoading || accountQuery.isFetching} className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-secondary to-primary py-4 font-bold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 disabled:opacity-60"><LogIn className="h-5 w-5" />{accountQuery.isFetching ? "جارٍ فتح المتجر..." : "الدخول عبر Google / Microsoft / Apple"}</button>{isAuthenticated && accountQuery.isError && <p className="mt-5 rounded-xl bg-amber-50 px-4 py-3 text-center text-sm text-amber-700">لا يوجد متجر مفعّل مرتبط بهذا الحساب.</p>}<Link href="/" className="mt-6 flex items-center justify-center gap-2 border-t pt-6 text-sm text-gray-400 hover:text-primary"><ArrowLeft className="h-4 w-4" />العودة إلى المتجر</Link></div></div></div>;
}
