"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Truck,
  Clock,
  Users,
  MapPin,
  PhoneCall,
  Mail,
  Sparkles,
  Heart,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function FooterBadges() {
  const { showToast } = useCart();
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const badges = [
    { icon: ShieldCheck, title: "100% प्रामाणिक", subtitle: "शास्त्र सम्मत शुद्ध सामग्री" },
    { icon: Truck, title: "अखिल भारतीय डिलीवरी", subtitle: "सुरक्षित व स्वच्छ पैकिंग" },
    { icon: Clock, title: "24x7 पंडित सहायता", subtitle: "विशेषज्ञ पुरोहित परामर्श" },
    { icon: Users, title: "10 लाख+ श्रद्धालु", subtitle: "भरोसेमंद आध्यात्मिक सेवा" },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    showToast("✓ धन्यवाद! कूपन कोड SHUDDH10 आपके ईमेल पर भेजा गया है।");
    setNewsletterEmail("");
  };

  return (
    <footer className="bg-[#2A1311] text-white border-t border-orange-950/40 relative overflow-hidden">
      {/* Top Trust Badges Bar */}
      <div className="border-b border-white/10 py-8 bg-[#3B1917]/80 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {badges.map((badge, idx) => (
              <div key={idx} className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400 group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                  <badge.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm leading-tight">{badge.title}</h4>
                  <p className="text-xs text-orange-200/70 mt-0.5">{badge.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Multi-Column Footer */}
      <div className="container mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <img
                src="/hgmr.png"
                alt="Har Ghar Mandir"
                className="h-14 w-auto object-contain brightness-110"
              />
            </Link>
            <p className="text-xs md:text-sm text-zinc-300 leading-relaxed max-w-sm">
              <strong>हर घर मंदिर</strong> - भारत का अग्रणी आध्यात्मिक मंच। हमारा ध्येय हर घर में शास्त्रोक्त शुद्ध पूजन सामग्री पहुँचाना और विद्वान पुरोहितों के माध्यम से सनातन परंपरा का विस्तार करना है।
            </p>
            <div className="pt-2 text-xs text-zinc-400 space-y-1.5">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span>बाबतपुर, वाराणसी (काशी), उत्तर प्रदेश - 221006</span>
              </p>
              <p className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span>+91 63637 77534 / +91 98765 43210</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span>support@hargharmandir.com</span>
              </p>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-white tracking-wider uppercase border-b border-orange-500/30 pb-2 inline-block">
              पूजा सामग्री
            </h4>
            <ul className="space-y-2 text-xs text-zinc-300">
              <li><a href="#products-section" className="hover:text-orange-400 transition-colors">दैनिक पूजा सामग्री</a></li>
              <li><a href="#kits-section" className="hover:text-orange-400 transition-colors">सम्पूर्ण पूजा किट (Combo)</a></li>
              <li><a href="#products-section" className="hover:text-orange-400 transition-colors">हस्तनिर्मित पीतल थाली</a></li>
              <li><a href="#products-section" className="hover:text-orange-400 transition-colors">भीमसेनी शुद्ध कपूर</a></li>
              <li><a href="#products-section" className="hover:text-orange-400 transition-colors">हवन एवं समिधा पैकेट</a></li>
            </ul>
          </div>

          {/* Col 3: Services & Booking */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-white tracking-wider uppercase border-b border-orange-500/30 pb-2 inline-block">
              धार्मिक सेवाएं
            </h4>
            <ul className="space-y-2 text-xs text-zinc-300">
              <li><a href="#pandits-section" className="hover:text-orange-400 transition-colors">पंडित जी बुकिंग (घर पर)</a></li>
              <li><a href="#vidhi-section" className="hover:text-orange-400 transition-colors">सत्यनारायण पूजा विधि</a></li>
              <li><a href="#festivals-section" className="hover:text-orange-400 transition-colors">त्यौहार विशेष अनुष्ठान</a></li>
              <li><Link href="/register-pandit" className="hover:text-orange-400 transition-colors">पंडित जी के रूप में जुड़ें</Link></li>
              <li><Link href="/admin/login" className="hover:text-orange-400 transition-colors">एडमिन डैशबोर्ड</Link></li>
            </ul>
          </div>

          {/* Col 4: Newsletter & Discount */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-white tracking-wider uppercase border-b border-orange-500/30 pb-2 inline-block">
              विशेष 10% छूट पाएं
            </h4>
            <p className="text-xs text-zinc-300 leading-relaxed">
              हमारे साप्ताहिक पंचांग, त्यौहार अधिसूचना व विशेष छूट कूपन प्राप्त करने हेतु ईमेल दर्ज करें।
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                placeholder="आपका ईमेल पता"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                className="w-full bg-zinc-900 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-orange-500"
              />
              <button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md"
              >
                <span>सब्सक्राइब करें</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-white/10 py-6 text-center text-xs text-zinc-400">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} हर घर मंदिर (Har Ghar Mandir). सर्वाधिकार सुरक्षित।</p>
          <p className="flex items-center justify-center gap-1">
            <span>पवित्र भाव एवं समर्पण के साथ निर्मित</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
          </p>
        </div>
      </div>
    </footer>
  );
}
