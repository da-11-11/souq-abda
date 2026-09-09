import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageCircle, Crown, Info, MapPin } from "lucide-react";
import { categoryLabel, type Product } from "@/data";

export function ProductModal({ product, isOpen, onClose }: { product: Product | null; isOpen: boolean; onClose: () => void }) {
  if (!product) return null;

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`مرحباً، أنا مهتم بمنتج "${product.name}" المعروض في سوق أبدع.`);
    window.open(`https://wa.me/${product.sellerPhone}?text=${text}`, "_blank", "noopener,noreferrer");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl overflow-hidden rounded-[2rem] border-0 bg-white p-0" aria-describedby={undefined}>
        <DialogTitle className="sr-only">{product.name}</DialogTitle>
        <div className="flex max-h-[90vh] flex-col md:flex-row">
          <div className="relative w-full bg-gray-100 md:w-1/2">
            <img src={product.image} alt={product.name} className="h-full min-h-[300px] w-full object-cover" />
            {product.isVIP && <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-[#ffb300] px-3 py-1.5 text-xs font-black text-gray-950 shadow-lg"><Crown className="h-3.5 w-3.5" /> بائع موثوق</div>}
          </div>
          <div className="flex w-full flex-col justify-between overflow-y-auto p-6 md:w-1/2 md:p-8">
            <div>
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-bold text-primary">{categoryLabel(product.category)}</span>
                <span className="text-2xl font-black text-gray-950">{product.price}</span>
              </div>
              <h2 className="mt-5 text-2xl font-black leading-tight text-gray-950 md:text-3xl">{product.name}</h2>
              <div className="mb-6 mt-5 flex items-center gap-3 border-b border-gray-100 pb-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-lg font-black text-primary">{product.seller.charAt(0)}</div>
                <div><p className="text-xs text-gray-400">البائع</p><p className="flex items-center gap-1 font-black text-gray-950">{product.seller}{product.isVIP && <Crown className="h-4 w-4 text-[#ffb300]" />}</p></div>
              </div>
              <div className="space-y-3">
                <h3 className="flex items-center gap-2 text-lg font-black text-gray-950"><Info className="h-5 w-5 text-primary" /> تفاصيل المنتج</h3>
                <p className="leading-8 text-gray-600">{product.description}</p>
              </div>
              <div className="mt-5 flex items-center gap-2 text-sm text-gray-400"><MapPin className="h-4 w-4" /> الأردن · شحن متفق عليه مع البائع</div>
            </div>
            <div className="mt-8 border-t border-gray-100 pt-6">
              <Button onClick={handleWhatsApp} className="h-14 w-full rounded-2xl bg-[#25D366] text-lg font-black text-white shadow-lg shadow-[#25D366]/25 transition-transform hover:-translate-y-0.5 hover:bg-[#20bd5a]"><MessageCircle className="h-6 w-6" /> اطلب عبر واتساب</Button>
              <p className="mt-3 text-center text-xs text-gray-400">تواصل مباشر مع البائع بدون وسطاء</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
