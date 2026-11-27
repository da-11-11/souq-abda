import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageCircle, Crown, Info, MapPin } from "lucide-react";
import { categoryLabel, type Product } from "@/data";

export function ProductModal({ product, isOpen, onClose }: { product: Product | null; isOpen: boolean; onClose: () => void }) {
  if (!product) return null;

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`مرحباً، أرغب بالاستفسار عن منتج "${product.name}" من متجر ${product.seller}، وسعره ${product.price}. هل المنتج متاح؟`);
    window.dispatchEvent(new CustomEvent("souq-whatsapp-click", { detail: { productId: product.id, productName: product.name, seller: product.seller, price: product.price } }));
    window.open(`https://wa.me/${product.sellerPhone}?text=${text}`, "_blank", "noopener,noreferrer");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl overflow-hidden rounded-2xl border-0 bg-white p-0 md:rounded-[2rem]" aria-describedby={undefined}>
        <DialogTitle className="sr-only">{product.name}</DialogTitle>
        <div className="flex max-h-[88vh] flex-col md:max-h-[90vh] md:flex-row">
          <div className="relative w-full bg-gray-100 md:w-1/2">
            <img src={product.image} alt={product.name} loading="lazy" className="h-52 w-full object-cover sm:h-64 md:h-full md:min-h-[300px]" />
            {product.isVIP && <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-[#ffb300] px-2.5 py-1 text-[11px] font-black text-gray-950 shadow-lg md:right-4 md:top-4 md:px-3 md:py-1.5 md:text-xs"><Crown className="h-3.5 w-3.5" /> بائع موثوق</div>}
          </div>
          <div className="flex w-full flex-col justify-between overflow-y-auto p-4 md:w-1/2 md:p-8">
            <div>
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-bold text-primary md:px-3 md:text-sm">{categoryLabel(product.category)}</span>
                <span className="text-xl font-black text-gray-950 md:text-2xl">{product.price}</span>
              </div>
              <h2 className="mt-3 text-xl font-black leading-tight text-gray-950 md:mt-5 md:text-3xl">{product.name}</h2>
              <div className="mb-4 mt-3 flex items-center gap-2 border-b border-gray-100 pb-4 md:mb-6 md:mt-5 md:gap-3 md:pb-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-base font-black text-primary md:h-11 md:w-11 md:rounded-2xl md:text-lg">{product.seller.charAt(0)}</div>
                <div><p className="text-xs text-gray-400">البائع</p><p className="flex items-center gap-1 font-black text-gray-950">{product.seller}{product.isVIP && <Crown className="h-4 w-4 text-[#ffb300]" />}</p></div>
              </div>
              <div className="space-y-2 md:space-y-3">
                <h3 className="flex items-center gap-2 text-base font-black text-gray-950 md:text-lg"><Info className="h-4 w-4 text-primary md:h-5 md:w-5" /> تفاصيل المنتج</h3>
                <p className="text-sm leading-6 text-gray-600 md:text-base md:leading-8">{product.description}</p>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-gray-400 md:mt-5 md:text-sm"><MapPin className="h-4 w-4" /> الأردن · شحن متفق عليه مع البائع</div>
            </div>
            <div className="mt-5 border-t border-gray-100 pt-4 md:mt-8 md:pt-6">
              <Button onClick={handleWhatsApp} className="h-12 w-full rounded-xl bg-[#25D366] text-base font-black text-white shadow-lg shadow-[#25D366]/25 transition-transform hover:-translate-y-0.5 hover:bg-[#20bd5a] md:h-14 md:rounded-2xl md:text-lg"><MessageCircle className="h-5 w-5 md:h-6 md:w-6" /> اطلب عبر واتساب</Button>
              <p className="mt-2 text-center text-[11px] text-gray-400 md:mt-3 md:text-xs">تواصل مباشر مع البائع بدون وسطاء</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
