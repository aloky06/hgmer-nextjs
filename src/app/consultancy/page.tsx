"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Award,
  Star,
  CalendarCheck,
  Clock,
} from "lucide-react";
import { fetchConsultancyServices, ConsultancyService } from "@/lib/api";
import { useCart } from "@/context/CartContext";

export default function ConsultancyPage() {
  const { showToast } = useCart();
  const [services, setServices] = useState<ConsultancyService[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [bookingName, setBookingName] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingDob, setBookingDob] = useState("");
  const [bookingTob, setBookingTob] = useState("");
  const [bookingPob, setBookingPob] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConsultancyServices().then((data) => {
      setServices(data);
      setLoading(false);
    });
  }, []);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    showToast("✓ आपका परामर्श अनुरोध स्वीकार कर लिया गया है। आचार्य जी शीघ्र संपर्क करेंगे।");
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-10 max-w-6xl">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#3B1917] via-[#5C231C] to-[#2A0E0B] text-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden text-center mb-12 border border-orange-800/40"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="w-16 h-16 rounded-3xl bg-orange-500/20 text-amber-300 flex items-center justify-center mx-auto mb-4 border border-orange-400/30">
          <Award className="w-8 h-8" />
        </div>

        <span className="text-xs font-black uppercase tracking-widest text-orange-300 bg-orange-950/60 px-4 py-1.5 rounded-full inline-block mb-3 border border-orange-500/30">
          काशी व हरिद्वार के वरिष्ठ ज्योतिषाचार्य (Backend Live)
        </span>

        <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3">
          वैदिक <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-amber-200">ज्योतिष एवं वास्तु परामर्श</span>
        </h1>

        <p className="text-xs md:text-sm text-orange-200/80 max-w-xl mx-auto">
          अपने जीवन, करियर, विवाह एवं वास्तु से जुड़े प्रश्नों का 100% प्रामाणिक शास्त्रों के अनुसार सटीक उत्तर व सरल उपाय पाएं।
        </p>
      </motion.div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
        {services.map((svc, idx) => (
          <motion.div
            key={svc.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05, duration: 0.5 }}
            className="bg-white rounded-3xl p-6 border border-orange-200 shadow-lg shadow-orange-950/5 hover:shadow-2xl hover:shadow-orange-900/10 transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="w-full h-44 rounded-2xl overflow-hidden bg-orange-50 mb-4 border border-orange-100">
                <img
                  src={svc.imageUrl || "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&fit=crop"}
                  alt={svc.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <h3 className="text-base font-black text-zinc-900 group-hover:text-orange-600 transition-colors mb-2 leading-snug">
                {svc.title}
              </h3>

              <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                {svc.description}
              </p>
            </div>

            <div className="pt-4 border-t border-orange-100 flex items-center justify-between">
              <div>
                <span className="text-xl font-black text-orange-600">₹{svc.price}</span>
                <span className="text-[10px] text-emerald-600 font-bold block">100% गोपनीय</span>
              </div>

              <button
                onClick={() => {
                  setSelectedService(svc);
                  setBookingSuccess(false);
                }}
                className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-orange-600/20 flex items-center gap-1.5"
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                परामर्श बुक करें
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Booking Form Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full border border-orange-200 shadow-2xl relative"
          >
            <button
              onClick={() => setSelectedService(null)}
              className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 flex items-center justify-center absolute top-4 right-4 text-sm"
            >
              ✕
            </button>

            {bookingSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl font-bold">
                  ✓
                </div>
                <h3 className="text-2xl font-black text-zinc-900">परामर्श अनुरोध स्वीकार हुआ!</h3>
                <p className="text-xs text-zinc-600 max-w-xs mx-auto">
                  आचार्य जी 24 घंटे के भीतर आपके द्वारा दिए गए नंबर पर संपर्क कर समय निर्धारित करेंगे।
                </p>
                <button
                  onClick={() => setSelectedService(null)}
                  className="bg-orange-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs"
                >
                  पूर्ण करें
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <h3 className="font-black text-base text-zinc-900">{selectedService.title}</h3>
                  <p className="text-xs text-orange-600 font-bold">परामर्श शुल्क: ₹{selectedService.price}</p>
                </div>

                <form onSubmit={handleBookingSubmit} className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-zinc-700 block mb-1">आपका पूरा नाम *</label>
                    <input
                      type="text"
                      required
                      placeholder="उदा. राहुल शर्मा"
                      value={bookingName}
                      onChange={(e) => setBookingName(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs border border-zinc-200 rounded-xl focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-700 block mb-1">मोबाइल नंबर (WhatsApp) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={bookingPhone}
                      onChange={(e) => setBookingPhone(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs border border-zinc-200 rounded-xl focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-zinc-700 block mb-1">जन्म तिथि (DOB)</label>
                      <input
                        type="date"
                        value={bookingDob}
                        onChange={(e) => setBookingDob(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs border border-zinc-200 rounded-xl focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-zinc-700 block mb-1">जन्म समय (TOB)</label>
                      <input
                        type="time"
                        value={bookingTob}
                        onChange={(e) => setBookingTob(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs border border-zinc-200 rounded-xl focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-700 block mb-1">जन्म स्थान (शहर / राज्य)</label>
                    <input
                      type="text"
                      placeholder="उदा. वाराणसी, उत्तर प्रदेश"
                      value={bookingPob}
                      onChange={(e) => setBookingPob(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs border border-zinc-200 rounded-xl focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold py-3 rounded-xl text-xs shadow-lg mt-2"
                  >
                    परामर्श की पुष्टि करें (₹{selectedService.price})
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
