"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, ShieldCheck, ArrowRight, Sparkles, Tag, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    cartMrpTotal,
    totalSavings,
    user,
    openAuthModal,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const freeDeliveryThreshold = 499;
  const deliveryCharge = cartTotal >= freeDeliveryThreshold || cartItems.length === 0 ? 0 : 49;
  const finalTotal = Math.max(0, cartTotal - appliedDiscount + deliveryCharge);
  const progressPercent = Math.min(100, Math.round((cartTotal / freeDeliveryThreshold) * 100));

  const applyCoupon = () => {
    setCouponError('');
    setCouponSuccess('');
    const code = couponCode.trim().toUpperCase();
    if (code === 'SHUDDH10' || code === 'MANDIR10') {
      const discount = Math.round(cartTotal * 0.1);
      setAppliedDiscount(discount);
      setCouponSuccess(`कूपन ${code} लागू किया गया! ₹${discount} की छूट मिली।`);
    } else if (code === 'PUJA50') {
      setAppliedDiscount(50);
      setCouponSuccess('कूपन PUJA50 लागू किया गया! ₹50 की छूट मिली।');
    } else {
      setCouponError('अमान्य कूपन कोड। कृपया SHUDDH10 या PUJA50 आज़माएं।');
    }
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    if (!user) {
      openAuthModal('LOGIN', {
        type: 'CHECKOUT',
        message: 'चेकआउट एवं ऑर्डर की पुष्टि हेतु कृपया पहले लॉगिन करें।',
      });
      return;
    }
    if (typeof window !== 'undefined') {
      window.location.href = '/checkout';
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
          />

          {/* Slide-over Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[480px] bg-white z-[100] shadow-2xl flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-5 border-b border-orange-100 flex items-center justify-between bg-[#FFFBF5]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-zinc-900 text-lg">आपकी पूजा टोकरी (Cart)</h3>
                  <p className="text-xs text-zinc-500">{cartItems.length} उत्पाद जोड़े गए</p>
                </div>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Delivery Bar */}
            {cartItems.length > 0 && !orderSuccess && (
              <div className="bg-orange-50 px-5 py-3 border-b border-orange-100">
                <div className="flex items-center justify-between text-xs font-bold text-orange-900 mb-1.5">
                  {cartTotal >= freeDeliveryThreshold ? (
                    <span className="flex items-center gap-1.5 text-emerald-700">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      बधाई हो! आपको मुफ्त डिलीवरी मिल रही है
                    </span>
                  ) : (
                    <span>
                      मुफ्त डिलीवरी के लिए ₹{freeDeliveryThreshold - cartTotal} की और खरीदारी करें
                    </span>
                  )}
                  <span>{progressPercent}%</span>
                </div>
                <div className="w-full bg-orange-200/60 h-2 rounded-full overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            )}

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {orderSuccess ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-zinc-900">जय श्री राम! आपका ऑर्डर स्वीकार हो गया है</h3>
                  <p className="text-zinc-600 text-sm max-w-xs">
                    हमारे पुरोहित एवं टीम द्वारा आपकी शुद्ध पूजा सामग्री शीघ्र ही तैयार कर रवाना की जाएगी।
                  </p>
                  <button
                    onClick={() => {
                      setOrderSuccess(false);
                      setIsCartOpen(false);
                    }}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all"
                  >
                    और खरीदारी करें
                  </button>
                </div>
              ) : cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="w-24 h-24 rounded-full bg-orange-50 flex items-center justify-center text-orange-400">
                    <ShoppingBag className="w-12 h-12 stroke-[1.2]" />
                  </div>
                  <h4 className="text-xl font-bold text-zinc-800">आपकी टोकरी खाली है</h4>
                  <p className="text-sm text-zinc-500 max-w-xs">
                    घर में सुख-समृद्धि एवं शांति के लिए 100% शुद्ध पूजा सामग्री व किट चुनें।
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-orange-600/20"
                  >
                    पूजा सामग्री एक्सप्लोर करें
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 p-3.5 bg-[#FFFDF9] border border-orange-100/80 rounded-2xl relative group hover:shadow-md transition-shadow"
                  >
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-orange-50 shrink-0 border border-orange-100">
                      <img
                        src={item.product.imageUrl || '/puja_thali.jpeg'}
                        alt={item.product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-sm text-zinc-900 line-clamp-2 leading-snug">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        {item.product.unit && (
                          <span className="text-[11px] font-semibold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md mt-1 inline-block">
                            {item.product.weight} {item.product.unit}
                          </span>
                        )}
                        {item.product.type === 'BUNDLE' && (
                          <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md mt-1 ml-1 inline-block">
                            ★ सम्पूर्ण किट
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-baseline gap-2">
                          <span className="font-extrabold text-orange-600 text-base">
                            ₹{item.product.price * item.quantity}
                          </span>
                          {item.product.mrp && item.product.mrp > item.product.price && (
                            <span className="text-xs text-zinc-400 line-through">
                              ₹{item.product.mrp * item.quantity}
                            </span>
                          )}
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-2 border border-zinc-200 rounded-lg bg-white px-2 py-1 shadow-sm">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="text-zinc-600 hover:text-orange-600 font-bold"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold text-zinc-900 w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="text-zinc-600 hover:text-orange-600 font-bold"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Coupon input */}
              {cartItems.length > 0 && !orderSuccess && (
                <div className="pt-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="कूपन कोड (उदा. SHUDDH10)"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-zinc-200 rounded-xl text-xs uppercase font-semibold focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <button
                      onClick={applyCoupon}
                      className="bg-zinc-900 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
                    >
                      लागू करें
                    </button>
                  </div>
                  {couponError && <p className="text-xs text-red-500 mt-1 font-medium">{couponError}</p>}
                  {couponSuccess && <p className="text-xs text-emerald-600 mt-1 font-medium">{couponSuccess}</p>}
                </div>
              )}
            </div>

            {/* Footer / Summary */}
            {cartItems.length > 0 && !orderSuccess && (
              <div className="p-5 border-t border-orange-100 bg-[#FFFBF5] space-y-3">
                <div className="space-y-1.5 text-xs text-zinc-600 font-medium">
                  <div className="flex justify-between">
                    <span>कुल मूल्य (MRP):</span>
                    <span className="line-through text-zinc-400">₹{cartMrpTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>हमारी कीमत:</span>
                    <span className="font-semibold text-zinc-900">₹{cartTotal}</span>
                  </div>
                  {totalSavings > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>आपकी बचत:</span>
                      <span>- ₹{totalSavings}</span>
                    </div>
                  )}
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>कूपन छूट:</span>
                      <span>- ₹{appliedDiscount}</span>
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

                <div className="pt-2 border-t border-orange-200 flex justify-between items-baseline">
                  <div>
                    <p className="text-xs text-zinc-500 font-medium">कुल देय राशि</p>
                    <p className="text-2xl font-black text-orange-600">₹{finalTotal}</p>
                  </div>
                  <button
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-orange-600/30 transition-all flex items-center gap-2 group disabled:opacity-75"
                  >
                    {isCheckingOut ? (
                      <span>प्रोसेस हो रहा है...</span>
                    ) : (
                      <>
                        <span>ऑर्डर बुक करें</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>सुरक्षित भुगतान • 100% शुद्ध वैदिक सामग्री की गारंटी</span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
