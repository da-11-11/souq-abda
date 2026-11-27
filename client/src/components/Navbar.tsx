import { useState } from "react";
import { Link } from "wouter";
import { Search, Menu, ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.email?.toLowerCase() === "dawoodrababh2008@gmail.com";
  const accountQuery = trpc.seller.loginWithAccount.useQuery(undefined, { enabled: isAuthenticated, retry: false });
  const applicationQuery = trpc.seller.myApplication.useQuery(undefined, { enabled: isAuthenticated, retry: false });
  const login = () => startLogin();

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="container mx-auto flex h-14 items-center justify-between px-2.5 md:h-20 md:px-6">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-1.5 md:gap-2">
          <div className="rounded-lg bg-primary/10 p-1.5 transition-colors group-hover:bg-primary/20 md:rounded-xl md:p-2">
            <ShoppingBag className="h-5 w-5 text-primary md:h-6 md:w-6" />
          </div>
          <span className="text-xl font-bold text-primary md:bg-gradient-to-l md:from-primary md:to-secondary md:bg-clip-text md:text-2xl md:text-transparent">
            سوق أبدع
          </span>
        </Link>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input 
            type="text" 
            placeholder="ابحث عن منتج..." 
            className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 pr-12 pl-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
          />
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {!isAuthenticated ? <Button onClick={login} variant="outline" className="rounded-full border-primary/30 px-5 py-5 text-primary hover:bg-primary/5">تسجيل الدخول</Button> : <div className="hidden max-w-40 text-right lg:block"><b className="block truncate text-sm text-gray-800">{user?.name || "حسابي"}</b><span className="block truncate text-xs text-gray-400" dir="ltr">{user?.email}</span></div>}
          {accountQuery.data ? <Button asChild variant="outline" className="rounded-full border-primary/30 px-5 py-5 text-primary hover:bg-primary/5"><Link href="/seller/dashboard">لوحة متجري</Link></Button> : applicationQuery.data?.status === "pending" ? <span className="rounded-full bg-amber-50 px-4 py-2 text-xs font-bold text-amber-700">طلب انضمامك قيد المراجعة</span> : <Button asChild variant="outline" className="rounded-full border-primary/30 px-5 py-5 text-primary hover:bg-primary/5"><Link href="/register-seller">سجّل مشروعك</Link></Button>}
          {isAdmin && <Button asChild variant="outline" className="rounded-full border-orange-300 px-5 py-5 text-primary hover:bg-orange-50"><Link href="/admin">لوحة الإدارة</Link></Button>}
          <Button asChild className="rounded-full bg-gradient-to-r from-secondary to-primary text-white font-medium px-6 py-5 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5"><Link href="/register-seller">سجّل مشروعك</Link></Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="rounded-full p-1.5 text-gray-600 hover:bg-gray-50 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute inset-x-0 top-14 flex flex-col gap-3 border-b border-gray-100 bg-white px-3 py-4 shadow-xl animate-in slide-in-from-top-4 md:hidden">
          <div className="relative w-full">
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="ابحث عن منتج..." 
              className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pr-10 pl-4 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <Button asChild variant="outline" className="w-full rounded-full border-primary/30 py-4 text-sm text-primary">
            {!isAuthenticated ? <button onClick={() => { setIsMenuOpen(false); login(); }} className="w-full">تسجيل الدخول</button> : <span className="text-center text-sm font-bold text-gray-700">{user?.name || user?.email}</span>}
          </Button>
          <Button asChild variant="outline" className="w-full rounded-full border-primary/30 py-4 text-sm text-primary">
            {accountQuery.data ? <Link href="/seller/dashboard" onClick={() => setIsMenuOpen(false)}>لوحة متجري</Link> : applicationQuery.data?.status === "pending" ? <span>طلب انضمامك قيد المراجعة</span> : <Link href="/register-seller" onClick={() => setIsMenuOpen(false)}>سجّل مشروعك</Link>}
          </Button>
          <Button asChild className="mt-1 w-full rounded-full bg-gradient-to-r from-secondary to-primary py-4 text-sm font-medium text-white"><Link href="/register-seller" onClick={() => setIsMenuOpen(false)}>سجّل مشروعك</Link></Button>
          {isAdmin && <Button asChild variant="outline" className="w-full rounded-full border-orange-300 py-4 text-sm text-primary"><Link href="/admin" onClick={() => setIsMenuOpen(false)}>لوحة الإدارة</Link></Button>}
        </div>
      )}
    </nav>
  );
}
