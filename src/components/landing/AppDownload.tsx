"use client";

import { motion } from "framer-motion";

export default function AppDownload() {
  return (
    <section className="py-16 md:py-24 bg-[#FFFDF9] relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-50/50 rounded-full blur-3xl -z-10"></div>

      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* Left Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="md:w-1/2"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-[2px] bg-orange-600"></div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-zinc-900 tracking-tight">हर घर मंदिर <span className="text-orange-600">ऐप</span></h2>
            </div>
            <p className="text-lg text-zinc-600 mb-10 max-w-md leading-relaxed font-medium">
              पूजा सामग्री खरीदें, पंडित जी बुक करें, 
              ऑर्डर ट्रैक करें और एक्सक्लूसिव ऑफर्स पाएं।
            </p>

            <div className="flex flex-wrap items-center gap-6 mb-8">
              <a href="#" className="hover:scale-105 transition-transform drop-shadow-md">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play Store से प्राप्त करें" className="h-12 md:h-14" />
              </a>
              <a href="#" className="hover:scale-105 transition-transform drop-shadow-md">
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store से डाउनलोड करें" className="h-12 md:h-14" />
              </a>
            </div>

            <div className="flex items-center gap-6 bg-white p-4 rounded-2xl shadow-lg border border-orange-100 max-w-xs group hover:shadow-xl transition-shadow">
              <div className="w-20 h-20 bg-zinc-100 rounded-lg p-2 border border-zinc-200 group-hover:border-orange-300 transition-colors">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://hargharmandir.com" alt="QR Code" className="w-full h-full mix-blend-multiply" />
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-800">डाउनलोड करने के लिए स्कैन करें</p>
                <p className="text-xs text-orange-600 font-semibold mt-1 flex items-center gap-1">
                  अभी ऐप प्राप्त करें
                  <span className="text-lg">➔</span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Phone Mockups */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="md:w-1/2 relative h-[400px] md:h-[500px] w-full"
          >
            {/* Using placeholder div blocks to represent phones if no images */}
            <div className="absolute right-0 top-0 w-2/3 h-full bg-white rounded-[40px] shadow-2xl border-8 border-zinc-900 overflow-hidden transform rotate-6 z-10 hover:rotate-0 transition-transform duration-500">
                <div className="bg-orange-600 h-16 w-full flex items-center justify-center text-white font-bold text-sm shadow-md">हर घर मंदिर ऐप</div>
                <div className="p-4 grid grid-cols-2 gap-4">
                    <div className="bg-orange-50 h-32 rounded-xl"></div>
                    <div className="bg-orange-50 h-32 rounded-xl"></div>
                    <div className="bg-orange-50 h-32 rounded-xl"></div>
                    <div className="bg-orange-50 h-32 rounded-xl"></div>
                </div>
            </div>
            <div className="absolute left-10 top-10 w-2/3 h-[90%] bg-white rounded-[40px] shadow-2xl border-8 border-zinc-900 overflow-hidden transform -rotate-6 z-0 opacity-80 scale-95">
                 <div className="bg-zinc-100 h-16 w-full border-b border-zinc-200"></div>
                 <div className="p-4 space-y-4">
                    <div className="bg-zinc-100 h-12 rounded-lg"></div>
                    <div className="bg-zinc-100 h-12 rounded-lg"></div>
                    <div className="bg-zinc-100 h-12 rounded-lg"></div>
                </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
