"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Tag,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const router = useRouter();
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    cartTotal,
    cartMrpTotal,
    totalSavings,
    user,
    openAuthModal,
  } = useCart();

  const [coupon, setCoupon] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState("");

  const freeDeliveryThreshold = 499;
  const deliveryCharge = cartTotal >= freeDeliveryThreshold || cartItems.length === 0 ? 0 : 49;
  const finalAmount = Math.max(0, cartTotal - couponDiscount + deliveryCharge);

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (code === "SHUDDH10" || code === "MANDIR10") {
      const discount = Math.round(cartTotal * 0.1);
      setCouponDiscount(discount);
      setCouponMsg(`✓ कूपन ${code} लागू! ₹${discount} की छूट मिली।`);
    } else if (code === "PUJA50") {
      setCouponDiscount(50);
      setCouponMsg("✓ कूपन PUJA50 लागू! ₹50 की छूट मिली।");
    } else {
      setCouponMsg("✗ अमान्य कूपन। कृपया SHUDDH10 का उपयोग करें।");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 md:px-8 py-16 max-w-4xl text-center">
        <div className="w-24 h-24 rounded-full bg-orange-50 text-orange-400 flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-12 h-12 stroke-[1.2]" />
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-zinc-900 mb-2">आपकी पूजा टोकरी खाली है</h2>
        <p className="text-xs md:text-sm text-zinc-500 mb-8 max-w-sm mx-auto">
          अपने घर में सुख-समृद्धि एवं शांति के लिए 100% शुद्ध वैदिक पूजा सामग्री व किट चुनें।
        </p>
        <Link
          href="/shop"
          className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold px-8 py-4 rounded-2xl text-sm shadow-xl shadow-orange-600/30 inline-flex items-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          पूजा सामग्री खरीदें
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-10 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">
          आपकी <span className="font-light italic text-orange-600">पूजा टोकरी (Shopping Cart)</span>
        </h1>
        <p className="text-xs md:text-sm text-zinc-500 mt-1">
          {cartItems.length} उत्पाद आपकी टोकरी में हैं
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Free delivery banner */}
          <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-orange-900">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span>
                {cartTotal >= freeDeliveryThreshold
                  ? "बधाई हो! आपको मुफ्त होम डिलीवरी मिल रही है।"
                  : `मुफ्त डिलीवरी के लिए ₹${freeDeliveryThreshold - cartTotal} की और खरीदारी करें`}
              </span>
            </div>
          </div>

          {cartItems.map((item) => (
            <div
              key={item.product.id}
              className="bg-white rounded-3xl p-5 border border-orange-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-20 h-20 rounded-2xl bg-orange-50 p-2 shrink-0 border border-orange-100 flex items-center justify-center">
                  <img
                    src={item.product.imageUrl || "/puja_thali.jpeg"}
                    alt={item.product.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-black text-sm text-zinc-900 line-clamp-1">
                    {item.product.name}
                  </h3>
                  {item.product.unit && (
                    <span className="text-[11px] text-zinc-500 block">
                      पैकिंग: {item.product.weight} {item.product.unit}
                    </span>
                  )}
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-black text-base text-orange-600">
                      ₹{item.product.price}
                    </span>
                    {item.product.mrp && item.product.mrp > item.product.price && (
                      <span className="text-xs text-zinc-400 line-through">
                        MRP ₹{item.product.mrp}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quantity Controls & Delete */}
              <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-100">
                <div className="flex items-center gap-3 border border-zinc-200 rounded-xl px-3 py-1.5 shadow-sm bg-[#FFFDF9]">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="text-zinc-600 hover:text-orange-600 font-bold"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-black text-zinc-800 w-4 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="text-zinc-600 hover:text-orange-600 font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="w-9 h-9 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary & Checkout Box (1 col) */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-orange-200 shadow-md space-y-4">
            <h3 className="font-black text-base text-zinc-900 pb-3 border-b border-orange-100">
              ऑर्डर सारांश (Order Summary)
            </h3>

            {/* Coupon Code Form */}
            <div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="कूपन कोड (उदा. SHUDDH10)"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="flex-1 px-3.5 py-2 text-xs border border-zinc-200 rounded-xl uppercase font-semibold focus:outline-none focus:border-orange-500"
                />
                <button
                  onClick={applyCoupon}
                  className="bg-zinc-900 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
                >
                  लागू करें
                </button>
              </div>
              {couponMsg && (
                <p className={`text-xs mt-1 font-semibold ${couponDiscount > 0 ? "text-emerald-600" : "text-red-500"}`}>
                  {couponMsg}
                </p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs font-semibold text-zinc-600 pt-2 border-t border-zinc-100">
              <div className="flex justify-between">
                <span>कुल मूल्य (MRP):</span>
                <span className="line-through text-zinc-400">₹{cartMrpTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>सामग्री मूल्य (Subtotal):</span>
                <span className="text-zinc-900 font-bold">₹{cartTotal}</span>
              </div>
              {totalSavings > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>सीधी बचत (Discount):</span>
                  <span>- ₹{totalSavings}</span>
                </div>
              )}
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>कूपन छूट:</span>
                  <span>- ₹{couponDiscount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>डिलीवरी शुल्क:</span>
                <span>
                  {deliveryCharge === 0 ? (
                    <span className="text-emerald-600 font-bold">मुफ्त (FREE)</span>
                  ) : (
                    `₹${deliveryCharge}`
                  )}
                </span>
              </div>
            </div>

            {/* Final Total */}
            <div className="pt-3 border-t border-orange-200 flex justify-between items-baseline">
              <span className="text-sm font-black text-zinc-900">कुल देय राशि:</span>
              <span className="text-2xl font-black text-orange-600">₹{finalAmount}</span>
            </div>

            <button
              onClick={() => {
                if (!user) {
                  openAuthModal('LOGIN', {
                    type: 'CHECKOUT',
                    message: 'चेकआउट एवं ऑर्डर की पुष्टि के लिए कृपया पहले लॉगिन करें।',
                  });
                } else {
                  router.push('/checkout');
                }
              }}
              className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold py-3.5 px-4 rounded-2xl text-xs md:text-sm transition-all shadow-xl shadow-orange-600/30 flex items-center justify-center gap-2"
            >
              <span>चेकआउट करें (Proceed to Checkout)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500 pt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% सुरक्षित भुगतान • शुद्ध सामग्री गारंटी</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
