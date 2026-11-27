import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { SellerForm } from "@/components/SellerForm";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2, LogIn, ShoppingBag } from "lucide-react";

export default function SellerRegister() {
  const { user, loading, isAuthenticated } = useAuth();

  const login = () => {
    sessionStorage.setItem("sellerAuthReturn", "/register-seller");
    startLogin();
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-[#1A1A1A] text-[#D4AF37]" dir="rtl">جارٍ التحقق من الحساب...</div>;
  }

  return (
    <main className="min-h-screen bg-[#1A1A1A] px-4 py-8 text-white" dir="rtl">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-white transition-opacity hover:opacity-80">
            <span className="rounded-2xl bg-[#D4AF37]/15 p-3"><ShoppingBag className="h-7 w-7 text-[#D4AF37]" /></span>
            <span className="text-2xl font-black">سوق أبدع</span>
          </Link>
          <Link href="/" className="flex items-center gap-2 text-sm text-white/70 hover:text-[#D4AF37]"><ArrowRight className="h-4 w-4" />العودة للمتجر</Link>
        </header>

        <section className="mb-8 rounded-[2rem] border border-[#D4AF37]/25 bg-white/[0.06] p-6 shadow-2xl sm:p-10">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-bold tracking-[0.2em] text-[#D4AF37]">بوابة الحرفيين الأردنيين</p>
            <h1 className="text-3xl font-black leading-tight sm:text-5xl">حوّل موهبتك إلى متجر يصل إلى عملاء جدد</h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-white/70">سجّل حسابك بأمان عبر Manus، ثم أرسل بيانات مشروعك واختر التجربة المجانية أو الباقة المناسبة.</p>
          </div>
        </section>

        {!isAuthenticated ? (
          <section className="mx-auto max-w-2xl rounded-[2rem] bg-white p-8 text-[#1A1A1A] shadow-2xl sm:p-12">
            <div className="mx-auto max-w-md text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#D4AF37]/15"><LogIn className="h-8 w-8 text-[#9c7d12]" /></div>
              <h2 className="text-2xl font-black">ابدأ بتسجيل حسابك</h2>
              <p className="mt-3 leading-7 text-gray-500">تسجيل الدخول الموحد عبر Manus متاح باستخدام Google أو Microsoft أو Apple، وستعود تلقائياً إلى هذه الصفحة.</p>
              <button onClick={login} className="mt-7 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#1A1A1A] px-5 py-4 font-bold text-white transition hover:bg-black active:scale-[.98]"><LogIn className="h-5 w-5 text-[#D4AF37]" />تسجيل الدخول عبر Manus</button>
              <p className="mt-4 text-xs text-gray-400">لا نطلب كلمة مرور جديدة؛ حسابك الموحد يحمي دخولك إلى لوحة المتجر.</p>
            </div>
          </section>
        ) : (
          <section className="rounded-[2rem] bg-white p-4 text-[#1A1A1A] shadow-2xl sm:p-8">
            <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-[#D4AF37]/30 bg-[#fffaf0] p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-[#9c7d12]">تم تسجيل الدخول بالحساب الموحد</p>
                <h2 className="mt-1 text-xl font-black">مرحباً، {user?.name || "بائع سوق أبدع"}</h2>
                {user?.email && <p className="mt-1 text-sm text-gray-500" dir="ltr">{user.email}</p>}
              </div>
              <CheckCircle2 className="h-8 w-8 shrink-0 text-green-600" />
            </div>
            <SellerForm />
          </section>
        )}
      </div>
    </main>
  );
}
