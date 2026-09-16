"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  PhoneCall,
  Sparkles,
  Menu,
  X,
  Globe,
  CalendarDays,
  Flame,
  BookOpen,
  Package,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useLanguage, LanguageCode } from "@/context/LanguageContext";

export default function Header() {
  const {
    cartCount,
    cartTotal,
    setIsCartOpen,
    wishlist,
    searchQuery,
    setSearchQuery,
    user,
    openAuthModal,
  } = useCart();

  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const navLinks = [
    { name: t.home, href: "/" },
    { name: t.shop, href: "/shop" },
    { name: t.panchang, href: "/panchang" },
    { name: t.horoscope, href: "/horoscope" },
    { name: t.poojaVidhi, href: "/pooja-vidhi" },
    { name: t.pandits, href: "/pandits" },
    { name: t.consultancy, href: "/consultancy" },
    { name: t.orders, href: "/orders" },
  ];

  const languagesList: { code: LanguageCode; label: string; native: string }[] = [
    { code: "hi", label: "Hindi", native: "हिन्दी" },
    { code: "en", label: "English", native: "English" },
    { code: "mr", label: "Marathi", native: "मराठी" },
    { code: "gu", label: "Gujarati", native: "ગુજરાતી" },
    { code: "bn", label: "Bengali", native: "বাংলা" },
    { code: "ta", label: "Tamil", native: "தமிழ்" },
    { code: "te", label: "Telugu", native: "తెలుగు" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-[#3B1917] via-[#5C231C] to-[#3B1917] text-white text-[11px] md:text-xs py-2 px-4 border-b border-orange-900/30">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-1">
          <div className="flex items-center gap-2 font-medium">
            <span className="flex items-center gap-1 text-amber-300 font-bold bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30">
              <Sparkles className="w-3 h-3 text-amber-400" />
              विशेष छूट
            </span>
            <span>{t.freeDelivery} | कूपन कोड: <strong>SHUDDH10</strong> (10% छूट)</span>
          </div>

          <div className="flex items-center gap-4 text-orange-200/90 hidden sm:flex">
            <Link
              href="/panchang"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <CalendarDays className="w-3.5 h-3.5 text-amber-300" />
              <span>आज का पंचांग व शुभ मुहूर्त →</span>
            </Link>
            <span className="text-orange-400">•</span>
            <a
              href="tel:+919876543210"
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <PhoneCall className="w-3 h-3 text-amber-300" />
              <span>{t.panditHelpline}: 98765-43210</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-white/95 backdrop-blur-md shadow-sm border-b border-orange-100">
        <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <img
              src="/hgmr.png"
              alt="Har Ghar Mandir Logo"
              className="h-12 md:h-14 w-auto object-contain group-hover:scale-105 transition-transform"
            />
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-2 relative">
            <div className="relative w-full">
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FFFDF9] border border-orange-200 rounded-full pl-10 pr-10 py-2.5 text-xs md:text-sm font-medium focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200/50 shadow-inner transition-all text-zinc-800 placeholder:text-zinc-400"
              />
              <Search className="w-4 h-4 text-orange-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="w-5 h-5 rounded-full bg-zinc-200 hover:bg-zinc-300 text-zinc-600 text-xs flex items-center justify-center absolute right-3 top-1/2 -translate-y-1/2"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-5">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-[13px] font-bold transition-colors relative group py-2 ${
                    isActive ? "text-orange-600 font-black" : "text-zinc-700 hover:text-orange-600"
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-600 rounded-full" />
                  )}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-600 rounded-full transition-all group-hover:w-full" />
                </Link>
              );
            })}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-orange-200 hover:border-orange-400 text-xs font-bold text-zinc-700 bg-[#FFFDF9] hover:bg-orange-50 transition-colors"
                title="भाषा बदलें (Change Language)"
              >
                <Globe className="w-3.5 h-3.5 text-orange-600" />
                <span className="uppercase">{language}</span>
              </button>

              <AnimatePresence>
                {langDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-orange-100 py-2 z-50"
                  >
                    <div className="px-3 py-1 text-[11px] font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-100 mb-1">
                      {t.chooseLanguage}
                    </div>
                    {languagesList.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-orange-50 transition-colors ${
                          language === lang.code
                            ? "text-orange-600 font-extrabold bg-orange-50/60"
                            : "text-zinc-700 font-semibold"
                        }`}
                      >
                        <span>{lang.native}</span>
                        <span className="text-[10px] text-zinc-400">{lang.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="relative p-2 rounded-full hover:bg-orange-50 text-zinc-700 hover:text-rose-600 transition-colors"
              title={t.wishlist}
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-3.5 md:px-4 py-2 rounded-full shadow-md shadow-orange-600/20 hover:scale-105 transition-all group"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-orange-600 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-black animate-bounce shadow-sm">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-bold text-xs md:text-sm">
                {cartTotal > 0 ? `₹${cartTotal}` : t.cart}
              </span>
            </button>

            {/* User Account / Login Link */}
            {user ? (
              <Link
                href="/account"
                className="p-1.5 rounded-full hover:bg-orange-50 text-zinc-700 hover:text-orange-600 transition-colors flex items-center gap-2"
                title={user.name}
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-orange-300 shadow-sm"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center text-xs font-black shadow-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="hidden md:inline text-xs font-bold text-zinc-800 line-clamp-1 max-w-[90px]">
                  {user.name.split(" ")[0]}
                </span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal("LOGIN")}
                className="p-2 rounded-full hover:bg-orange-50 text-zinc-700 hover:text-orange-600 transition-colors flex items-center gap-1"
                title="लॉगिन करें (Sign In)"
              >
                <User className="w-5 h-5" />
                <span className="hidden md:inline text-xs font-bold text-orange-600">
                  लॉगिन
                </span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-full hover:bg-orange-50 text-zinc-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden px-4 pb-3">
          <div className="relative w-full">
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FFFDF9] border border-orange-200 rounded-full pl-9 pr-8 py-2 text-xs font-medium focus:outline-none focus:border-orange-500 shadow-inner text-zinc-800"
            />
            <Search className="w-4 h-4 text-orange-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="xl:hidden border-t border-orange-100 bg-white px-4 py-4 space-y-2.5 shadow-lg"
            >
              {navLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-bold text-zinc-800 hover:text-orange-600 py-1.5 border-b border-orange-50"
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-2 flex items-center justify-between text-xs text-zinc-600">
                {user ? (
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-bold text-orange-600"
                  >
                    मेरा खाता ({user.name})
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAuthModal("LOGIN");
                    }}
                    className="font-bold text-orange-600 hover:underline"
                  >
                    लॉगिन / नया खाता बनाएं →
                  </button>
                )}
                <Link
                  href="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-zinc-500 hover:text-zinc-800"
                >
                  एडमिन पोर्टल
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
