import { useState } from "react";
import { Link } from "wouter";
import { Search, Menu, ShoppingBag, X, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.email?.toLowerCase() === "dawoodrababh2008@gmail.com";
  const accountQuery = trpc.seller.loginWithAccount.useQuery(undefined, { enabled: isAuthenticated, retry: false });
  const login = () => startLogin();
  const updateSearch = (value: string) => {
    setSearchTerm(value);
    window.dispatchEvent(new CustomEvent("souq-product-search", { detail: value }));
  };
  const searchBox = (mobile = false) => (
    <label className={`relative ${mobile ? "block w-full" : "hidden flex-1 md:block md:max-w-xl"}`} htmlFor={mobile ? "mobile-search" : "nav-search"}>
      <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input id={mobile ? "mobile-search" : "nav-search"} type="search" value={searchTerm} onChange={(event) => updateSearch(event.target.value)} placeholder="ابحث عن منتج أو متجر..." className="h-10 w-full rounded-full border border-gray-200 bg-gray-50 px-10 text-sm outline-none transition focus:border-[#D4AF37] focus:bg-white focus:ring-4 focus:ring-[#D4AF37]/10" />
    </label>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur" dir="rtl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-3 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-[#1A1A1A]"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1A1A1A]"><ShoppingBag className="h-5 w-5 text-[#D4AF37]" /></span><span className="text-lg font-black sm:text-xl">سوق <span className="text-[#D4AF37]">أبدع</span></span></Link>
        {searchBox()}
        <div className="hidden shrink-0 items-center gap-2 md:flex">
          {isAuthenticated ? <span className="hidden max-w-28 truncate text-xs font-bold text-gray-600 lg:block">{user?.name || user?.email}</span> : <Button onClick={login} variant="ghost" className="text-xs font-bold text-[#1A1A1A]">دخول</Button>}
          <Button asChild size="sm" className="rounded-full bg-[#1A1A1A] font-bold text-[#D4AF37] hover:bg-[#333]"><Link href={isAuthenticated && accountQuery.data ? "/seller/dashboard" : "/register-seller"}><Store className="ml-1 h-4 w-4" />سجّل مشروعك</Link></Button>
          {isAdmin && <Link href="/admin" className="text-xs font-bold text-[#D4AF37]">الإدارة</Link>}
        </div>
        <button type="button" aria-label="فتح القائمة" className="mr-auto rounded-full p-2 text-[#1A1A1A] hover:bg-gray-100 md:hidden" onClick={() => setIsMenuOpen((open) => !open)}>{isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
      </div>
      {isMenuOpen && <div className="border-t border-gray-100 bg-white p-4 shadow-lg md:hidden"><div className="mx-auto flex max-w-7xl flex-col gap-3">{searchBox(true)}{isAuthenticated && <p className="text-sm font-bold text-gray-600">مرحباً، {user?.name || user?.email}</p>}<Button asChild className="w-full rounded-full bg-[#1A1A1A] text-[#D4AF37]" onClick={() => setIsMenuOpen(false)}><Link href={isAuthenticated && accountQuery.data ? "/seller/dashboard" : "/register-seller"}>سجّل مشروعك</Link></Button>{!isAuthenticated && <Button variant="outline" onClick={() => { setIsMenuOpen(false); login(); }} className="w-full rounded-full">تسجيل الدخول</Button>}{isAdmin && <Button asChild variant="outline" onClick={() => setIsMenuOpen(false)}><Link href="/admin">لوحة الإدارة</Link></Button>}</div></div>}
    </nav>
  );
}
