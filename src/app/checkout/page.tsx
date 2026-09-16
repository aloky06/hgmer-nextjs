"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cartItems,
    cartTotal,
    cartMrpTotal,
    totalSavings,
    placeOrder,
    savedAddresses,
    addSavedAddress,
    user,
    openAuthModal,
  } = useCart();

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("Varanasi");
  const [state, setState] = useState("Uttar Pradesh");
  const [pincode, setPincode] = useState("221006");
  const [paymentMethod, setPaymentMethod] = useState<string>("COD");
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (!user) {
      openAuthModal('LOGIN', {
        type: 'CHECKOUT',
        message: 'चेकआउट एवं आर्डर पूरा करने के लिए कृपया लॉगिन करें।',
      });
    } else {
      if (user.name && !name) setName(user.name);
      if (user.phone && !phone) setPhone(user.phone);
    }
  }, [user]);

  const freeDeliveryThreshold = 499;
  const deliveryCharge = cartTotal >= freeDeliveryThreshold ? 0 : 49;
  const finalTotal = cartTotal + deliveryCharge;

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 md:px-8 py-16 text-center max-w-lg">
        <h2 className="text-2xl font-black text-zinc-900 mb-2">आपकी टोकरी में कोई उत्पाद नहीं है</h2>
        <p className="text-xs text-zinc-500 mb-6">कृपया चेकआउट करने से पहले सामग्री जोड़ें।</p>
        <Link
          href="/shop"
          className="bg-orange-600 text-white font-bold px-6 py-3 rounded-xl text-xs inline-block"
        >
          दुकान (Shop) पर जाएं
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const fullAddress = `${name}, Ph: ${phone}, ${addressLine}, ${city}, ${state} - ${pincode}`;
    addSavedAddress(fullAddress);

    setTimeout(() => {
      const createdOrder = placeOrder(fullAddress, paymentMethod === "COD" ? "Cash on Delivery (कैश ऑन डिलीवरी)" : "Online UPI / NetBanking", 0);
      setIsSubmitting(false);
      router.push(`/orders/${createdOrder.id}`);
    }, 1200);
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-10 max-w-5xl">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-xs font-bold text-zinc-600 hover:text-orange-600 mb-6 bg-white border border-orange-200 px-4 py-2 rounded-xl shadow-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>टोकरी (Cart) पर वापस जाएं</span>
      </button>

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">
          सुरक्षित <span className="font-light italic text-orange-600">चेकआउट (Secure Checkout)</span>
        </h1>
        <p className="text-xs md:text-sm text-zinc-500 mt-1">
          कृपया डिलीवरी का पता एवं भुगतान विकल्प दर्ज करें
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Form: Address & Payment (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Address Form Card */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-orange-200 shadow-md space-y-4">
            <h3 className="font-black text-base text-zinc-900 flex items-center gap-2 pb-3 border-b border-orange-100">
              <MapPin className="w-5 h-5 text-orange-600" />
              डिलीवरी का पता (Shipping Address)
            </h3>

            {/* Quick selection of saved address */}
            {savedAddresses.length > 0 && (
              <div className="bg-orange-50/60 p-3.5 rounded-2xl border border-orange-100 mb-2">
                <span className="text-[11px] font-bold text-orange-800 uppercase tracking-wider block mb-1.5">
                  पहले से सहेजा गया पता:
                </span>
                <p className="text-xs text-zinc-700 font-medium">
                  {savedAddresses[0]}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  पूरा नाम (Full Name) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा. अमित कुमार शर्मा"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs border border-zinc-200 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  मोबाइल नंबर (Mobile Number) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs border border-zinc-200 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1">
                घर / फ्लैट नं, सड़क, मोहल्ला (Street Address) *
              </label>
              <input
                type="text"
                required
                placeholder="उदा. मकान नं 45, संकट मोचन रोड"
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs border border-zinc-200 rounded-xl focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  शहर (City) *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs border border-zinc-200 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  राज्य (State) *
                </label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs border border-zinc-200 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  पिनकोड (Pincode) *
                </label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs border border-zinc-200 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-orange-200 shadow-md space-y-4">
            <h3 className="font-black text-base text-zinc-900 flex items-center gap-2 pb-3 border-b border-orange-100">
              <CreditCard className="w-5 h-5 text-orange-600" />
              भुगतान का विकल्प (Payment Method)
            </h3>

            <div className="space-y-3">
              <label
                onClick={() => setPaymentMethod("COD")}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === "COD"
                    ? "border-orange-600 bg-orange-50/60 shadow-sm"
                    : "border-zinc-200 hover:border-orange-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    className="w-4 h-4 text-orange-600 accent-orange-600"
                  />
                  <div>
                    <h4 className="font-bold text-xs md:text-sm text-zinc-900">
                      कैश ऑन डिलीवरी (Cash on Delivery)
                    </h4>
                    <p className="text-[11px] text-zinc-500">
                      सामग्री प्राप्त होने पर नकद या UPI द्वारा भुगतान करें
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                  अत्यंत लोकप्रिय
                </span>
              </label>

              <label
                onClick={() => setPaymentMethod("ONLINE")}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === "ONLINE"
                    ? "border-orange-600 bg-orange-50/60 shadow-sm"
                    : "border-zinc-200 hover:border-orange-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "ONLINE"}
                    onChange={() => setPaymentMethod("ONLINE")}
                    className="w-4 h-4 text-orange-600 accent-orange-600"
                  />
                  <div>
                    <h4 className="font-bold text-xs md:text-sm text-zinc-900">
                      ऑनलाइन UPI / GooglePay / PhonePe / कार्ड
                    </h4>
                    <p className="text-[11px] text-zinc-500">
                      त्वरित व 100% सुरक्षित ऑनलाइन भुगतान
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-orange-700 bg-orange-100 px-2.5 py-1 rounded-md">
                  सुरक्षित
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Summary Box (1 col) */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-orange-200 shadow-md space-y-4">
            <h3 className="font-black text-base text-zinc-900 pb-3 border-b border-orange-100">
              ऑर्डर में शामिल सामग्री ({cartItems.length})
            </h3>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between gap-2 text-xs py-1 border-b border-zinc-100"
                >
                  <span className="line-clamp-1 text-zinc-800 font-semibold">
                    {item.product.name} (x{item.quantity})
                  </span>
                  <span className="font-black text-orange-600 shrink-0">
                    ₹{item.product.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs font-semibold text-zinc-600 pt-2 border-t border-zinc-100">
              <div className="flex justify-between">
                <span>सामग्री कुल:</span>
                <span>₹{cartTotal}</span>
              </div>
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

            <div className="pt-3 border-t border-orange-200 flex justify-between items-baseline">
              <span className="text-sm font-black text-zinc-900">कुल देय राशि:</span>
              <span className="text-2xl font-black text-orange-600">₹{finalTotal}</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-black py-4 px-4 rounded-2xl text-xs md:text-sm transition-all shadow-xl shadow-orange-600/30 flex items-center justify-center gap-2 disabled:opacity-75"
            >
              {isSubmitting ? (
                <span>ऑर्डर प्रोसेस हो रहा है...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ऑर्डर की पुष्टि करें (Place Order)</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>हर घर मंदिर प्रामाणिक वैदिक गारंटी</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
