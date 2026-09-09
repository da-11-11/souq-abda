import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Categories } from "@/components/Categories";
import { ProductGrid } from "@/components/ProductGrid";
import { TrustSection } from "@/components/TrustSection";
import { SellerForm } from "@/components/SellerForm";
import { Footer } from "@/components/Footer";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col w-full font-sans bg-white overflow-x-hidden">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Categories
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <ProductGrid selectedCategory={selectedCategory} />
        <TrustSection />
        <SellerForm />
      </main>
      <Footer />
    </div>
  );
}
