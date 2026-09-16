"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Star,
  Flame,
} from "lucide-react";
import { fetchHoroscopes, HoroscopeData } from "@/lib/api";
import Link from "next/link";

export default function HoroscopePage() {
  const [horoscopes, setHoroscopes] = useState<HoroscopeData[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHoroscopes().then((data) => {
      setHoroscopes(data);
      setLoading(false);
    });
  }, []);

  const currentSign = horoscopes[selectedIndex] || {
    id: 1,
    sign: "मेष (Aries)",
    prediction: "आज का दिन आत्मविश्वास व ऊर्जा से भरा रहेगा। कार्यक्षेत्र में नए अवसर मिलेंगे। व्यापार में आर्थिक लाभ के योग हैं। पारिवारिक जीवन सुखद रहेगा। उपाय: हनुमान चालीसा का पाठ करें।",
    date: new Date().toISOString(),
  };

  const getSignIcon = (signName: string) => {
    if (signName.includes("मेष") || signName.includes("Aries")) return "♈";
    if (signName.includes("वृषभ") || signName.includes("Taurus")) return "♉";
    if (signName.includes("मिथुन") || signName.includes("Gemini")) return "♊";
    if (signName.includes("कर्क") || signName.includes("Cancer")) return "♋";
    if (signName.includes("सिंह") || signName.includes("Leo")) return "♌";
    if (signName.includes("कन्या") || signName.includes("Virgo")) return "♍";
    if (signName.includes("तुला") || signName.includes("Libra")) return "♎";
    if (signName.includes("वृश्चिक") || signName.includes("Scorpio")) return "♏";
    if (signName.includes("धनु") || signName.includes("Sagittarius")) return "♐";
    if (signName.includes("मकर") || signName.includes("Capricorn")) return "♑";
    if (signName.includes("कुम्भ") || signName.includes("Aquarius")) return "♒";
    return "♓";
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-10 max-w-5xl">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#4A154B] via-[#2E1065] to-[#1E1B4B] text-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden text-center mb-10 border border-purple-800/40"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 rounded-3xl bg-purple-500/30 backdrop-blur-md border border-purple-400/40 text-amber-300 flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Sparkles className="w-8 h-8" />
        </div>

        <span className="text-xs font-black uppercase tracking-widest text-purple-200 bg-purple-900/60 px-4 py-1.5 rounded-full inline-block mb-3 border border-purple-400/30">
          वैदिक ज्योतिष राशिफल (Backend Live)
        </span>

        <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3">
          दैनिक <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-purple-300">राशिफल एवं ग्रह गोचर</span>
        </h1>

        <p className="text-xs md:text-sm text-purple-200/80 max-w-lg mx-auto">
          अपनी राशि चुनें और जानें आज के ग्रह-नक्षत्रों का आपके जीवन, करियर व स्वास्थ्य पर प्रभाव।
        </p>
      </motion.div>

      {/* 12 Zodiac Pills Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-10">
        {horoscopes.map((h, idx) => (
          <button
            key={h.id || idx}
            onClick={() => setSelectedIndex(idx)}
            className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
              selectedIndex === idx
                ? "bg-gradient-to-br from-purple-700 to-indigo-800 text-white border-purple-400 shadow-xl shadow-purple-900/20 scale-105"
                : "bg-white text-zinc-700 border-orange-100 hover:border-purple-300 hover:bg-purple-50/50"
            }`}
          >
            <span className="text-2xl">{getSignIcon(h.sign)}</span>
            <span className="text-xs font-black leading-tight">
              {h.sign.split(" ")[0]}
            </span>
          </button>
        ))}
      </div>

      {/* Detailed Horoscope Card */}
      <motion.div
        key={currentSign.id || selectedIndex}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-[2.5rem] p-6 md:p-10 border border-orange-200 shadow-xl mb-10"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-orange-100 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-purple-100 to-indigo-100 border border-purple-200 text-purple-900 flex items-center justify-center text-3xl font-black shadow-inner">
              {getSignIcon(currentSign.sign)}
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-zinc-900">
                {currentSign.sign}
              </h2>
              <div className="flex items-center gap-3 text-xs text-zinc-500 font-semibold mt-1">
                <span>वैदिक दैनिक राशिफल</span>
              </div>
            </div>
          </div>
        </div>

        {/* Prediction Content */}
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-black text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Star className="w-4 h-4 text-purple-600" />
              आज का भविष्यफल
            </h3>
            <p className="text-sm md:text-base text-zinc-700 leading-relaxed font-medium bg-[#FFFDF9] p-5 rounded-2xl border border-orange-100">
              {currentSign.prediction}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Astrology Consultation CTA */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-2xl font-black mb-1">व्यक्तिगत कुंडली एवं ग्रह शांति परामर्श</h3>
          <p className="text-xs md:text-sm text-purple-200">
            विद्वान ज्योतिषाचार्यों द्वारा अपनी जन्म कुंडली का विस्तृत विश्लेषण एवं सटीक उपाय जानें।
          </p>
        </div>
        <Link
          href="/consultancy"
          className="bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black px-6 py-3.5 rounded-xl text-xs transition-colors shadow-lg whitespace-nowrap"
        >
          ज्योतिष परामर्श बुक करें →
        </Link>
      </div>
    </div>
  );
}
