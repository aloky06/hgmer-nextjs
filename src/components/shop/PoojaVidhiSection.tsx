"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  CheckCircle2,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Flame,
  ListOrdered,
} from "lucide-react";
import { PoojaVidhi, fetchPoojaVidhis, Product, fetchProducts } from "@/lib/api";
import { useCart } from "@/context/CartContext";

export default function PoojaVidhiSection() {
  const [vidhis, setVidhis] = useState<PoojaVidhi[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeVidhiIndex, setActiveVidhiIndex] = useState(0);
  const { addToCart, showToast } = useCart();

  useEffect(() => {
    Promise.all([fetchPoojaVidhis(), fetchProducts()]).then(([vList, pList]) => {
      setVidhis(vList);
      setProducts(pList);
    });
  }, []);

  if (vidhis.length === 0) return null;

  const currentVidhi = vidhis[activeVidhiIndex] || vidhis[0];

  const handleAddAllItems = () => {
    if (products.length > 0) {
      // Add first 3 relevant products for this pooja
      products.slice(0, 3).forEach((p) => addToCart(p, 1));
      showToast(`✓ ${currentVidhi.title} की सभी आवश्यक सामग्रियां कार्ट में जोड़ी गईं!`);
    }
  };

  const steps = currentVidhi.procedure
    .split(/\d+\.\s*/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <section id="vidhi-section" className="py-20 bg-[#FFFDF9] relative">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-3">
            <BookOpen className="w-4 h-4 text-orange-600" />
            <span>वैदिक ज्ञान एवं मार्गदर्शन</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-zinc-900 tracking-tight">
            पूजा विधि एवं <span className="font-light italic text-orange-600">1-क्लिक सामग्री</span>
          </h2>
          <p className="text-xs md:text-sm text-zinc-600 mt-3 font-medium">
            प्रामाणिक शास्त्रों के अनुसार पूजा की सम्पूर्ण चरणबद्ध विधि जानें और आवश्यक सामग्री 1-क्लिक में मंगवाएं
          </p>
        </div>

        {/* Vidhi Switcher Tabs */}
        {vidhis.length > 1 && (
          <div className="flex justify-center gap-3 mb-10 overflow-x-auto pb-2 no-scrollbar">
            {vidhis.map((v, idx) => (
              <button
                key={v.id || idx}
                onClick={() => setActiveVidhiIndex(idx)}
                className={`px-6 py-2.5 rounded-2xl text-xs md:text-sm font-bold whitespace-nowrap transition-all ${
                  activeVidhiIndex === idx
                    ? "bg-orange-600 text-white shadow-lg shadow-orange-600/30 scale-105"
                    : "bg-white text-zinc-700 border border-orange-200 hover:border-orange-400"
                }`}
              >
                {v.title}
              </button>
            ))}
          </div>
        )}

        {/* Main Vidhi Container */}
        <div className="bg-white rounded-[2.5rem] p-6 md:p-10 border border-orange-200 shadow-xl shadow-orange-950/5 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-orange-600 mb-2">
              <ListOrdered className="w-4 h-4" />
              <span>चरणबद्ध वैदिक विधि</span>
            </div>
            <h3 className="text-2xl font-black text-zinc-900 mb-4">
              {currentVidhi.title}
            </h3>

            <div className="space-y-3 mb-6 bg-orange-50/50 p-5 rounded-2xl border border-orange-100">
              {steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-orange-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs md:text-sm text-zinc-700 font-medium leading-relaxed">
                    {step}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={handleAddAllItems}
              className="w-full sm:w-auto bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-extrabold px-8 py-4 rounded-2xl text-xs md:text-sm transition-all shadow-xl shadow-orange-600/25 hover:scale-105 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              इस पूजा की संपूर्ण सामग्री 1-क्लिक में जोड़ें
            </button>
          </div>

          {/* Right: Required Samagri Checklist Card */}
          <div className="bg-[#FFFDF9] rounded-3xl p-6 border border-orange-200">
            <h4 className="text-sm font-black text-zinc-900 mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-600" />
                अनिवार्य सामग्री चेकलिस्ट:
              </span>
              <span className="text-xs text-orange-700 font-bold bg-orange-100 px-2.5 py-1 rounded-full">
                {products.slice(0, 3).length} सामग्रियां
              </span>
            </h4>

            <div className="space-y-3">
              {products.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 p-3 bg-white rounded-xl border border-orange-100 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-orange-50 overflow-hidden shrink-0 border border-orange-100 flex items-center justify-center">
                      <img
                        src={item.imageUrl || "/puja_thali.jpeg"}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-xs md:text-sm text-zinc-900 line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-zinc-500">100% शुद्ध प्रमाणित</p>
                    </div>
                  </div>
                  <span className="font-black text-xs md:text-sm text-orange-600 shrink-0">
                    ₹{item.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
