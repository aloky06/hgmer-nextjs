"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Sun,
  Moon,
  Calendar,
  Sparkles,
  Clock,
  Compass,
  Flame,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { fetchPanchangs, PanchangData } from "@/lib/api";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function PanchangPage() {
  const { t } = useLanguage();
  const [panchangList, setPanchangList] = useState<PanchangData[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPanchangs().then((data) => {
      setPanchangList(data);
      setLoading(false);
    });
  }, []);

  const current = panchangList[0] || {
    id: 1,
    date: selectedDate,
    tithi: "शुक्ल पक्ष द्वादशी (तिथी समाप्ति रात्रि 09:45)",
    nakshatra: "श्रवण नक्षत्र (उपरांत धनिष्ठा)",
    sunrise: "06:04 AM",
    sunset: "06:34 PM",
    details:
      "आज का दिन अत्यंत शुभ है। भगवान श्री हरि विष्णु एवं माता महालक्ष्मी की आराधना फलदायी है। आज के दिन सत्यनारायण कथा व दीपक दान से घर में सुख-समृद्धि आती है। अभिजित मुहूर्त: 11:54 AM - 12:44 PM। राहुकाल: 04:30 PM - 06:00 PM।",
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-10 max-w-5xl">
      {/* Top Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#FFF5E6] via-white to-[#FFF0D9] border-2 border-orange-200 rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-orange-950/5 text-center relative overflow-hidden mb-10"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/30">
          <Sun className="w-8 h-8 animate-spin-slow" />
        </div>

        <span className="text-xs font-black uppercase tracking-widest text-orange-600 bg-orange-100/80 px-4 py-1.5 rounded-full inline-block mb-3">
          दैनिक वैदिक पंचांग (Backend Live)
        </span>

        <h1 className="text-3xl md:text-5xl font-black text-zinc-900 tracking-tight mb-3">
          आज का <span className="font-light italic text-orange-600">पंचांग एवं शुभ मुहूर्त</span>
        </h1>

        <p className="text-xs md:text-sm text-zinc-600 max-w-lg mx-auto mb-6">
          दैनिक तिथि, नक्षत्र, सूर्योदय, सूर्यास्त, राहुकाल एवं चौघड़िया मुहूर्त की सटीक वैदिक गणना।
        </p>

        {/* Date Selector */}
        <div className="inline-flex items-center gap-3 bg-white border border-orange-200 px-5 py-2.5 rounded-2xl shadow-sm">
          <Calendar className="w-4 h-4 text-orange-600" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="text-xs md:text-sm font-bold text-zinc-800 bg-transparent focus:outline-none cursor-pointer"
          />
        </div>
      </motion.div>

      {/* Main Panchang Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Tithi & Nakshatra */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-orange-100 shadow-md flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Compass className="w-4 h-4 text-orange-600" />
              तिथि एवं नक्षत्र
            </h3>

            <div className="space-y-4">
              <div className="bg-[#FFFDF9] p-4 rounded-2xl border border-orange-100">
                <span className="text-xs text-zinc-500 font-semibold block">तिथि (Tithi)</span>
                <span className="text-lg font-black text-zinc-900 mt-1 block">
                  {current.tithi || "शुक्ल पक्ष द्वादशी"}
                </span>
              </div>

              <div className="bg-[#FFFDF9] p-4 rounded-2xl border border-orange-100">
                <span className="text-xs text-zinc-500 font-semibold block">नक्षत्र (Nakshatra)</span>
                <span className="text-lg font-black text-zinc-900 mt-1 block">
                  {current.nakshatra || "श्रवण नक्षत्र"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sunrise & Sunset */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-orange-100 shadow-md flex flex-col justify-between">
          <h3 className="text-sm font-black text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-600" />
            सूर्योदय एवं सूर्यास्त
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-2xl border border-amber-200 text-center">
              <Sun className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <span className="text-xs text-zinc-500 font-semibold block">सूर्योदय (Sunrise)</span>
              <span className="text-xl font-black text-zinc-900 mt-1 block">
                {current.sunrise || "06:04 AM"}
              </span>
            </div>

            <div className="bg-gradient-to-br from-rose-50 to-orange-50 p-5 rounded-2xl border border-rose-200 text-center">
              <Moon className="w-8 h-8 text-rose-500 mx-auto mb-2" />
              <span className="text-xs text-zinc-500 font-semibold block">सूर्यास्त (Sunset)</span>
              <span className="text-xl font-black text-zinc-900 mt-1 block">
                {current.sunset || "06:34 PM"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Auspicious Guidance */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-orange-100 shadow-md mb-12">
        <h3 className="text-base font-black text-zinc-900 mb-3 flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-600" />
          आज का आध्यात्मिक महात्म्य व पूजन सलाह
        </h3>
        <p className="text-xs md:text-sm text-zinc-700 leading-relaxed font-medium">
          {current.details}
        </p>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-2xl font-black mb-1">शुभ मुहूर्त में पूजा संपन्न कराएं</h3>
          <p className="text-xs md:text-sm text-orange-100">
            शास्त्रोक्त विधि से पूजन हेतु विद्वान पंडित जी बुक करें एवं शुद्ध सामग्री घर मंगवाएं।
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/shop"
            className="bg-white text-orange-700 font-bold px-6 py-3 rounded-xl text-xs hover:bg-orange-50 transition-colors shadow-md"
          >
            पूजा सामग्री खरीदें
          </Link>
          <Link
            href="/pandits"
            className="bg-zinc-900 text-white font-bold px-6 py-3 rounded-xl text-xs hover:bg-zinc-800 transition-colors shadow-md"
          >
            पंडित जी बुक करें
          </Link>
        </div>
      </div>
    </div>
  );
}
