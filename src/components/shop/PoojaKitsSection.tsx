"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Package,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Star,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Product, fetchProducts } from "@/lib/api";

export default function PoojaKitsSection() {
  const { addToCart } = useCart();
  const [kits, setKits] = useState<Product[]>([]);
  const [selectedKitIndex, setSelectedKitIndex] = useState(0);

  useEffect(() => {
    fetchProducts().then((allProducts) => {
      const bundleKits = allProducts.filter((p) => p.type === "BUNDLE" || p.name.includes("किट") || p.name.includes("Kit") || p.name.includes("सेट"));
      if (bundleKits.length > 0) {
        setKits(bundleKits);
      } else if (allProducts.length > 0) {
        setKits(allProducts.slice(0, 3));
      }
    });
  }, []);

  if (kits.length === 0) return null;

  const currentKit = kits[selectedKitIndex] || kits[0];

  const discountPercent =
    currentKit.mrp && currentKit.mrp > currentKit.price
      ? Math.round(((currentKit.mrp - currentKit.price) / currentKit.mrp) * 100)
      : null;

  return (
    <section id="kits-section" className="py-20 bg-gradient-to-b from-[#FFFDF9] via-[#FFF6EB] to-[#FFFDF9] relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-orange-200/40 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-3">
            <Package className="w-4 h-4 text-orange-600" />
            <span>ऑल-इन-वन कम्प्लीट सोल्यूशन</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-zinc-900 tracking-tight">
            सम्पूर्ण <span className="font-light italic text-orange-600">पूजा किट एवं बॉक्स</span>
          </h2>
          <p className="text-xs md:text-sm text-zinc-600 mt-3 font-medium">
            एक ही बॉक्स में पाएं पूजा की हर आवश्यक वस्तु। अलग-अलग सामान खरीदने की झंझट से मुक्ति!
          </p>
        </div>

        {/* Kit Selector Tabs */}
        {kits.length > 1 && (
          <div className="flex justify-center gap-3 mb-10 overflow-x-auto pb-2 no-scrollbar">
            {kits.map((kit, idx) => (
              <button
                key={kit.id}
                onClick={() => setSelectedKitIndex(idx)}
                className={`px-6 py-3 rounded-2xl text-xs md:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  selectedKitIndex === idx
                    ? "bg-zinc-900 text-white shadow-xl scale-105"
                    : "bg-white text-zinc-700 border border-orange-200 hover:border-orange-400"
                }`}
              >
                <span>{kit.name.split("(")[0]}</span>
                {selectedKitIndex === idx && (
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Active Kit Spotlight Showcase Card */}
        <motion.div
          key={currentKit.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-[2.5rem] p-6 md:p-12 shadow-2xl shadow-orange-950/10 border border-orange-200 max-w-5xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12 items-center"
        >
          {/* Left: Image */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative aspect-square rounded-3xl bg-gradient-to-br from-orange-50 to-amber-100 p-6 flex items-center justify-center overflow-hidden border border-orange-200">
              <span className="absolute top-4 left-4 bg-orange-600 text-white text-xs font-black px-3.5 py-1.5 rounded-full shadow-lg z-10">
                ★ महाकिट
              </span>
              {discountPercent && (
                <span className="absolute top-4 right-4 bg-emerald-600 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg z-10">
                  {discountPercent}% बचत
                </span>
              )}
              <img
                src={currentKit.imageUrl || "/havan_set.jpeg"}
                alt={currentKit.name}
                className="w-full h-full object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-zinc-600 font-semibold px-2">
              <span className="flex items-center gap-1.5 text-emerald-700">
                <ShieldCheck className="w-4 h-4" /> 100% शुद्ध सामग्री गारंटी
              </span>
              <span className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span className="font-bold text-zinc-900">{currentKit.rating || 4.9}</span>
                <span className="text-zinc-400">({currentKit.reviewCount || 100} समीक्षाएं)</span>
              </span>
            </div>
          </div>

          {/* Right: Info */}
          <div className="w-full lg:w-1/2 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl md:text-3xl font-black text-zinc-900 mb-3 leading-tight">
                {currentKit.name}
              </h3>
              <p className="text-xs md:text-sm text-zinc-600 mb-6 leading-relaxed">
                {currentKit.description}
              </p>

              <div className="mb-8 bg-[#FFFDF9] p-4 rounded-2xl border border-orange-100">
                <h4 className="text-xs font-extrabold text-orange-950 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-600" />
                  इस महाकिट की विशेषताएं:
                </h4>
                <p className="text-xs text-zinc-700 font-medium leading-relaxed">
                  शास्त्र सम्मत विधि से संकलित, मंदिर अभिमंत्रित व वैदिक पुरोहितों द्वारा प्रमाणित संपूर्ण सामग्री।
                </p>
              </div>
            </div>

            {/* Price & Action */}
            <div className="pt-6 border-t border-orange-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-orange-600">
                    ₹{currentKit.price}
                  </span>
                  {currentKit.mrp && currentKit.mrp > currentKit.price && (
                    <span className="text-sm text-zinc-400 line-through">
                      MRP ₹{currentKit.mrp}
                    </span>
                  )}
                </div>
                {currentKit.mrp && currentKit.mrp > currentKit.price && (
                  <p className="text-xs font-bold text-emerald-600 mt-0.5">
                    सीधी बचत: ₹{currentKit.mrp - currentKit.price} (मुफ्त डिलीवरी उपलब्ध)
                  </p>
                )}
              </div>

              <button
                onClick={() => addToCart(currentKit)}
                className="w-full sm:w-auto bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-extrabold px-8 py-4 rounded-2xl text-sm transition-all shadow-xl shadow-orange-600/30 hover:scale-105 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                सम्पूर्ण किट कार्ट में जोड़ें
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
