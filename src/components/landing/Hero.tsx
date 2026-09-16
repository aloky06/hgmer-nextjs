"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  User,
  Truck,
  ShoppingBag,
  Star,
  Users,
  Sparkles,
  Flame,
} from "lucide-react";
import { Banner, fetchBanners } from "@/lib/api";

export default function Hero() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchBanners().then((data) => {
      if (data && data.length > 0) {
        setBanners(data);
      }
    });
  }, []);

  // Auto carousel slide
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const currentBanner = banners[currentIndex] || {
    id: 1,
    title: "100% शुद्ध एवं प्रामाणिक पूजा सामग्री",
    subtitle: "हर पूजा के लिए संपूर्ण वैदिक सामग्री, गंगाजल व सुगंधित धूप - सीधे आपके द्वार",
    imageUrl: "/hero-banner.jpeg",
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  return (
    <section className="relative min-h-[90vh] md:min-h-[100dvh] flex flex-col justify-center overflow-hidden pt-32 pb-24 md:pb-36 bg-zinc-950">
      {/* Background Image Carousel with Fade Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentBanner.id || currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.85, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 z-0"
        >
          <img
            src={currentBanner.imageUrl || "/hero-banner.jpeg"}
            alt={currentBanner.title}
            className="w-full h-full object-cover"
          />
          {/* Multi-gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-black/50" />
        </motion.div>
      </AnimatePresence>

      <div className="container mx-auto px-4 md:px-8 relative z-10 w-full">
        <div className="max-w-3xl text-white">
          {/* Top Devotional Pill */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-orange-600/30 border border-orange-500/40 backdrop-blur-md px-4 py-1.5 rounded-full text-orange-300 text-xs md:text-sm font-bold mb-6"
          >
            <Flame className="w-4 h-4 text-orange-400" />
            <span>भारत का सबसे विश्वसनीय आध्यात्मिक स्टोर</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            key={`title-${currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 tracking-tight leading-tight text-white drop-shadow-md"
          >
            हर <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500">घर मंदिर</span>
          </motion.h1>

          <motion.p
            key={`subtitle-${currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-base sm:text-xl md:text-2xl text-zinc-200 mb-8 font-medium leading-relaxed max-w-2xl drop-shadow-sm"
          >
            {currentBanner.subtitle || "पवित्र सामग्री, शुद्ध सेवा, घर बैठे प्राप्त करें"}
          </motion.p>

          {/* Features Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
              <ShieldCheck className="w-8 h-8 text-orange-400 shrink-0 stroke-[1.5]" />
              <div>
                <h3 className="font-bold text-sm text-white">100% शुद्ध सामग्री</h3>
                <p className="text-[11px] text-zinc-300">मंदिर अभिमंत्रित एवं प्रमाणित</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
              <User className="w-8 h-8 text-orange-400 shrink-0 stroke-[1.5]" />
              <div>
                <h3 className="font-bold text-sm text-white">विद्वान पंडित जी</h3>
                <p className="text-[11px] text-zinc-300">घर पर पूजा एवं अनुष्ठान</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
              <Truck className="w-8 h-8 text-orange-400 shrink-0 stroke-[1.5]" />
              <div>
                <h3 className="font-bold text-sm text-white">एक्सप्रेस डिलीवरी</h3>
                <p className="text-[11px] text-zinc-300">पूरे भारत में सुरक्षित पैकिंग</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 mb-10">
            <a
              href="#products-section"
              className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white px-8 py-4 rounded-2xl font-bold text-sm md:text-base transition-all flex items-center justify-center gap-2 shadow-xl shadow-orange-600/30 hover:scale-105"
            >
              <ShoppingBag className="w-5 h-5" />
              पूजा सामग्री खरीदें
            </a>

            <a
              href="#kits-section"
              className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/30 px-6 py-4 rounded-2xl font-bold text-sm md:text-base transition-all flex items-center justify-center gap-2 hover:scale-105"
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
              सम्पूर्ण पूजा किट
            </a>

            <a
              href="#pandits-section"
              className="bg-white hover:bg-zinc-100 text-zinc-900 px-6 py-4 rounded-2xl font-bold text-sm md:text-base transition-all flex items-center justify-center gap-2 hover:scale-105 shadow-md"
            >
              <User className="w-5 h-5 text-orange-600" />
              पंडित जी बुक करें
            </a>
          </div>

          {/* Social Proof Badges */}
          <div className="flex flex-wrap items-center gap-6 text-xs md:text-sm font-semibold">
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
              <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-blue-600 font-bold text-xs">
                G
              </div>
              <span className="text-amber-400 font-black flex items-center gap-0.5">
                4.8 <Star className="w-3.5 h-3.5 fill-current" />
              </span>
              <span className="text-zinc-300">गूगल रेटिंग</span>
            </div>

            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
              <Users className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 font-black">10L+</span>
              <span className="text-zinc-300">संतुष्ट भक्त</span>
            </div>

            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-zinc-300">सुरक्षित भुगतान व आसान वापसी</span>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 border border-white/20 text-white flex items-center justify-center hover:bg-orange-600 transition-colors z-20 backdrop-blur-sm"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 border border-white/20 text-white flex items-center justify-center hover:bg-orange-600 transition-colors z-20 backdrop-blur-sm"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2.5 rounded-full transition-all ${
                  currentIndex === idx ? "w-8 bg-orange-500" : "w-2.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}

      {/* Bottom fade out to next section */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#FFFDF9] to-transparent z-10 pointer-events-none" />
    </section>
  );
}
