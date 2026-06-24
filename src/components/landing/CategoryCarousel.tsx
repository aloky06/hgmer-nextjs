"use client";

import { motion } from "framer-motion";

const categories = [
  { name: "पूजा थाली और बर्तन", img: "/puja_thali.jpeg" },
  { name: "मूर्तियाँ", img: "/ganesha.jpeg" },
  { name: "पूजा सामग्री", img: "/pooja_items.jpeg" },
  { name: "अगरबत्ती और धूप", img: "/chandal_thali.jpeg" },
  { name: "कलश और नारियल", img: "/kalash_with_coco.jpeg" },
  { name: "हवन सामग्री", img: "/havan_set.jpeg" },
  { name: "त्यौहार विशेष", img: "placeholder" },
  { name: "अन्य श्रेणियाँ", img: "placeholder" },
];

export default function CategoryCarousel() {
  return (
    <section className="py-20 relative bg-[#FFFDF9]">
      {/* Subtle mandala/pattern background representation */}
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-6 w-full justify-center relative">
            <div className="hidden md:block absolute left-0 w-[35%] h-[1px] bg-gradient-to-r from-transparent to-orange-300"></div>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight px-6 z-10 bg-[#FFFDF9]">
              पूजा सामग्री <span className="font-light italic text-orange-600">श्रेणियाँ</span>
            </h2>
            <div className="hidden md:block absolute right-0 w-[35%] h-[1px] bg-gradient-to-l from-transparent to-orange-300"></div>
          </div>
          <button className="hidden lg:flex absolute right-8 shrink-0 text-orange-700 font-bold px-8 py-3 bg-white border border-orange-200 shadow-sm rounded-full hover:bg-orange-50 hover:border-orange-400 hover:shadow-md transition-all items-center gap-2 group">
            सभी देखें
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-8">
          {categories.map((cat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1, duration: 0.7, type: "spring", bounce: 0.4 }}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-full aspect-square rounded-[2rem] bg-white border-2 border-orange-50 shadow-sm flex items-center justify-center p-3 mb-5 group-hover:shadow-2xl group-hover:shadow-orange-900/10 group-hover:border-orange-400 transition-all duration-500 group-hover:-translate-y-4 relative overflow-hidden">
                {/* Decorative corner accents on hover */}
                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                {cat.img === "placeholder" ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl text-orange-600 group-hover:scale-105 transition-transform">
                    <div className="grid grid-cols-2 gap-1.5 mb-1">
                        <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                        <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                        <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                        <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full rounded-2xl overflow-hidden relative">
                    <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
                  </div>
                )}
              </div>
              <h3 className="text-[15px] md:text-base font-bold text-zinc-800 text-center group-hover:text-orange-600 transition-colors leading-tight px-2">{cat.name}</h3>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center lg:hidden">
            <button className="text-orange-700 bg-white shadow-sm font-bold px-8 py-4 border border-orange-200 rounded-full hover:bg-orange-50 transition-colors w-full sm:w-auto text-lg">
                सभी देखें
            </button>
        </div>
      </div>
    </section>
  );
}
