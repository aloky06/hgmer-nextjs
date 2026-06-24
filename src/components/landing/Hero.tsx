"use client";

import { motion } from "framer-motion";
import { ChevronRight, ShieldCheck, User, Truck, ShoppingBag, Star, Users, CheckCircle } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden pt-32 pb-40 md:pb-48">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 bg-zinc-950">
        <img
          src="/hero-banner.jpeg"
          alt="Mandir Setup"
          className="w-full h-full object-cover opacity-80"
        />
        {/* Left side dark gradient to make text readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl text-white"
        >
          <h1 className="text-5xl sm:text-6xl md:text-[5.5rem] font-bold mb-4 tracking-tight leading-tight">
            हर <span className="text-[#F97316]">घर</span> मंदिर
          </h1>
          <p className="text-lg md:text-2xl text-zinc-200 mb-10 font-medium">
            पवित्र सामग्री, शुद्ध सेवा, घर बैठे प्राप्त करें
          </p>

          {/* Features Row - No background, just text and icons */}
          <div className="flex flex-col sm:flex-row gap-6 md:gap-10 mb-10">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-8 h-8 text-[#F97316] stroke-[1.5]" />
              <div>
                <h3 className="font-semibold text-[15px] text-white">शुद्ध पूजा सामग्री</h3>
                <p className="text-xs text-zinc-400 mt-0.5">100% असली और प्रमाणित</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="w-8 h-8 text-[#F97316] stroke-[1.5]" />
              <div>
                <h3 className="font-semibold text-[15px] text-white">पंडित जी बुकिंग</h3>
                <p className="text-xs text-zinc-400 mt-0.5">घर बैठे पूजा सेवा</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Truck className="w-8 h-8 text-[#F97316] stroke-[1.5]" />
              <div>
                <h3 className="font-semibold text-[15px] text-white">तेज़ डिलीवरी</h3>
                <p className="text-xs text-zinc-400 mt-0.5">पूरे भारत में डिलीवरी</p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <button className="bg-[#F97316] hover:bg-[#EA580C] text-white px-8 py-3.5 rounded-lg font-semibold text-[15px] transition-colors flex items-center justify-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              पूजा सामग्री खरीदें
            </button>
            <button className="bg-white hover:bg-zinc-100 text-zinc-900 px-8 py-3.5 rounded-lg font-semibold text-[15px] transition-colors flex items-center justify-center gap-2">
              <User className="w-5 h-5" />
              पंडित जी बुक करें
            </button>
          </div>

          {/* Bottom Trust Markers */}
          <div className="flex flex-wrap items-center gap-6 md:gap-10 text-sm font-medium">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-blue-600 font-bold text-xs">G</div>
              <span className="text-[#FBBF24]">4.8 <Star className="w-3 h-3 inline fill-current" /></span>
              <span className="text-zinc-300">गूगल रेटिंग</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#FBBF24]" />
              <span className="text-[#FBBF24]">10L+</span>
              <span className="text-zinc-300">संतुष्ट ग्राहक</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#FBBF24]" />
              <span className="text-zinc-300">सुरक्षित भुगतान</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Carousel Dots */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        <div className="w-2 h-2 rounded-full bg-white"></div>
        <div className="w-2 h-2 rounded-full bg-white/50"></div>
        <div className="w-2 h-2 rounded-full bg-[#F97316]"></div>
        <div className="w-2 h-2 rounded-full bg-white/50"></div>
      </div>

      {/* Right Arrow Navigation */}
      <button className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 border border-white/10 text-white flex items-center justify-center hover:bg-black/60 transition-colors z-20 backdrop-blur-sm">
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Bottom fade out to next section */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#FFFDF9] to-transparent z-10 pointer-events-none"></div>
    </section>
  );
}
