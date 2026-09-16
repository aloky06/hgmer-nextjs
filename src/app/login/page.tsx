"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Lock,
  Phone,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Flame,
} from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import GoogleOAuthButton from "@/components/auth/GoogleOAuthButton";

export default function LoginPage() {
  const router = useRouter();
  const { loginUser } = useCart();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      loginUser("sample_jwt_token_12345", {
        id: 101,
        name: emailOrPhone.includes("@") ? emailOrPhone.split("@")[0] : "श्रद्धालु भक्त (Devotee)",
        email: emailOrPhone.includes("@") ? emailOrPhone : "devotee@hargharmandir.com",
        phone: !emailOrPhone.includes("@") ? emailOrPhone : "9876543210",
        role: "CUSTOMER",
      });
      setLoading(false);
      router.push("/account");
    }, 600);
  };



  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[2.5rem] border border-orange-200 shadow-xl p-8 space-y-6 relative overflow-hidden"
      >
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-orange-500/30">
            <Flame className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-zinc-900">हर घर मंदिर में लॉगिन करें</h1>
          <p className="text-xs text-zinc-500">
            अपने पूजा ऑर्डर्स, पंडित बुकिंग एवं पंचांग सेवाओं के लिए प्रवेश करें
          </p>
        </div>

        {/* Google OAuth Button */}
        <GoogleOAuthButton
          label="Google के साथ लॉगिन करें (Continue with Google)"
          onSuccess={() => router.push("/account")}
        />

        <div className="relative flex items-center justify-center">
          <div className="border-t border-zinc-200 w-full" />
          <span className="bg-white px-3 text-[11px] font-bold text-zinc-400 uppercase tracking-wider absolute">
            या ईमेल / पासवर्ड से
          </span>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-zinc-700 block mb-1">
              ईमेल या मोबाइल नंबर *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="उदा. rahul@gmail.com या 9876543210"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 text-xs border border-zinc-200 rounded-xl focus:outline-none focus:border-orange-500"
              />
              <User className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-700 block mb-1">
              पासवर्ड *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 text-xs border border-zinc-200 rounded-xl focus:outline-none focus:border-orange-500"
              />
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-black py-3.5 rounded-xl text-xs shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 transition-all"
          >
            {loading ? (
              <span>लॉगिन हो रहा है...</span>
            ) : (
              <>
                <span>लॉगिन करें (Login)</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-zinc-600 space-y-2">
          <p>
            खाता नहीं है?{" "}
            <Link href="/register" className="font-bold text-orange-600 hover:underline">
              नया खाता बनाएं
            </Link>
          </p>
          <p>
            <Link href="/admin/login" className="text-zinc-400 hover:text-zinc-600">
              एडमिन / पंडित पोर्टल लॉगिन →
            </Link>
          </p>
        </div>


      </motion.div>
    </div>
  );
}
