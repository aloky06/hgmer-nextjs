"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Package,
  CalendarCheck,
  MapPin,
  Globe,
  PhoneCall,
  LogOut,
  ShieldCheck,
  ArrowRight,
  Plus,
  Trash2,
  Flame,
  Sparkles,
  ShoppingBag,
  Heart,
  FileText,
  Clock,
  CheckCircle2,
  Compass,
  Bell,
  Check,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useLanguage, LanguageCode } from "@/context/LanguageContext";
import GoogleOAuthButton from "@/components/auth/GoogleOAuthButton";

type TabType = "ORDERS" | "BOOKINGS" | "ADDRESSES" | "CONSULTANCY" | "SETTINGS";

export default function AccountPage() {
  const router = useRouter();
  const { user, logoutUser, savedAddresses, addSavedAddress, orders, wishlist } = useCart();
  const { language, setLanguage } = useLanguage();
  
  const [activeTab, setActiveTab] = useState<TabType>("ORDERS");
  const [newAddress, setNewAddress] = useState("");
  const [addressTitle, setAddressTitle] = useState("घर (Home)");
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [whatsappNotifications, setWhatsappNotifications] = useState(true);

  // If user is not signed in, show a premium devotional login prompt with Google OAuth
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] border border-orange-200 shadow-2xl p-8 md:p-10 text-center space-y-6 relative overflow-hidden"
        >
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-orange-500/30">
            <Flame className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full inline-block border border-orange-200">
              हर घर मंदिर • भक्त पोर्टल
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-zinc-900">
              अपने खाते में प्रवेश करें
            </h1>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              अपने पूजा ऑर्डर्स को ट्रैक करने, पंडित बुकिंग, पंचांग एवं विशेष अनुष्ठान सेवाओं के लिए लॉगिन करें।
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <GoogleOAuthButton
              label="Google के साथ 1-क्लिक में लॉगिन करें"
              onSuccess={() => router.push("/account")}
            />

            <div className="relative flex items-center justify-center my-2">
              <div className="border-t border-zinc-200 w-full" />
              <span className="bg-white px-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest absolute">
                या ईमेल / पासवर्ड से
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/login"
                className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors text-center"
              >
                लॉगिन (Sign In)
              </Link>
              <Link
                href="/register"
                className="bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold py-3 px-4 rounded-xl text-xs border border-orange-200 transition-colors text-center"
              >
                नया खाता (Register)
              </Link>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 flex items-center justify-center gap-2 text-[11px] text-zinc-500 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>100% सुरक्षित एवं प्रामाणिक आध्यात्मिक मंच</span>
          </div>
        </motion.div>
      </div>
    );
  }

  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.trim()) return;
    addSavedAddress(`${addressTitle}: ${newAddress.trim()}`);
    setNewAddress("");
    setShowAddAddress(false);
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-10 max-w-6xl space-y-8">
      {/* Devotional Hero Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#3B1917] via-[#5C231C] to-[#2A0E0B] text-white rounded-[2.5rem] p-6 md:p-10 shadow-2xl border border-orange-800/40 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="absolute right-0 top-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5 relative z-10">
          {user.avatarUrl ? (
            <div className="relative">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-20 h-20 md:w-24 md:h-24 rounded-3xl object-cover shadow-2xl border-2 border-amber-400/80 p-0.5"
              />
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#3B1917] flex items-center justify-center text-white text-[10px]">
                ✓
              </span>
            </div>
          ) : (
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 text-white font-black text-3xl flex items-center justify-center shadow-xl shadow-orange-500/30 border-2 border-amber-400/80">
              {user.name.charAt(0)}
            </div>
          )}

          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl md:text-3xl font-black">{user.name}</h1>
              <span className="text-[10px] font-extrabold text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-500/40 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                सत्यापित श्रद्धालु
              </span>
            </div>
            <p className="text-xs text-orange-200/90 font-medium">{user.email}</p>
            {user.phone && <p className="text-xs text-orange-200/80">{user.phone}</p>}

            <div className="flex flex-wrap gap-2 pt-2 justify-center sm:justify-start">
              <span className="text-[11px] bg-white/10 px-3 py-1 rounded-xl text-orange-100 font-semibold border border-white/10">
                📦 {orders.length} ऑर्डर्स
              </span>
              <span className="text-[11px] bg-white/10 px-3 py-1 rounded-xl text-orange-100 font-semibold border border-white/10">
                ❤️ {wishlist.length} पसंदीदा सामग्री
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <Link
            href="/shop"
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black px-5 py-2.5 rounded-xl text-xs shadow-lg shadow-orange-500/30 transition-all flex items-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>सामग्री खरीदें</span>
          </Link>

          <button
            onClick={logoutUser}
            className="bg-white/10 hover:bg-rose-600 text-white border border-white/20 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>लॉगआउट</span>
          </button>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-orange-200 scrollbar-none">
        {[
          { id: "ORDERS", label: "मेरे ऑर्डर्स", icon: Package, count: orders.length },
          { id: "BOOKINGS", label: "पंडित व पूजा बुकिंग", icon: CalendarCheck, count: 1 },
          { id: "ADDRESSES", label: "सहेजे गए पते", icon: MapPin, count: savedAddresses.length },
          { id: "CONSULTANCY", label: "वैदिक परामर्श व राशिफल", icon: Compass },
          { id: "SETTINGS", label: "भाषा व प्राथमिकताएं", icon: Globe },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black transition-all shrink-0 ${
                isActive
                  ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-600/30"
                  : "bg-white text-zinc-700 hover:bg-orange-50 border border-orange-100"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-orange-600"}`} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                    isActive ? "bg-white/20 text-white" : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Tab Content */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {/* 1. ORDERS TAB */}
            {activeTab === "ORDERS" && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-black text-zinc-900 flex items-center gap-2">
                    <Package className="w-5 h-5 text-orange-600" />
                    पूजा सामग्री ऑर्डर्स ({orders.length})
                  </h2>
                  <Link
                    href="/shop"
                    className="text-xs font-bold text-orange-600 hover:underline"
                  >
                    + नई सामग्री जोड़ें
                  </Link>
                </div>

                {orders.length === 0 ? (
                  <div className="bg-white rounded-3xl p-8 border border-orange-200 text-center space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto">
                      <ShoppingBag className="w-7 h-7" />
                    </div>
                    <h3 className="font-bold text-zinc-900 text-sm">कोई पिछला ऑर्डर नहीं है</h3>
                    <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                      अपने घर के मंदिर हेतु 100% शुद्ध पूजा सामग्री, धूप, दीपक और हवन किट अभी ऑर्डर करें।
                    </p>
                    <Link
                      href="/shop"
                      className="inline-block bg-orange-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md shadow-orange-600/30"
                    >
                      पूजा सामग्री शॉप देखें
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="bg-white rounded-3xl p-6 border border-orange-200 shadow-sm space-y-4 hover:border-orange-300 transition-colors"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-orange-100">
                          <div>
                            <span className="text-[10px] font-black uppercase text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                              ऑर्डर ID: #{ord.orderNumber}
                            </span>
                            <p className="text-xs text-zinc-500 mt-1">दिनांक: {ord.date}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {ord.status === "DELIVERED"
                                ? "सफलतापूर्वक डिलीवर"
                                : ord.status === "SHIPPED"
                                ? "रास्ते में (Shipped)"
                                : "स्वीकृत (Confirmed)"}
                            </span>
                            <Link
                              href={`/orders/${ord.id}`}
                              className="bg-zinc-900 hover:bg-orange-600 text-white font-bold px-4 py-1.5 rounded-xl text-xs transition-colors"
                            >
                              विवरण देखें
                            </Link>
                          </div>
                        </div>

                        {/* Order Items Preview */}
                        <div className="space-y-2">
                          {ord.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-2.5 bg-[#FFFDF9] rounded-2xl border border-orange-100"
                            >
                              <div className="flex items-center gap-3">
                                {item.product?.imageUrl ? (
                                  <img
                                    src={item.product.imageUrl}
                                    alt={item.product.name}
                                    className="w-10 h-10 rounded-xl object-contain bg-white border border-orange-200 p-0.5"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                                    🪔
                                  </div>
                                )}
                                <div>
                                  <p className="font-bold text-xs text-zinc-900">{item.product?.name || "पूजा सामग्री"}</p>
                                  <p className="text-[11px] text-zinc-500">मात्रा: {item.quantity} पीस</p>
                                </div>
                              </div>
                              <span className="font-black text-xs text-zinc-900">
                                ₹{(item.product?.price || 0) * item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Order Footer */}
                        <div className="flex items-center justify-between pt-2 text-xs">
                          <span className="text-zinc-500 font-medium">
                            भुगतान: <strong>{ord.paymentMethod === "COD" ? "कैश ऑन डिलीवरी" : "ऑनलाइन (UPI/Card)"}</strong>
                          </span>
                          <span className="font-black text-base text-orange-700">
                            कुल: ₹{ord.totalAmount}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* 2. BOOKINGS TAB */}
            {activeTab === "BOOKINGS" && (
              <motion.div
                key="bookings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-black text-zinc-900 flex items-center gap-2">
                    <CalendarCheck className="w-5 h-5 text-orange-600" />
                    अनुष्ठान व पंडित जी बुकिंग
                  </h2>
                  <Link
                    href="/pandits"
                    className="text-xs font-bold text-orange-600 hover:underline"
                  >
                    + पंडित जी बुक करें
                  </Link>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-orange-200 shadow-sm space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-orange-100">
                    <div>
                      <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                        बुकिंग ID: #BK-7892
                      </span>
                      <h3 className="font-black text-sm text-zinc-900 mt-1">
                        सत्यनारायण कथा एवं नवग्रह शांति पूजा
                      </h3>
                      <p className="text-xs text-zinc-500">स्थान: घर पर (Home Pooja)</p>
                    </div>

                    <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      पंडित जी कन्फर्म
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#FFFDF9] p-4 rounded-2xl border border-orange-100">
                    <div>
                      <span className="text-zinc-400 block text-[10px] uppercase font-bold">
                        विद्वान पुरोहित:
                      </span>
                      <p className="font-bold text-zinc-900">पंडित सीताराम शास्त्री (वाराणसी)</p>
                      <p className="text-[11px] text-zinc-500">18+ वर्ष वैदिक अनुभव</p>
                    </div>
                    <div>
                      <span className="text-zinc-400 block text-[10px] uppercase font-bold">
                        शुभ मुहूर्त व समय:
                      </span>
                      <p className="font-bold text-zinc-900">आगामी एकादशी • प्रातः 08:30 बजे</p>
                      <p className="text-[11px] text-emerald-600 font-semibold">सामग्री किट सम्मिलित</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <a
                      href="tel:+919876543210"
                      className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      पंडित जी से संपर्क करें
                    </a>
                    <Link
                      href="/pooja-vidhi"
                      className="bg-zinc-900 text-white font-bold px-4 py-1.5 rounded-xl text-xs hover:bg-orange-600 transition-colors"
                    >
                      पूजा विधि व तैयारी देखें
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3. ADDRESSES TAB */}
            {activeTab === "ADDRESSES" && (
              <motion.div
                key="addresses"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-3xl p-6 border border-orange-200 shadow-sm space-y-5"
              >
                <div className="flex items-center justify-between pb-3 border-b border-orange-100">
                  <h3 className="font-black text-base text-zinc-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-orange-600" />
                    डिलीवरी पते ({savedAddresses.length})
                  </h3>
                  <button
                    onClick={() => setShowAddAddress(!showAddAddress)}
                    className="text-xs font-bold bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-200 px-3.5 py-1.5 rounded-xl flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    नया पता जोड़ें
                  </button>
                </div>

                {showAddAddress && (
                  <form
                    onSubmit={handleAddAddressSubmit}
                    className="space-y-3.5 bg-orange-50/60 p-5 rounded-2xl border border-orange-200"
                  >
                    <h4 className="font-black text-xs text-zinc-900">नया डिलीवरी पता दर्ज करें</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {["घर (Home)", "मंदिर (Temple)", "कार्यालय (Office)"].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setAddressTitle(t)}
                          className={`p-2 rounded-xl text-xs font-bold border transition-colors ${
                            addressTitle === t
                              ? "bg-orange-600 text-white border-orange-600"
                              : "bg-white text-zinc-700 border-zinc-200"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>

                    <textarea
                      required
                      placeholder="मकान/फ्लैट नं, गली, मंदिर के पास, शहर, राज्य, पिनकोड..."
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      className="w-full p-3 text-xs border border-zinc-200 rounded-xl focus:outline-none focus:border-orange-500 bg-white"
                      rows={3}
                    />

                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setShowAddAddress(false)}
                        className="px-4 py-2 text-xs font-bold text-zinc-600 hover:text-zinc-900"
                      >
                        रद्द करें
                      </button>
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold px-5 py-2 text-xs rounded-xl shadow-md shadow-orange-600/30"
                      >
                        सहेजें (Save Address)
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-3">
                  {savedAddresses.map((addr, i) => (
                    <div
                      key={i}
                      className="flex items-start justify-between p-4 bg-[#FFFDF9] rounded-2xl border border-orange-100 text-xs text-zinc-800"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-extrabold text-orange-700 block mb-0.5">
                            पता #{i + 1}
                          </span>
                          <p className="font-medium text-zinc-700 leading-relaxed">{addr}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 4. CONSULTANCY TAB */}
            {activeTab === "CONSULTANCY" && (
              <motion.div
                key="consultancy"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-3xl p-6 border border-orange-200 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-orange-100">
                  <h3 className="font-black text-base text-zinc-900 flex items-center gap-2">
                    <Compass className="w-5 h-5 text-orange-600" />
                    ज्योतिष एवं जन्मकुंडली परामर्श
                  </h3>
                  <Link
                    href="/consultancy"
                    className="text-xs font-bold text-orange-600 hover:underline"
                  >
                    + नया परामर्श लें
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link
                    href="/horoscope"
                    className="p-5 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 hover:border-orange-400 transition-all block group"
                  >
                    <span className="text-2xl mb-2 block">🔮</span>
                    <h4 className="font-black text-sm text-zinc-900 group-hover:text-orange-600">
                      दैनिक एवं वार्षिक राशिफल
                    </h4>
                    <p className="text-[11px] text-zinc-500 mt-1">
                      अपनी राशि अनुसार ग्रहों की चाल और उपाय जानें।
                    </p>
                  </Link>

                  <Link
                    href="/panchang"
                    className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 hover:border-orange-400 transition-all block group"
                  >
                    <span className="text-2xl mb-2 block">📅</span>
                    <h4 className="font-black text-sm text-zinc-900 group-hover:text-orange-600">
                      दैनिक पंचांग व शुभ मुहूर्त
                    </h4>
                    <p className="text-[11px] text-zinc-500 mt-1">
                      आज की तिथि, नक्षत्र, राहुकाल और चौघड़िया देखें।
                    </p>
                  </Link>
                </div>
              </motion.div>
            )}

            {/* 5. SETTINGS TAB */}
            {activeTab === "SETTINGS" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-3xl p-6 border border-orange-200 shadow-sm space-y-6"
              >
                <div>
                  <h3 className="font-black text-base text-zinc-900 flex items-center gap-2 pb-3 border-b border-orange-100">
                    <Globe className="w-5 h-5 text-orange-600" />
                    भाषा प्राथमिकता (Language Preference)
                  </h3>
                  <p className="text-xs text-zinc-500 my-3">
                    अपनी सुविधानुसार हर घर मंदिर की भाषा चुनें:
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { code: "hi", label: "हिन्दी", sub: "Hindi" },
                      { code: "en", label: "English", sub: "English" },
                      { code: "mr", label: "मराठी", sub: "Marathi" },
                      { code: "gu", label: "ગુજરાતી", sub: "Gujarati" },
                    ].map((l) => (
                      <button
                        key={l.code}
                        onClick={() => setLanguage(l.code as LanguageCode)}
                        className={`p-3.5 rounded-2xl text-left border transition-all ${
                          language === l.code
                            ? "bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-600/30"
                            : "bg-[#FFFDF9] text-zinc-800 border-zinc-200 hover:border-orange-300"
                        }`}
                      >
                        <p className="font-black text-xs">{l.label}</p>
                        <p
                          className={`text-[10px] ${
                            language === l.code ? "text-orange-100" : "text-zinc-400"
                          }`}
                        >
                          {l.sub}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-orange-100 space-y-3">
                  <h4 className="font-black text-sm text-zinc-900 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-orange-600" />
                    सूचनाएं एवं अपडेट्स (Notifications)
                  </h4>
                  <div className="flex items-center justify-between p-3.5 bg-orange-50/50 rounded-2xl border border-orange-100">
                    <div>
                      <p className="font-bold text-xs text-zinc-900">
                        WhatsApp ऑर्डर व ट्रैकिंग अपडेट्स
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        ऑर्डर की स्थिति एवं डिलीवरी ट्रैकिंग सीधे WhatsApp पर पाएं
                      </p>
                    </div>
                    <button
                      onClick={() => setWhatsappNotifications(!whatsappNotifications)}
                      className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                        whatsappNotifications ? "bg-emerald-600" : "bg-zinc-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          whatsappNotifications ? "translate-x-6" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right 1 Col: Quick Actions & Devotional Support */}
        <div className="space-y-6">
          {/* Quick Wishlist Card */}
          <div className="bg-white rounded-3xl p-6 border border-orange-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-sm text-zinc-900 flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500" />
                मेरी पसंद (Wishlist)
              </h4>
              <Link href="/wishlist" className="text-xs font-bold text-orange-600 hover:underline">
                देखें ({wishlist.length}) →
              </Link>
            </div>
            <p className="text-xs text-zinc-500">
              आपके द्वारा सहेजी गई सामग्री तुरंत कार्ट में जोड़कर ऑर्डर करें।
            </p>
          </div>

          {/* Quick Support Card */}
          <div className="bg-gradient-to-br from-[#3B1917] to-[#5C231C] text-white rounded-3xl p-6 shadow-xl space-y-3 relative overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-amber-400 border border-orange-400/30 flex items-center justify-center">
              <PhoneCall className="w-5 h-5" />
            </div>
            <h4 className="font-black text-sm text-white">24x7 पंडित व ग्राहक सेवा</h4>
            <p className="text-xs text-orange-200/80 leading-relaxed">
              पूजा मुहूर्त, सामग्री या पुरोहित बुकिंग में किसी भी सहायता हेतु सीधे संपर्क करें।
            </p>
            <a
              href="tel:+919876543210"
              className="block text-center bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-zinc-950 font-black py-2.5 rounded-xl text-xs shadow-lg shadow-orange-500/30 transition-all"
            >
              📞 +91 98765 43210
            </a>
          </div>

          {/* Quick Links Grid */}
          <div className="bg-white rounded-3xl p-6 border border-orange-200 shadow-sm space-y-3">
            <h4 className="font-black text-xs text-zinc-900 uppercase tracking-wider">
              त्वरित सेवाएं (Quick Links)
            </h4>
            <div className="space-y-2 text-xs">
              <Link
                href="/panchang"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-orange-50 font-bold text-zinc-700 hover:text-orange-600 transition-colors"
              >
                <span>📅 आज का पंचांग</span>
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              </Link>
              <Link
                href="/horoscope"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-orange-50 font-bold text-zinc-700 hover:text-orange-600 transition-colors"
              >
                <span>🔮 आज का राशिफल</span>
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              </Link>
              <Link
                href="/pooja-vidhi"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-orange-50 font-bold text-zinc-700 hover:text-orange-600 transition-colors"
              >
                <span>🪔 सम्पूर्ण पूजा विधि</span>
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              </Link>
              <Link
                href="/admin/login"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-orange-50 font-bold text-zinc-700 hover:text-orange-600 transition-colors"
              >
                <span>🛡️ एडमिन व पंडित पोर्टल</span>
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

