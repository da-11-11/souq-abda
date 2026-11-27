import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { SellerForm } from "@/components/SellerForm";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2, LogIn, ShoppingBag } from "lucide-react";

export default function SellerRegister() {
  const { user, loading, isAuthenticated } = useAuth();
  const applicationQuery = trpc.seller.myApplication.useQuery(undefined, { enabled: isAuthenticated, retry: false });

  const login = () => {
    sessionStorage.setItem("sellerAuthReturn", "/register-seller");
    startLogin();
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50 text-primary" dir="rtl">جارٍ التحقق من الحساب...</div>;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 px-3 py-4 text-[#1A1A1A] sm:px-4 sm:py-8" dir="rtl">
      <div className="mx-auto max-w-6xl">
        <header className="mb-5 flex items-center justify-between sm:mb-8">
          <Link href="/" className="flex items-center gap-2 text-primary transition-opacity hover:opacity-80 sm:gap-3">
            <span className="rounded-xl bg-orange-100 p-2 sm:rounded-2xl sm:p-3"><ShoppingBag className="h-6 w-6 text-primary sm:h-7 sm:w-7" /></span>
            <span className="text-xl font-black text-primary sm:text-2xl">سوق أبدع</span>
          </Link>
          <Link href="/" className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary sm:gap-2 sm:text-sm"><ArrowRight className="h-4 w-4" />العودة للمتجر</Link>
        </header>

        <section className="mb-5 rounded-3xl border border-primary/15 bg-white p-4 shadow-xl sm:mb-8 sm:rounded-[2rem] sm:p-10">
          <div className="max-w-3xl">
            <p className="mb-2 text-xs font-bold tracking-[0.12em] text-primary sm:mb-3 sm:text-sm sm:tracking-[0.2em]">بوابة الحرفيين الأردنيين</p>
            <h1 className="text-2xl font-black leading-tight sm:text-5xl">حوّل موهبتك إلى متجر يصل إلى عملاء جدد</h1>
            <p className="mt-3 text-sm leading-7 text-gray-600 sm:mt-4 sm:max-w-2xl sm:text-base sm:leading-8">سجّل حسابك بأمان عبر Manus، ثم أرسل بيانات مشروعك واختر التجربة المجانية أو الباقة المناسبة.</p>
          </div>
        </section>

        {!isAuthenticated ? (
          <section className="mx-auto max-w-2xl rounded-3xl bg-white p-5 text-[#1A1A1A] shadow-2xl sm:rounded-[2rem] sm:p-12">
            <div className="mx-auto max-w-md text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100"><LogIn className="h-8 w-8 text-primary" /></div>
              <h2 className="text-2xl font-black">ابدأ بتسجيل حسابك</h2>
              <p className="mt-3 leading-7 text-gray-500">تسجيل الدخول الموحد عبر Manus متاح باستخدام Google أو Microsoft أو Apple، وستعود تلقائياً إلى هذه الصفحة.</p>
              <button onClick={login} className="mt-7 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-secondary to-primary px-5 py-4 font-bold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 active:scale-[.98]"><LogIn className="h-5 w-5" />تسجيل الدخول عبر Manus</button>
              <p className="mt-4 text-xs text-gray-400">لا نطلب كلمة مرور جديدة؛ حسابك الموحد يحمي دخولك إلى لوحة المتجر.</p>
            </div>
          </section>
        ) : applicationQuery.data?.status === "pending" ? (
          <section className="mx-auto max-w-2xl rounded-3xl bg-white p-5 text-center shadow-2xl sm:rounded-[2rem] sm:p-10">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600"><CheckCircle2 className="h-8 w-8" /></div>
            <h2 className="text-2xl font-black">طلبك قيد المراجعة</h2>
            <p className="mt-4 leading-8 text-gray-600">طلبك قيد المراجعة من قبل الإدارة، سيتم تفعيل صلاحية إضافة مشروعك فور الموافقة.</p>
            <p className="mt-3 text-sm text-gray-400" dir="ltr">{user?.email}</p>
          </section>
        ) : applicationQuery.data?.status === "approved" ? (
          <section className="mx-auto max-w-2xl rounded-3xl bg-white p-5 text-center shadow-2xl sm:rounded-[2rem] sm:p-10">
            <CheckCircle2 className="mx-auto mb-5 h-16 w-16 text-green-600" />
            <h2 className="text-2xl font-black">متجرك مفعّل</h2>
            <p className="mt-4 leading-8 text-gray-600">يمكنك الآن إدارة متجرك وإضافة منتجاتك.</p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/seller/login" className="inline-flex items-center justify-center rounded-full border-2 border-primary px-6 py-3 font-bold text-primary">دخول إلى صفحة البائع</Link><Link href="/seller/dashboard" className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-secondary to-primary px-7 py-3 font-bold text-white">لوحة متجري</Link></div>
          </section>
        ) : (
          <section className="rounded-3xl bg-white p-3 text-[#1A1A1A] shadow-2xl sm:rounded-[2rem] sm:p-8">
            <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-[#D4AF37]/30 bg-[#fffaf0] p-4 sm:mb-6 sm:gap-4 sm:p-5 md:flex-row md:items-center md:justify-between">
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
