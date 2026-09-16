"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Category, fetchCategories } from "@/lib/api";
import { useCart } from "@/context/CartContext";

export default function CategoryCarousel() {
  const [categories, setCategories] = useState<Category[]>([]);
  const { selectedCategory, setSelectedCategory } = useCart();

  useEffect(() => {
    fetchCategories().then((data) => {
      if (data && data.length > 0) {
        setCategories(data);
      }
    });
  }, []);

  const handleCategoryClick = (catId: number) => {
    if (selectedCategory === catId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(catId);
    }
    const elem = document.getElementById("products-section");
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-16 md:py-24 relative bg-[#FFFDF9]">
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center justify-center gap-2 mb-3">
            <span className="w-8 h-[2px] bg-orange-500"></span>
            <span className="text-xs md:text-sm font-black tracking-widest text-orange-600 uppercase">
              पवित्र संग्रह
            </span>
            <span className="w-8 h-[2px] bg-orange-500"></span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-zinc-900 tracking-tight">
            पूजा सामग्री <span className="font-light italic text-orange-600">श्रेणियाँ</span>
          </h2>
          <p className="text-xs md:text-sm text-zinc-600 mt-3 font-medium">
            दैनिक नित्य पूजा से लेकर भव्य अनुष्ठानों तक, हर धार्मिक आवश्यकता के लिए शुद्ध सामग्री
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-6">
          {categories.map((cat, idx) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <motion.div
                key={cat.id || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.5 }}
                onClick={() => handleCategoryClick(cat.id)}
                className="flex flex-col items-center group cursor-pointer"
              >
                <div
                  className={`w-full aspect-square rounded-3xl bg-white border-2 p-3 mb-3 flex items-center justify-center relative overflow-hidden transition-all duration-300 group-hover:-translate-y-2 ${
                    isSelected
                      ? "border-orange-600 shadow-xl shadow-orange-600/20 ring-2 ring-orange-400"
                      : "border-orange-100/80 shadow-sm group-hover:border-orange-400 group-hover:shadow-lg"
                  }`}
                >
                  {/* Decorative corner accents on hover */}
                  <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t-2 border-l-2 border-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t-2 border-r-2 border-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b-2 border-l-2 border-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b-2 border-r-2 border-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="w-full h-full rounded-2xl overflow-hidden bg-orange-50 flex items-center justify-center">
                    <img
                      src={cat.iconUrl || "/puja_thali.jpeg"}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>

                <h3
                  className={`text-xs md:text-sm font-bold text-center leading-tight transition-colors px-1 ${
                    isSelected ? "text-orange-600 font-extrabold" : "text-zinc-800 group-hover:text-orange-600"
                  }`}
                >
                  {cat.name}
                </h3>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
