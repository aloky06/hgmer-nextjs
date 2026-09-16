"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  ShoppingBag,
  Trash2,
  Star,
  ArrowRight,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { Product, fetchProducts } from "@/lib/api";
import { useCart } from "@/context/CartContext";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart, setQuickViewProduct } = useCart();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts().then((list) => {
      setProducts(list);
    });
  }, []);

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="container mx-auto px-4 md:px-8 py-10 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">
          मेरी <span className="font-light italic text-orange-600">विशलिस्ट (My Wishlist)</span>
        </h1>
        <p className="text-xs md:text-sm text-zinc-500 mt-1">
          {wishlistedProducts.length} पवित्र वस्तुएं आपकी पसंद में सहेजी गई हैं
        </p>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-orange-100 shadow-sm text-center max-w-lg mx-auto">
          <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-10 h-10 stroke-[1.2]" />
          </div>
          <h3 className="text-xl font-black text-zinc-900 mb-1">आपकी विशलिस्ट अभी खाली है</h3>
          <p className="text-xs text-zinc-500 mb-6">
            अपनी पसंदीदा पूजा सामग्री, मूर्तियों व किट पर दिल (♥) दबाकर सहेजें।
          </p>
          <Link
            href="/shop"
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-3 rounded-xl text-xs transition-colors inline-flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            पूजा सामग्री देखें
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-3xl border border-orange-100 hover:border-orange-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              <div className="relative aspect-[4/3] bg-[#FFF8EE] p-4 flex items-center justify-center overflow-hidden">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shadow-md z-10 hover:bg-rose-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <img
                  src={product.imageUrl || "/puja_thali.jpeg"}
                  alt={product.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                />

                <button
                  onClick={() => setQuickViewProduct(product)}
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-zinc-900/80 text-white text-xs font-bold px-4 py-1.5 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1.5 shadow-md"
                >
                  <Eye className="w-3.5 h-3.5" />
                  झलक
                </button>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold bg-amber-50 px-2 py-0.5 rounded-md w-fit mb-2">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{product.rating || 4.9}</span>
                  </div>

                  <Link
                    href={`/products/${product.id}`}
                    className="font-black text-sm text-zinc-900 hover:text-orange-600 line-clamp-2 leading-snug mb-2 block"
                  >
                    {product.name}
                  </Link>

                  <p className="text-xs text-zinc-500 line-clamp-2 mb-4">
                    {product.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-orange-100 flex items-center justify-between gap-2">
                  <span className="text-lg font-black text-orange-600">₹{product.price}</span>

                  <button
                    onClick={() => addToCart(product)}
                    className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-orange-600/20 flex items-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    कार्ट में डालें
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
