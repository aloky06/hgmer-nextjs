"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Star,
  ShieldCheck,
  PhoneCall,
  CalendarCheck,
  CheckCircle,
  MapPin,
  Languages,
  Sparkles,
} from "lucide-react";
import { PanditProfile, fetchPandits } from "@/lib/api";
import Link from "next/link";

export default function ServicesSection() {
  const [pandits, setPandits] = useState<PanditProfile[]>([]);

  useEffect(() => {
    fetchPandits().then((data) => {
      if (data && data.length > 0) {
        setPandits(data);
      }
    });
  }, []);

  return (
    <section id="pandits-section" className="py-20 bg-gradient-to-b from-[#FFFDF9] to-[#FFF6EB] relative">
      <div className="container mx-auto px-4 md:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-3">
            <User className="w-4 h-4 text-orange-600" />
            <span>सत्यापित वैदिक ब्राह्मण</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-zinc-900 tracking-tight">
            विद्वान पंडित जी <span className="font-light italic text-orange-600">बुकिंग</span>
          </h2>
          <p className="text-xs md:text-sm text-zinc-600 mt-3 font-medium">
            काशी, हरिद्वार, अयोध्या व दिल्ली के गुरुकुल प्रशिक्षित विद्वान पंडित जी द्वारा घर, मंदिर या ऑनलाइन पूजा संपन्न कराएं
          </p>
        </div>

        {/* Pandit Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {pandits.map((pandit, idx) => (
            <motion.div
              key={pandit.id || idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="bg-white rounded-3xl p-6 border border-orange-200 shadow-xl shadow-orange-950/5 hover:shadow-2xl hover:shadow-orange-900/15 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Header Profile Photo & Rating */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-orange-50 border-2 border-orange-300 shrink-0">
                    <img
                      src={pandit.photoUrl || "/pandi_ji.jpeg"}
                      alt={pandit.user?.name || "Pandit Ji"}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md w-fit mb-1">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{pandit.rating} / 5.0</span>
                    </div>
                    <h3 className="font-black text-base text-zinc-900">
                      {pandit.user?.name || "आचार्य पंडित जी"}
                    </h3>
                    <p className="text-xs text-orange-700 font-semibold">
                      {pandit.experience} वर्ष का वैदिक अनुभव
                    </p>
                  </div>
                </div>

                {/* Location & Languages */}
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

                {/* Specializations */}
                <div className="mb-6">
                  <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                    प्रमुख पूजा एवं अनुष्ठान:
                  </p>
                  <p className="text-xs text-zinc-700 font-medium leading-relaxed bg-[#FFFDF9] p-2.5 rounded-xl border border-orange-100">
                    {pandit.specializations || "सत्यनारायण कथा, गृह प्रवेश, रुद्राभिषेक, महामृत्युंजय जाप"}
                  </p>
                </div>
              </div>

              {/* Price & Booking Button */}
              <div className="pt-4 border-t border-orange-100 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-zinc-500 font-bold block">दक्षिणा शुल्क</span>
                  <span className="text-lg font-black text-orange-600">
                    ₹{pandit.price || 2500}
                  </span>
                </div>

                <Link
                  href="/pandits"
                  className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-orange-600/20 flex items-center gap-1.5"
                >
                  <CalendarCheck className="w-3.5 h-3.5" />
                  पंडित जी बुक करें
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Banner Helpline */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 md:p-8 border border-orange-200 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-base text-zinc-900">
                क्या आप विशेष अनुष्ठान या कुंडली परामर्श चाहते हैं?
              </h4>
              <p className="text-xs text-zinc-600">
                हमारे वरिष्ठ ज्योतिष व वैदिक पुरोहितों से निःशुल्क सलाह प्राप्त करें।
              </p>
            </div>
          </div>
          <a
            href="tel:+919876543210"
            className="bg-zinc-900 hover:bg-orange-600 text-white text-xs md:text-sm font-bold px-6 py-3 rounded-xl transition-colors whitespace-nowrap"
          >
            कॉल करें: 98765-43210
          </a>
        </div>
      </div>
    </section>
  );
}
