"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  BookOpen,
  ShoppingBag,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  CalendarCheck,
  Flame,
  ShieldCheck,
  ListOrdered,
} from "lucide-react";
import Link from "next/link";
import { PoojaVidhi, fetchPoojaVidhiById, fetchPoojaVidhis } from "@/lib/api";
import { useCart } from "@/context/CartContext";

export default function PoojaVidhiDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart, showToast } = useCart();
  const [vidhi, setVidhi] = useState<PoojaVidhi | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchPoojaVidhiById(Number(params.id))
        .then((data) => {
          setVidhi(data);
          setLoading(false);
        })
        .catch(() => {
          // Try fetching from list
          fetchPoojaVidhis().then((list) => {
            const found = list.find((v) => String(v.id) === String(params.id));
            if (found) setVidhi(found);
            setLoading(false);
          });
        });
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-zinc-500 font-bold">पूजा विधि लोड हो रही है...</p>
      </div>
    );
  }

  if (!vidhi) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-zinc-500 font-bold">पूजा विधि नहीं मिली।</p>
        <button
          onClick={() => router.push("/pooja-vidhi")}
          className="bg-orange-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs mt-4"
        >
          सभी पूजा विधियां देखें
        </button>
      </div>
    );
  }

  const handleAddAllToCart = () => {
    if (vidhi.items && vidhi.items.length > 0) {
      vidhi.items.forEach((item) => {
        addToCart(item.product, item.quantity || 1);
      });
      showToast(`✓ ${vidhi.title} की सभी सामग्रियां कार्ट में जोड़ दी गईं!`);
    }
  };

  const steps = vidhi.procedure
    .split(/\d+\.\s*/)
    .map((s) => s.trim())
    .filter(Boolean);

  const itemsTotal = (vidhi.items || []).reduce(
    (sum, it) => sum + it.product.price * (it.quantity || 1),
    0
  );

  return (
    <div className="container mx-auto px-4 md:px-8 py-10 max-w-5xl">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-xs font-bold text-zinc-600 hover:text-orange-600 mb-6 bg-white border border-orange-200 px-4 py-2 rounded-xl shadow-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>पूजा विधि सूची पर वापस जाएं</span>
      </button>

      {/* Main Banner Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] border border-orange-200 shadow-xl overflow-hidden mb-10"
      >
        <div className="relative aspect-[21/9] bg-zinc-950 overflow-hidden">
          <img
            src={vidhi.imageUrl || "/havan_set.jpeg"}
            alt={vidhi.title}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <span className="text-xs font-bold bg-orange-600 px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
              शास्त्रोक्त विधि
            </span>
            <h1 className="text-2xl md:text-4xl font-black">{vidhi.title}</h1>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Step-by-Step Procedure (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-lg font-black text-zinc-900 mb-4 flex items-center gap-2">
                <ListOrdered className="w-5 h-5 text-orange-600" />
                चरणबद्ध वैदिक पूजन विधि
              </h2>

              <div className="space-y-4">
                {steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-[#FFFDF9] border border-orange-100"
                  >
                    <span className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-600 to-amber-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-md">
                      {idx + 1}
                    </span>
                    <p className="text-xs md:text-sm text-zinc-700 leading-relaxed font-medium">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Devotional Advice */}
            <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200">
              <h3 className="text-xs font-black text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-700" />
                विशेष नियम एवं सावधानियां:
              </h3>
              <p className="text-xs text-amber-950 font-medium leading-relaxed">
                पूजन करते समय मन में शुद्ध सात्विक भाव रखें। सभी सामग्रियां शुद्ध, बिना किसी मिलावट की व मंदिर अभिमंत्रित होनी चाहिए।
              </p>
            </div>
          </div>

          {/* Right: Required Samagri Checklist (1 col) */}
          <div className="bg-[#FFFBF5] rounded-3xl p-6 border border-orange-200 flex flex-col justify-between h-fit space-y-6">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <h3 className="font-black text-sm text-zinc-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-orange-600" />
                  आवश्यक सामग्री सूची
                </h3>
                <span className="text-[11px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full">
                  {vidhi.items?.length || 3} उत्पाद
                </span>
              </div>

              <div className="space-y-3">
                {(vidhi.items || []).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-2 p-2.5 bg-white rounded-xl border border-orange-100 shadow-sm"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-orange-50 shrink-0">
                        <img
                          src={item.product.imageUrl || "/puja_thali.jpeg"}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-xs text-zinc-900 line-clamp-1">
                          {item.product.name}
                        </p>
                        <p className="text-[10px] text-zinc-500">मात्रा: {item.quantity} पैक</p>
                      </div>
                    </div>
                    <span className="font-black text-xs text-orange-600 shrink-0">
                      ₹{item.product.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-orange-200 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-zinc-600">कुल सामग्री मूल्य:</span>
                <span className="font-black text-base text-orange-600">
                  ₹{itemsTotal || 899}
                </span>
              </div>

              <button
                onClick={handleAddAllToCart}
                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-lg shadow-orange-600/20 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                सभी सामग्री 1-क्लिक में खरीदें
              </button>

              <Link
                href="/pandits"
                className="w-full bg-white hover:bg-orange-50 border border-orange-300 text-orange-700 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                इस पूजा के लिए पंडित जी बुक करें
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
