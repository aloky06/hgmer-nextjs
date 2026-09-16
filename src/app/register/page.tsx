"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Lock,
  Phone,
  Mail,
  ArrowRight,
  Flame,
} from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import GoogleOAuthButton from "@/components/auth/GoogleOAuthButton";

export default function RegisterPage() {
  const router = useRouter();
  const { loginUser } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      loginUser("sample_jwt_token_new_devotee", {
        id: Date.now(),
        name,
        email,
        phone,
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
          <h1 className="text-2xl font-black text-zinc-900">नया खाता बनाएं</h1>
          <p className="text-xs text-zinc-500">
            हर घर मंदिर परिवार से जुड़ें और शुद्ध आध्यात्मिक सेवाओं का लाभ लें
          </p>
        </div>

        {/* Google OAuth Button */}
        <GoogleOAuthButton
          label="Google से 1-क्लिक में खाता बनाएं"
          onSuccess={() => router.push("/account")}
        />

        <div className="relative flex items-center justify-center">
          <div className="border-t border-zinc-200 w-full" />
          <span className="bg-white px-3 text-[11px] font-bold text-zinc-400 uppercase tracking-wider absolute">
            या विवरण भरकर पंजीकरण करें
          </span>
        </div>

        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-zinc-700 block mb-1">
              पूरा नाम *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="उदा. राहुल शर्मा"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 text-xs border border-zinc-200 rounded-xl focus:outline-none focus:border-orange-500"
              />
              <User className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-700 block mb-1">
              ईमेल पता *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="उदा. rahul@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 text-xs border border-zinc-200 rounded-xl focus:outline-none focus:border-orange-500"
              />
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-700 block mb-1">
              मोबाइल नंबर *
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 text-xs border border-zinc-200 rounded-xl focus:outline-none focus:border-orange-500"
              />
              <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
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
                placeholder="कम से कम 6 अक्षर"
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
              <span>खाता बन रहा है...</span>
            ) : (
              <>
                <span>खाता बनाएं (Register)</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-zinc-600">
          <p>
            पहले से खाता है?{" "}
            <Link href="/login" className="font-bold text-orange-600 hover:underline">
              लॉगिन करें
            </Link>
          </p>
        </div>


      </motion.div>
    </div>
  );
}
