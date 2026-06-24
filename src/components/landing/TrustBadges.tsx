"use client";

import { motion } from "framer-motion";
import { ShoppingCart, ShieldCheck, RefreshCw, PackageCheck } from "lucide-react";

export default function TrustBadges() {
  const badges = [
    { icon: ShoppingCart, title: "विस्तृत श्रृंखला", subtitle: "5000+ उत्पाद" },
    { icon: ShieldCheck, title: "100% प्रामाणिक", subtitle: "सत्यापित और विश्वसनीय" },
    { icon: RefreshCw, title: "आसान वापसी", subtitle: "7 दिनों की वापसी नीति" },
    { icon: PackageCheck, title: "सुरक्षित पैकेजिंग", subtitle: "सुरक्षित और स्वच्छ डिलीवरी" },
  ];

  return (
    <div className="container mx-auto px-4 md:px-8 relative z-20 -mt-16 md:-mt-24 mb-16">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-orange-900/10 border border-orange-100/50 p-6 md:p-10"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-orange-100">
          {badges.map((badge, idx) => (
            <div key={idx} className={`flex items-center gap-5 group pt-6 sm:pt-0 ${idx !== 0 ? 'sm:pl-6 lg:pl-10' : ''} ${idx === 0 ? 'pt-0' : ''}`}>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center text-orange-600 shrink-0 group-hover:bg-gradient-to-br group-hover:from-orange-500 group-hover:to-orange-600 group-hover:text-white transition-all duration-500 shadow-inner group-hover:shadow-orange-500/30">
                <badge.icon className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-extrabold text-zinc-900 text-lg md:text-xl tracking-tight">{badge.title}</h4>
                <p className="text-sm md:text-[15px] text-zinc-500 font-medium mt-1">{badge.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
