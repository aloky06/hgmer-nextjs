"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ShoppingBag,
  Heart,
  Eye,
  Check,
  Plus,
  Minus,
  Sparkles,
  SlidersHorizontal,
  Search,
  Package,
} from "lucide-react";
import { Product, fetchProducts, fetchCategories, Category } from "@/lib/api";
import { useCart } from "@/context/CartContext";

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>("featured");

  const {
    addToCart,
    cartItems,
    updateQuantity,
    toggleWishlist,
    isWishlisted,
    setQuickViewProduct,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
  } = useCart();

  useEffect(() => {
    Promise.all([fetchProducts(), fetchCategories()]).then(([prods, cats]) => {
      setProducts(prods);
      setCategories(cats);
      setLoading(false);
    });
  }, []);

  // Filter and sort products
  let filtered = [...products];

  if (selectedCategory) {
    filtered = filtered.filter((p) => p.categoryId === selectedCategory);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.category && p.category.name.toLowerCase().includes(q))
    );
  }

  if (sortBy === "price_asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price_desc") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === "rating") {
    filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  const getItemCartQuantity = (productId: number) => {
    const item = cartItems.find((i) => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <section id="products-section" className="py-16 md:py-24 bg-[#FFFDF9] relative">
      <div className="container mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs md:text-sm font-black tracking-widest text-orange-600 uppercase mb-2">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span>पवित्र ई-दुकान</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-zinc-900 tracking-tight">
              सर्वश्रेष्ठ <span className="font-light italic text-orange-600">पूजा सामग्री</span>
            </h2>
            <p className="text-xs md:text-sm text-zinc-600 mt-2 font-medium">
              100% शुद्ध, प्राकृतिक एवं शास्त्र सम्मत पूजा सामग्री घर बैठे मंगवाएं
            </p>
          </div>

          {/* Sort dropdown & search indicators */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-orange-200 px-4 py-2.5 rounded-2xl shadow-sm text-xs md:text-sm">
              <SlidersHorizontal className="w-4 h-4 text-orange-600" />
              <span className="font-bold text-zinc-700 hidden sm:inline">क्रमबद्ध करें:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent font-bold text-zinc-900 focus:outline-none cursor-pointer"
              >
                <option value="featured">लोकप्रिय (Featured)</option>
                <option value="price_asc">मूल्य: कम से अधिक</option>
                <option value="price_desc">मूल्य: अधिक से कम</option>
                <option value="rating">उच्चतम रेटिंग (Top Rated)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills & Filters */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-8 no-scrollbar">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-bold whitespace-nowrap transition-all ${
              selectedCategory === null
                ? "bg-orange-600 text-white shadow-lg shadow-orange-600/30 scale-105"
                : "bg-white text-zinc-700 border border-orange-200 hover:border-orange-400 hover:bg-orange-50"
            }`}
          >
            सभी सामग्री ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? "bg-orange-600 text-white shadow-lg shadow-orange-600/30 scale-105"
                  : "bg-white text-zinc-700 border border-orange-200 hover:border-orange-400 hover:bg-orange-50"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search status if active */}
        {searchQuery && (
          <div className="mb-6 flex items-center justify-between bg-orange-50 border border-orange-200 px-4 py-2.5 rounded-2xl">
            <p className="text-xs md:text-sm text-zinc-800">
              खोज परिणाम: <strong className="text-orange-700">"{searchQuery}"</strong> ({filtered.length} उत्पाद मिले)
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs font-bold text-orange-700 hover:underline"
            >
              खोज हटाएं ✕
            </button>
          </div>
        )}

        {/* Product Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-96 rounded-3xl bg-zinc-100 animate-pulse border border-zinc-200"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-orange-100 shadow-sm max-w-lg mx-auto p-8">
            <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center text-orange-400 mx-auto mb-4">
              <Search className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-2">कोई उत्पाद नहीं मिला</h3>
            <p className="text-xs md:text-sm text-zinc-500 mb-6">
              कृपया अन्य कीवर्ड खोजें या श्रेणी फ़िल्टर रीसेट करें।
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory(null);
              }}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors"
            >
              सभी उत्पाद देखें
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((product, idx) => {
              const discount =
                product.mrp && product.mrp > product.price
                  ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
                  : null;
              const inCartQty = getItemCartQuantity(product.id);
              const wishlisted = isWishlisted(product.id);

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (idx % 4) * 0.1, duration: 0.5 }}
                  className="bg-white rounded-3xl border border-orange-100/80 hover:border-orange-300 shadow-sm hover:shadow-2xl hover:shadow-orange-900/10 transition-all duration-300 flex flex-col justify-between overflow-hidden group relative"
                >
                  {/* Top Image Container */}
                  <div className="relative aspect-[4/3] bg-gradient-to-br from-[#FFF8EE] to-[#FFF1DE] overflow-hidden p-4 flex items-center justify-center">
                    {/* Discount Badge */}
                    {discount && (
                      <span className="absolute top-3 left-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-md z-10">
                        {discount}% छूट
                      </span>
                    )}

                    {/* Bundle Kit Badge */}
                    {product.type === "BUNDLE" && (
                      <span className="absolute top-3 right-12 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full z-10 flex items-center gap-1">
                        <Package className="w-3 h-3 text-amber-700" />
                        कॉम्बो किट
                      </span>
                    )}

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all ${
                        wishlisted
                          ? "bg-rose-50 text-rose-600 shadow-md scale-110"
                          : "bg-white/80 backdrop-blur-sm text-zinc-400 hover:text-rose-600 hover:bg-white shadow-sm"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${wishlisted ? "fill-current" : ""}`} />
                    </button>

                    {/* Product Image */}
                    <img
                      src={product.imageUrl || "/puja_thali.jpeg"}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Quick View Button on hover */}
                    <button
                      onClick={() => setQuickViewProduct(product)}
                      className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-zinc-900/80 hover:bg-zinc-900 text-white text-xs font-bold px-4 py-2 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1.5 shadow-lg transform translate-y-2 group-hover:translate-y-0"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      त्वरित झलक (Quick View)
                    </button>
                  </div>

                  {/* Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Rating and Weight */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1 text-amber-500 text-xs font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{product.rating || 4.8}</span>
                          <span className="text-zinc-400 text-[10px]">({product.reviewCount || 120})</span>
                        </div>
                        {product.unit && (
                          <span className="text-[11px] font-semibold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-md">
                            {product.weight} {product.unit}
                          </span>
                        )}
                      </div>

                      {/* Product Name */}
                      <h3
                        onClick={() => setQuickViewProduct(product)}
                        className="font-bold text-sm md:text-[15px] text-zinc-900 hover:text-orange-600 transition-colors line-clamp-2 leading-snug cursor-pointer mb-2"
                      >
                        {product.name}
                      </h3>

                      {/* Short Description */}
                      <p className="text-xs text-zinc-500 line-clamp-2 mb-4">
                        {product.description}
                      </p>
                    </div>

                    {/* Price and Cart Action */}
                    <div className="pt-3 border-t border-orange-100/80 flex items-center justify-between gap-2">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg md:text-xl font-black text-orange-600">
                            ₹{product.price}
                          </span>
                          {product.mrp && product.mrp > product.price && (
                            <span className="text-xs text-zinc-400 line-through">
                              ₹{product.mrp}
                            </span>
                          )}
                        </div>
                        {product.mrp && product.mrp > product.price && (
                          <span className="text-[10px] font-bold text-emerald-600">
                            बचत: ₹{product.mrp - product.price}
                          </span>
                        )}
                      </div>

                      {/* Add to Cart / Quantity controls */}
                      {inCartQty > 0 ? (
                        <div className="flex items-center gap-2 bg-orange-50 border border-orange-300 rounded-xl px-2 py-1 shadow-sm">
                          <button
                            onClick={() => updateQuantity(product.id, inCartQty - 1)}
                            className="text-orange-700 hover:text-orange-900 font-bold px-1"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-black text-orange-950 w-4 text-center">
                            {inCartQty}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.id, inCartQty + 1)}
                            className="text-orange-700 hover:text-orange-900 font-bold px-1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(product)}
                          className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-orange-600/20 hover:scale-105 flex items-center gap-1.5 active:scale-95"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          खरीदें
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
