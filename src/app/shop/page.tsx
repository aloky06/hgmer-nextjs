"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  Star,
  ShoppingBag,
  Heart,
  Eye,
  Plus,
  Minus,
  Package,
  Sparkles,
  Filter,
  Check,
} from "lucide-react";
import { Product, fetchProducts, fetchCategories, Category } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(3000);
  const [bundleOnly, setBundleOnly] = useState<boolean>(false);

  const {
    addToCart,
    cartItems,
    updateQuantity,
    toggleWishlist,
    isWishlisted,
    setQuickViewProduct,
    searchQuery,
    setSearchQuery,
  } = useCart();

  useEffect(() => {
    Promise.all([fetchProducts(), fetchCategories()]).then(([prods, cats]) => {
      setProducts(prods);
      setCategories(cats);
      setLoading(false);
    });
  }, []);

  let filtered = [...products];

  if (activeCategoryId) {
    filtered = filtered.filter((p) => p.categoryId === activeCategoryId);
  }

  if (bundleOnly) {
    filtered = filtered.filter((p) => p.type === "BUNDLE");
  }

  filtered = filtered.filter((p) => p.price <= maxPriceFilter);

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
    <div className="container mx-auto px-4 md:px-8 py-10 max-w-7xl">
      {/* Page Title & Breadcrumb */}
      <div className="mb-8">
        <span className="text-xs font-bold text-orange-600 uppercase tracking-widest bg-orange-100 px-3 py-1 rounded-full">
          100% शुद्ध वैदिक स्टोर
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-zinc-900 tracking-tight mt-2">
          पूजा सामग्री <span className="font-light italic text-orange-600">ई-शॉप</span>
        </h1>
        <p className="text-xs md:text-sm text-zinc-600 mt-1">
          दैनिक पूजा, हवन, अभिषेक, त्यौहार किट व पीतल बर्तनों का संपूर्ण प्रामाणिक संग्रह
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters (1 col) */}
        <div className="space-y-6">
          {/* Categories Filter Box */}
          <div className="bg-white rounded-3xl p-6 border border-orange-200 shadow-sm space-y-4">
            <h3 className="font-black text-sm text-zinc-900 flex items-center justify-between pb-3 border-b border-orange-100">
              <span className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-orange-600" />
                श्रेणियाँ (Categories)
              </span>
              {activeCategoryId && (
                <button
                  onClick={() => setActiveCategoryId(null)}
                  className="text-[11px] font-bold text-orange-600 hover:underline"
                >
                  सभी देखें
                </button>
              )}
            </h3>

            <div className="space-y-1.5">
              <button
                onClick={() => setActiveCategoryId(null)}
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                  activeCategoryId === null
                    ? "bg-orange-600 text-white shadow-md shadow-orange-600/20"
                    : "text-zinc-700 hover:bg-orange-50"
                }`}
              >
                <span>सभी उत्पाद (All)</span>
                <span>{products.length}</span>
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryId(cat.id)}
                  className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                    activeCategoryId === cat.id
                      ? "bg-orange-600 text-white shadow-md shadow-orange-600/20"
                      : "text-zinc-700 hover:bg-orange-50"
                  }`}
                >
                  <span className="line-clamp-1">{cat.name}</span>
                  {activeCategoryId === cat.id && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Checkbox Filters */}
          <div className="bg-white rounded-3xl p-6 border border-orange-200 shadow-sm space-y-4">
            <h3 className="font-black text-sm text-zinc-900 pb-3 border-b border-orange-100">
              विशेष संग्रह
            </h3>

            <label className="flex items-center gap-2.5 text-xs font-bold text-zinc-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={bundleOnly}
                onChange={(e) => setBundleOnly(e.target.checked)}
                className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 accent-orange-600"
              />
              <span>केवल सम्पूर्ण पूजा किट (Combos)</span>
            </label>

            {/* Price Slider */}
            <div className="pt-2">
              <div className="flex justify-between text-xs font-bold text-zinc-700 mb-2">
                <span>अधिकतम मूल्य:</span>
                <span className="text-orange-600">₹{maxPriceFilter}</span>
              </div>
              <input
                type="range"
                min="100"
                max="3000"
                step="50"
                value={maxPriceFilter}
                onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                className="w-full accent-orange-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Products Grid (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Bar Sort & Count */}
          <div className="bg-white rounded-2xl p-4 border border-orange-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs font-bold text-zinc-600">
              कुल <strong>{filtered.length}</strong> शुद्ध पूजा उत्पाद उपलब्ध हैं
            </span>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-orange-600" />
              <span className="text-xs font-bold text-zinc-600">सॉर्ट करें:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-1.5 text-xs font-bold text-zinc-800 focus:outline-none focus:border-orange-500 cursor-pointer"
              >
                <option value="featured">लोकप्रिय (Featured)</option>
                <option value="price_asc">मूल्य: कम से अधिक</option>
                <option value="price_desc">मूल्य: अधिक से कम</option>
                <option value="rating">उच्चतम रेटिंग (Top Rated)</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-orange-100 p-8 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-400 flex items-center justify-center mx-auto mb-3">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-zinc-900 mb-1">कोई उत्पाद नहीं मिला</h3>
              <p className="text-xs text-zinc-500 mb-4">
                कृपया फ़िल्टर रीसेट करें या कोई अन्य शब्द खोजें।
              </p>
              <button
                onClick={() => {
                  setActiveCategoryId(null);
                  setMaxPriceFilter(3000);
                  setBundleOnly(false);
                  setSearchQuery("");
                }}
                className="bg-orange-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl"
              >
                फ़िल्टर रीसेट करें
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((product) => {
                const discount =
                  product.mrp && product.mrp > product.price
                    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
                    : null;
                const inCartQty = getItemCartQuantity(product.id);
                const wishlisted = isWishlisted(product.id);

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-3xl border border-orange-100 hover:border-orange-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                  >
                    <div className="relative aspect-[4/3] bg-[#FFF8EE] p-4 flex items-center justify-center overflow-hidden">
                      {discount && (
                        <span className="absolute top-3 left-3 bg-orange-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-md z-10">
                          {discount}% छूट
                        </span>
                      )}

                      {product.type === "BUNDLE" && (
                        <span className="absolute top-3 right-12 bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full z-10 flex items-center gap-1">
                          <Package className="w-3 h-3" /> किट
                        </span>
                      )}

                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all ${
                          wishlisted
                            ? "bg-rose-50 text-rose-600 shadow-md scale-110"
                            : "bg-white/80 text-zinc-400 hover:text-rose-600 shadow-sm"
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${wishlisted ? "fill-current" : ""}`} />
                      </button>

                      <img
                        src={product.imageUrl || "/puja_thali.jpeg"}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                      />

                      <button
                        onClick={() => setQuickViewProduct(product)}
                        className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-zinc-900/80 hover:bg-zinc-900 text-white text-xs font-bold px-4 py-1.5 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1.5 shadow-md"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        झलक (Quick View)
                      </button>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-1 text-amber-500 text-xs font-bold bg-amber-50 px-2 py-0.5 rounded-md">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span>{product.rating || 4.8}</span>
                            <span className="text-zinc-400 text-[10px]">
                              ({product.reviewCount || 100})
                            </span>
                          </div>
                          {product.unit && (
                            <span className="text-[11px] font-semibold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-md">
                              {product.weight} {product.unit}
                            </span>
                          )}
                        </div>

                        <Link
                          href={`/products/${product.id}`}
                          className="font-black text-sm text-zinc-900 hover:text-orange-600 transition-colors line-clamp-2 leading-snug mb-2 block"
                        >
                          {product.name}
                        </Link>

                        <p className="text-xs text-zinc-500 line-clamp-2 mb-4">
                          {product.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-orange-100 flex items-center justify-between gap-2">
                        <div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-lg font-black text-orange-600">
                              ₹{product.price}
                            </span>
                            {product.mrp && product.mrp > product.price && (
                              <span className="text-xs text-zinc-400 line-through">
                                ₹{product.mrp}
                              </span>
                            )}
                          </div>
                        </div>

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
                            className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-orange-600/20 hover:scale-105 flex items-center gap-1.5"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            खरीदें
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
