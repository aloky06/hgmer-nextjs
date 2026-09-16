"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Sparkles, ArrowRight, Flame } from "lucide-react";
import { Festival, fetchFestivals } from "@/lib/api";
import { useCart } from "@/context/CartContext";

export default function FestivalsSection() {
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const { setSearchQuery } = useCart();

  useEffect(() => {
    fetchFestivals().then((data) => {
      if (data && data.length > 0) {
        setFestivals(data);
      }
    });
  }, []);

  const handleFestivalClick = (festivalName: string) => {
    const keyword = festivalName.split(" ")[0]; // e.g. "गणेश", "नवरात्रि", "दीपावली"
    setSearchQuery(keyword);
    const elem = document.getElementById("products-section");
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="festivals-section" className="py-20 bg-[#3B1917] text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#F97316_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-orange-600/30 border border-orange-500/40 px-4 py-1.5 rounded-full text-xs font-bold text-orange-300 uppercase tracking-widest mb-3">
            <Flame className="w-4 h-4 text-orange-400" />
            <span>आगामी त्यौहार एवं पावन तिथियाँ</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
            त्यौहार विशेष <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">पूजा सामग्री</span>
          </h2>
          <p className="text-xs md:text-sm text-orange-200/80 mt-3 font-medium">
            त्यौहारों के लिए विशेष रूप से तैयार की गई शुद्ध एवं प्रमाणित पूजन सामग्री घर बैठे प्राप्त करें
          </p>
        </div>

        {/* Festival Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {festivals.map((fest, idx) => (
            <motion.div
              key={fest.id || idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="bg-zinc-900/80 rounded-3xl overflow-hidden border border-white/10 hover:border-orange-500/50 transition-all duration-300 group flex flex-col justify-between hover:shadow-2xl hover:shadow-orange-600/20"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={fest.imageUrl || "/pooja_items.jpeg"}
                  alt={fest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                
                {/* Date Badge */}
                <div className="absolute top-3 left-3 bg-orange-600/90 backdrop-blur-md text-white text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{fest.date}</span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-black text-white group-hover:text-orange-400 transition-colors mb-2">
                    {fest.name}
                  </h3>
                  <p className="text-xs text-zinc-400 mb-4">
                    स्थापना, पूजन व हवन हेतु सम्पूर्ण सामग्री किट एवं विशेषज्ञ पंडित जी की बुकिंग उपलब्ध।
                  </p>
                </div>

                <button
                  onClick={() => handleFestivalClick(fest.name)}
                  className="w-full bg-white/10 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 group/btn border border-white/10 hover:border-transparent"
                >
                  <span>{fest.linkText || "विशेष सामग्री देखें"}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
