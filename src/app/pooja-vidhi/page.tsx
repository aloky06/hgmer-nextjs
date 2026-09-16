"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Search,
  Sparkles,
  ArrowRight,
  ShoppingBag,
  ListOrdered,
  Flame,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { PoojaVidhi, fetchPoojaVidhis } from "@/lib/api";
import { useCart } from "@/context/CartContext";

export default function PoojaVidhiDirectoryPage() {
  const [vidhis, setVidhis] = useState<PoojaVidhi[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { addToCart, showToast } = useCart();

  useEffect(() => {
    fetchPoojaVidhis().then((data) => {
      setVidhis(data);
      setLoading(false);
    });
  }, []);

  const filtered = vidhis.filter((v) =>
    v.title.toLowerCase().includes(search.toLowerCase()) ||
    v.procedure.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 md:px-8 py-10 max-w-6xl">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#FFF5E6] via-white to-[#FFF0D9] text-zinc-900 rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-orange-200 text-center mb-10 relative overflow-hidden"
      >
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/30">
          <BookOpen className="w-8 h-8" />
        </div>

        <span className="text-xs font-black uppercase tracking-widest text-orange-600 bg-orange-100 px-4 py-1.5 rounded-full inline-block mb-3">
          शास्त्र सम्मत पूजा विधि मार्गदर्शिका
        </span>

        <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3">
          सम्पूर्ण <span className="font-light italic text-orange-600">पूजा विधियाँ एवं सामग्रियां</span>
        </h1>

        <p className="text-xs md:text-sm text-zinc-600 max-w-lg mx-auto mb-6">
          हर पूजा की शास्त्रोक्त विधि, मंत्र एवं 1-क्लिक में आवश्यक सामग्री किट प्राप्त करें।
        </p>

        {/* Search */}
        <div className="max-w-md mx-auto relative">
          <input
            type="text"
            placeholder="पूजा विधि खोजें (उदा. सत्यनारायण, रुद्राभिषेक, हवन)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-orange-200 rounded-full pl-10 pr-4 py-3 text-xs md:text-sm focus:outline-none focus:border-orange-500 shadow-md"
          />
          <Search className="w-4 h-4 text-orange-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </motion.div>

      {/* Vidhis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filtered.map((vidhi, idx) => (
          <motion.div
            key={vidhi.id || idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05, duration: 0.5 }}
            className="bg-white rounded-3xl overflow-hidden border border-orange-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="relative aspect-[16/9] overflow-hidden bg-orange-50">
                <img
                  src={vidhi.imageUrl || "/havan_set.jpeg"}
                  alt={vidhi.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-3 left-3 text-white text-xs font-bold bg-orange-600/90 backdrop-blur-md px-3 py-1 rounded-full">
                  वैदिक विधि
                </span>
              </div>

              <div className="p-5">
                <h3 className="font-black text-lg text-zinc-900 group-hover:text-orange-600 transition-colors mb-2 leading-snug">
                  {vidhi.title}
                </h3>
                <p className="text-xs text-zinc-600 line-clamp-3 leading-relaxed">
                  {vidhi.procedure}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0">
              <Link
                href={`/pooja-vidhi/${vidhi.id}`}
                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-orange-600/20"
              >
                <span>सम्पूर्ण विधि व सामग्री देखें</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
