"use client";

import { motion } from "framer-motion";
import { Search, ShoppingCart, User } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-orange-100/50"
    >
      <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center shadow-inner overflow-hidden relative">
            <span className="text-orange-700 font-bold text-xl relative z-10 group-hover:scale-110 transition-transform">HM</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl md:text-2xl font-extrabold text-orange-700 leading-tight tracking-tight">Har Ghar Mandir</span>
            <span className="text-[10px] md:text-xs text-orange-800/70 font-medium uppercase tracking-wider">Sanskaron se juda har ghar</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {["होम", "पूजा सामग्री", "पूजा सेवाएँ", "पंडित बुकिंग", "ब्लॉग", "संपर्क"].map((item, i) => (
            <Link
              key={item}
              href="#"
              className={`text-[15px] font-semibold hover:text-orange-600 transition-colors relative group py-2 ${
                i === 0 ? "text-orange-600" : "text-zinc-700"
              }`}
            >
              {item}
              {i === 0 && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-600 rounded-full" />
              )}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-600 rounded-full transition-all group-hover:w-full opacity-0 group-hover:opacity-100" />
            </Link>
          ))}
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-5">
          <button className="text-zinc-600 hover:text-orange-600 transition-all hover:scale-110">
            <Search className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button className="text-zinc-600 hover:text-orange-600 transition-all hover:scale-110 relative group">
            <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
            <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-[10px] w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center font-bold shadow-sm group-hover:animate-bounce">2</span>
          </button>
          <button className="text-zinc-600 hover:text-orange-600 transition-all hover:scale-110">
            <User className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>
    </motion.header>
  );
}
