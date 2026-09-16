"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingBag, Heart, ShieldCheck, Truck, Check, Sparkles, Package } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function QuickViewModal() {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    buyNow,
    toggleWishlist,
    isWishlisted,
    setIsCartOpen,
  } = useCart();

  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const discountPercent =
    product.mrp && product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : null;

  const handleAddToCart = () => {
    setQuickViewProduct(null);
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    setQuickViewProduct(null);
    buyNow(product, quantity);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setQuickViewProduct(null)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl z-10 border border-orange-100 max-h-[90vh] flex flex-col md:flex-row"
        >
          {/* Close button */}
          <button
            onClick={() => setQuickViewProduct(null)}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-zinc-600 hover:text-zinc-900 flex items-center justify-center shadow-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left: Product Image & Badges */}
          <div className="md:w-1/2 bg-gradient-to-br from-orange-50/60 to-amber-50/40 p-6 flex flex-col justify-center items-center relative border-b md:border-b-0 md:border-r border-orange-100">
            {discountPercent && (
              <span className="absolute top-4 left-4 bg-orange-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-md">
                {discountPercent}% छूट
              </span>
            )}
            <div className="w-full max-w-[280px] aspect-square rounded-2xl overflow-hidden bg-white shadow-lg border border-orange-100/80 p-2 relative group">
              <img
                src={product.imageUrl || '/puja_thali.jpeg'}
                alt={product.name}
                className="w-full h-full object-contain rounded-xl group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="mt-4 flex items-center gap-4 text-xs font-semibold text-zinc-600">
              <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% शुद्ध प्रमाणित
              </span>
              <span className="flex items-center gap-1 text-orange-700 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">
                <Truck className="w-3.5 h-3.5" /> तीव्र डिलीवरी
              </span>
            </div>
          </div>

          {/* Right: Product Details & Actions */}
          <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-orange-700 bg-orange-100/80 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {product.type === 'BUNDLE' ? '★ सम्पूर्ण पूजा किट' : 'शुद्ध पूजा सामग्री'}
                </span>
                <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span className="text-xs font-black text-zinc-800">{product.rating || 4.9}</span>
                  <span className="text-[11px] text-zinc-400">({product.reviewCount || 150})</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl md:text-2xl font-black text-zinc-900 leading-snug mb-3">
                {product.name}
              </h2>

              {/* Pricing */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-3xl font-black text-orange-600">₹{product.price}</span>
                {product.mrp && product.mrp > product.price && (
                  <span className="text-sm text-zinc-400 line-through">MRP ₹{product.mrp}</span>
                )}
                {product.weight && (
                  <span className="text-xs font-semibold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-md">
                    {product.weight} {product.unit || 'g'}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs md:text-sm text-zinc-600 leading-relaxed mb-4">
                {product.description}
              </p>

              {/* Bundle Components if available */}
              {product.type === 'BUNDLE' && (
                <div className="mb-4 bg-orange-50/70 p-3 rounded-xl border border-orange-100">
                  <p className="text-xs font-bold text-orange-900 flex items-center gap-1.5 mb-1.5">
                    <Package className="w-3.5 h-3.5 text-orange-600" />
                    इस किट में शामिल सामग्रियां:
                  </p>
                  <p className="text-[11px] text-zinc-600 leading-tight">
                    शुद्ध रोली, अक्षत, कलावा, धूप, अगरबत्ती, कपूर, गंगाजल, पीला वस्त्र, पंचमेवा व विधि पुस्तिका।
                  </p>
                </div>
              )}
            </div>

            {/* Quantity and Action Buttons */}
            <div className="space-y-4 pt-4 border-t border-zinc-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-700">मात्रा (Quantity):</span>
                <div className="flex items-center gap-3 border border-zinc-200 rounded-xl px-3 py-1.5 shadow-sm">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="text-zinc-500 hover:text-orange-600 font-bold px-1"
                  >
                    -
                  </button>
                  <span className="text-sm font-black text-zinc-800 w-4 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="text-zinc-500 hover:text-orange-600 font-bold px-1"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-white hover:bg-orange-50 border-2 border-orange-600 text-orange-600 font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  कार्ट में जोड़ें
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md shadow-orange-600/30 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  अभी खरीदें
                </button>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-colors ${
                    isWishlisted(product.id)
                      ? 'bg-rose-50 border-rose-300 text-rose-600'
                      : 'border-zinc-200 text-zinc-400 hover:text-rose-600 hover:border-rose-200'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted(product.id) ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
