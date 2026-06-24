"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Users, Truck, UserCheck } from "lucide-react";

export default function StatsBanner() {
  const stats = [
    { icon: ShieldCheck, title: "5000+", subtitle: "पूजा उत्पाद" },
    { icon: Users, title: "10L+", subtitle: "संतुष्ट ग्राहक" },
    { icon: Truck, title: "500+", subtitle: "शहरों में डिलीवरी" },
    { icon: UserCheck, title: "500+", subtitle: "विशेषज्ञ पंडित जी" },
  ];

  return (
    <section className="py-10 bg-[#3B1917] relative overflow-hidden">
        {/* Subtle background pattern/gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-900/20 via-[#3B1917]/0 to-[#3B1917]/0 pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-x divide-white/10">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className={`flex items-center justify-center gap-4 ${idx !== 0 ? "pl-4 md:pl-0" : ""}`}
            >
              <div className="text-orange-400 group-hover:scale-110 transition-transform">
                <stat.icon className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{stat.title}</h3>
                <p className="text-xs md:text-sm text-orange-200/80 font-medium">{stat.subtitle}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
