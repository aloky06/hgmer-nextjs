"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Star,
  ShieldCheck,
  CalendarCheck,
  Languages,
  Award,
} from "lucide-react";
import { fetchPandits, PanditProfile } from "@/lib/api";

export default function PanditsListingPage() {
  const [pandits, setPandits] = useState<PanditProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState("");

  useEffect(() => {
    loadPandits();
  }, []);

  const loadPandits = async (city?: string) => {
    setLoading(true);
    try {
      const data = await fetchPandits(city);
      setPandits(data);
    } catch (error) {
      console.error("Failed to fetch pandits", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadPandits(searchCity);
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-10 max-w-6xl">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#3B1917] via-[#5C231C] to-[#2A0E0B] text-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden text-center mb-10 border border-orange-800/40"
      >
        <div className="w-16 h-16 rounded-3xl bg-orange-500/20 text-amber-300 flex items-center justify-center mx-auto mb-4 border border-orange-400/30">
          <Award className="w-8 h-8" />
        </div>

        <span className="text-xs font-black uppercase tracking-widest text-orange-300 bg-orange-950/60 px-4 py-1.5 rounded-full inline-block mb-3 border border-orange-500/30">
          सत्यापित एवं विद्वान वैदिक पुरोहित (Backend Live)
        </span>

        <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3">
          अपनी पूजा के लिए <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-300">विद्वान पंडित जी बुक करें</span>
        </h1>

        <p className="text-xs md:text-sm text-orange-200/80 max-w-xl mx-auto mb-6">
          सत्यनारायण कथा, गृह प्रवेश, रुद्राभिषेक, विवाह व अनुष्ठान हेतु अनुभवी पंडित जी घर पर प्राप्त करें।
        </p>

        {/* City Search */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto relative flex items-center">
          <input
            type="text"
            placeholder="शहर का नाम खोजें (उदा. वाराणसी, दिल्ली, लखनऊ)..."
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            className="w-full bg-white text-zinc-800 rounded-full pl-10 pr-24 py-3 text-xs md:text-sm focus:outline-none shadow-lg"
          />
          <MapPin className="w-4 h-4 text-orange-600 absolute left-3.5" />
          <button
            type="submit"
            className="absolute right-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold px-4 py-2 rounded-full text-xs transition-colors"
          >
            खोजें
          </button>
        </form>
      </motion.div>

      {/* Pandits Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-80 rounded-3xl bg-zinc-100 animate-pulse" />
          ))}
        </div>
      ) : pandits.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-orange-100 p-8 shadow-sm">
          <p className="text-sm font-bold text-zinc-700 mb-2">इस शहर में कोई पंडित जी उपलब्ध नहीं हैं।</p>
          <button
            onClick={() => {
              setSearchCity("");
              loadPandits();
            }}
            className="bg-orange-600 text-white font-bold px-5 py-2 rounded-xl text-xs"
          >
            सभी पंडित जी देखें
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pandits.map((pandit) => (
            <div
              key={pandit.id}
              className="bg-white rounded-3xl p-6 border border-orange-200 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-orange-50 border-2 border-orange-300 shrink-0">
                    <img
                      src={pandit.photoUrl || "/pandi_ji.jpeg"}
                      alt={pandit.user?.name || "Pandit Ji"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-xs text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md w-fit mb-1">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{pandit.rating || 4.9}</span>
                    </div>
                    <h3 className="font-black text-base text-zinc-900">
                      {pandit.user?.name || "आचार्य पंडित जी"}
                    </h3>
                    <p className="text-xs text-orange-700 font-semibold">
                      {pandit.experience} वर्ष का वैदिक अनुभव
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mb-4 text-xs text-zinc-600 border-t border-b border-orange-100 py-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-orange-600" />
                    <span>सेवा क्षेत्र: {pandit.city}</span>
                  </div>
                  {pandit.languages && (
                    <div className="flex items-center gap-2">
                      <Languages className="w-3.5 h-3.5 text-orange-600" />
                      <span>भाषाएँ: {pandit.languages}</span>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                    प्रमुख अनुष्ठान:
                  </p>
                  <p className="text-xs text-zinc-700 font-medium leading-relaxed bg-[#FFFDF9] p-2.5 rounded-xl border border-orange-100">
                    {pandit.specializations || "सत्यनारायण कथा, गृह प्रवेश, रुद्राभिषेक, महामृत्युंजय जाप"}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-orange-100 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-zinc-500 font-bold block">दक्षिणा शुल्क</span>
                  <span className="text-lg font-black text-orange-600">
                    ₹{pandit.price || 3100}
                  </span>
                </div>

                <Link
                  href={`/pandits/${pandit.id}`}
                  className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-orange-600/20 flex items-center gap-1.5"
                >
                  <CalendarCheck className="w-3.5 h-3.5" />
                  बुकिंग करें
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
