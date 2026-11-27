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
  const login = () => startLogin();

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
            <ShoppingBag className="w-6 h-6 text-primary" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent">
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
          {isAuthenticated && accountQuery.data ? <Button asChild variant="outline" className="rounded-full border-primary/30 px-5 py-5 text-primary hover:bg-primary/5"><Link href="/seller/dashboard">لوحة متجري</Link></Button> : <Button asChild variant="outline" className="rounded-full border-primary/30 px-5 py-5 text-primary hover:bg-primary/5"><Link href="/register-seller">أضف مشروعك</Link></Button>}
          {isAdmin && <Button asChild variant="outline" className="rounded-full border-orange-300 px-5 py-5 text-primary hover:bg-orange-50"><Link href="/admin">لوحة الإدارة</Link></Button>}
          <Button asChild className="rounded-full bg-gradient-to-r from-secondary to-primary text-white font-medium px-6 py-5 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5"><Link href="/register-seller">سجّل مشروعك</Link></Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-full"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 inset-x-0 bg-white border-b border-gray-100 px-4 py-6 shadow-xl flex flex-col gap-4 animate-in slide-in-from-top-4">
          <div className="relative w-full">
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="ابحث عن منتج..." 
              className="w-full bg-gray-50 border border-gray-200 rounded-full py-3 pr-12 pl-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <Button asChild variant="outline" className="w-full rounded-full border-primary/30 py-6 text-lg text-primary">
            {!isAuthenticated ? <button onClick={() => { setIsMenuOpen(false); login(); }} className="w-full">تسجيل الدخول</button> : <span className="text-center text-sm font-bold text-gray-700">{user?.name || user?.email}</span>}
          </Button>
          <Button asChild variant="outline" className="w-full rounded-full border-primary/30 py-6 text-lg text-primary">
            {isAuthenticated && accountQuery.data ? <Link href="/seller/dashboard" onClick={() => setIsMenuOpen(false)}>لوحة متجري</Link> : <Link href="/register-seller" onClick={() => setIsMenuOpen(false)}>أضف مشروعك</Link>}
          </Button>
          <Button asChild className="w-full rounded-full bg-gradient-to-r from-secondary to-primary text-white font-medium py-6 text-lg mt-2"><Link href="/register-seller" onClick={() => setIsMenuOpen(false)}>سجّل مشروعك</Link></Button>
          {isAdmin && <Button asChild variant="outline" className="w-full rounded-full border-orange-300 py-6 text-lg text-primary"><Link href="/admin" onClick={() => setIsMenuOpen(false)}>لوحة الإدارة</Link></Button>}
        </div>
      )}
    </nav>
  );
}
