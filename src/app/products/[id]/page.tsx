"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Star,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Truck,
  ArrowLeft,
  Package,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { Product, fetchProductById, fetchProducts } from "@/lib/api";
import { useCart } from "@/context/CartContext";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart, buyNow, toggleWishlist, isWishlisted, setIsCartOpen } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      Promise.all([
        fetchProductById(Number(params.id)),
        fetchProducts(),
      ]).then(([prod, list]) => {
        setProduct(prod);
        setRelatedProducts(list.filter((p) => p.id !== prod.id).slice(0, 4));
        setLoading(false);
      }).catch((e) => {
        console.error("Failed to fetch product by id", e);
        setLoading(false);
      });
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-zinc-500 font-bold">उत्पाद विवरण लोड हो रहा है...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-zinc-500 font-bold">उत्पाद नहीं मिला।</p>
        <button
          onClick={() => router.push("/shop")}
          className="bg-orange-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs mt-4"
        >
          दुकान पर जाएं
        </button>
      </div>
    );
  }

  const discount =
    product.mrp && product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : null;

  const wishlisted = isWishlisted(product.id);

  const handleBuyNow = () => {
    buyNow(product, quantity);
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-10 max-w-6xl">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-xs font-bold text-zinc-600 hover:text-orange-600 mb-6 bg-white border border-orange-200 px-4 py-2 rounded-xl shadow-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>दुकान (Shop) पर वापस जाएं</span>
      </button>

      {/* Main Product Card */}
      <div className="bg-white rounded-[2.5rem] border border-orange-200 shadow-xl p-6 md:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14">
        {/* Left: Product Images & Badges */}
        <div className="flex flex-col items-center">
          <div className="relative w-full aspect-square rounded-3xl bg-gradient-to-br from-orange-50/60 to-amber-50/40 p-8 flex items-center justify-center border border-orange-100 overflow-hidden">
            {discount && (
              <span className="absolute top-4 left-4 bg-orange-600 text-white text-xs font-black px-3.5 py-1.5 rounded-full shadow-md z-10">
                {discount}% छूट
              </span>
            )}

            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all ${
                wishlisted
                  ? "bg-rose-50 text-rose-600 shadow-md scale-110"
                  : "bg-white text-zinc-400 hover:text-rose-600 shadow-sm"
              }`}
            >
              <Heart className={`w-5 h-5 ${wishlisted ? "fill-current" : ""}`} />
            </button>

            <img
              src={product.imageUrl || "/puja_thali.jpeg"}
              alt={product.name}
              className="w-full h-full object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-3 w-full mt-4 text-center text-xs font-bold text-zinc-700">
            <div className="bg-[#FFFDF9] p-3 rounded-2xl border border-orange-100 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% शुद्ध</span>
            </div>
            <div className="bg-[#FFFDF9] p-3 rounded-2xl border border-orange-100 flex items-center justify-center gap-1.5">
              <Truck className="w-4 h-4 text-orange-600" />
              <span>तीव्र डिलीवरी</span>
            </div>
            <div className="bg-[#FFFDF9] p-3 rounded-2xl border border-orange-100 flex items-center justify-center gap-1.5">
              <RefreshCw className="w-4 h-4 text-amber-600" />
              <span>7 दिन वापसी</span>
            </div>
          </div>
        </div>

        {/* Right: Product Details & Actions */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-bold text-orange-700 bg-orange-100 px-3 py-1 rounded-full uppercase tracking-wider">
                {product.type === "BUNDLE" ? "★ सम्पूर्ण पूजा किट" : "प्रामाणिक पूजा सामग्री"}
              </span>
              <div className="flex items-center gap-1 text-xs font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{product.rating || 4.9}</span>
                <span className="text-zinc-400">({product.reviewCount || 350} समीक्षाएं)</span>
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-zinc-900 leading-tight mb-3">
              {product.name}
            </h1>

            {/* Pricing */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl md:text-4xl font-black text-orange-600">
                ₹{product.price}
              </span>
              {product.mrp && product.mrp > product.price && (
                <span className="text-base text-zinc-400 line-through">MRP ₹{product.mrp}</span>
              )}
              {discount && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                  बचत: ₹{product.mrp! - product.price} ({discount}% OFF)
                </span>
              )}
            </div>

            <p className="text-xs md:text-sm text-zinc-600 leading-relaxed mb-6">
              {product.description}
            </p>
          </div>

          {/* Actions & Quantity */}
          <div className="space-y-4 pt-6 border-t border-orange-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-700">मात्रा (Quantity):</span>
              <div className="flex items-center gap-3 border border-zinc-200 rounded-xl px-3 py-1.5 shadow-sm bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="text-zinc-500 hover:text-orange-600 font-bold px-1"
                >
                  -
                </button>
                <span className="text-sm font-black text-zinc-800 w-4 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="text-zinc-500 hover:text-orange-600 font-bold px-1"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => addToCart(product, quantity)}
                className="flex-1 bg-white hover:bg-orange-50 border-2 border-orange-600 text-orange-600 font-bold py-3.5 rounded-2xl text-xs md:text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                कार्ट में जोड़ें
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold py-3.5 rounded-2xl text-xs md:text-sm transition-all shadow-xl shadow-orange-600/30 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                अभी खरीदें (Buy Now)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-black text-zinc-900 mb-6">
            सम्बंधित <span className="font-light italic text-orange-600">पूजा सामग्री</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <Link
                key={rel.id}
                href={`/products/${rel.id}`}
                className="bg-white rounded-3xl p-4 border border-orange-100 hover:border-orange-300 shadow-sm hover:shadow-lg transition-all group"
              >
                <div className="aspect-square bg-orange-50 rounded-2xl p-4 flex items-center justify-center mb-3">
                  <img
                    src={rel.imageUrl || "/puja_thali.jpeg"}
                    alt={rel.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                  />
                </div>
                <h3 className="font-bold text-xs text-zinc-900 line-clamp-1 group-hover:text-orange-600 mb-1">
                  {rel.name}
                </h3>
                <span className="font-black text-sm text-orange-600">₹{rel.price}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
