import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Categories } from "@/components/Categories";
import { ProductGrid } from "@/components/ProductGrid";
import { TrustSection } from "@/components/TrustSection";
import { Footer } from "@/components/Footer";
import { trpc } from "@/lib/trpc";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data: announcement } = trpc.catalog.announcement.useQuery();

  return (
    <div className="min-h-screen flex flex-col w-full font-sans bg-white overflow-x-hidden">
      <Navbar />
      {announcement?.active && <div className="bg-[#1A1A1A] px-4 py-2 text-center text-sm font-bold text-[#D4AF37]">{announcement.text}</div>}
      <main className="flex-grow">
        <Hero />
        <Categories
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <ProductGrid selectedCategory={selectedCategory} />
        <TrustSection />
      </main>
      <Footer />
    </div>
  );
}
