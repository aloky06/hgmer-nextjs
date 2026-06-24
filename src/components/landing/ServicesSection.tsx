"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";

const services = [
  {
    title: "पंडित जी बुकिंग",
    desc: "अनुभवी पंडित जी आपके द्वार।\nघर, मंदिर या ऑनलाइन पूजा।",
    points: ["घर पर पूजा", "ऑनलाइन पूजा", "मंदिर पूजा"],
    btnText: "पंडित जी बुक करें",
    img: "/pandi_ji.jpeg",
    bg: "bg-gradient-to-br from-[#FDF6ED] to-[#FAF0E1]",
    borderColor: "border-orange-200",
  },
  {
    title: "पूजा सामग्री",
    desc: "हर पूजा के लिए संपूर्ण सामग्री एक ही जगह।",
    points: [],
    btnText: "अभी खरीदें",
    img: "/puja_thali.jpeg",
    bg: "bg-gradient-to-br from-[#FFF4E6] to-[#FFE7CC]",
    borderColor: "border-orange-300",
  }
];

export default function ServicesSection() {
  return (
    <section className="py-24 bg-[#FFFDF9] relative">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-center gap-6 mb-16 relative">
          <div className="absolute left-0 w-[20%] md:w-[35%] h-[1px] bg-gradient-to-r from-transparent to-orange-300"></div>
          <h2 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight px-6 z-10 bg-[#FFFDF9]">
            हमारी <span className="font-light italic text-orange-600">सेवाएँ</span>
          </h2>
          <div className="absolute right-0 w-[20%] md:w-[35%] h-[1px] bg-gradient-to-l from-transparent to-orange-300"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.2, duration: 0.8, ease: "easeOut" }}
              className={`${service.bg} rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between overflow-hidden relative group hover:shadow-2xl hover:shadow-orange-900/15 transition-all duration-500 border border-white shadow-lg`}
            >
              {/* Inner Decorative Frame */}
              <div className={`absolute inset-4 rounded-[1.5rem] border ${service.borderColor} opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none`}></div>

              <div className="relative z-10 w-2/3 lg:w-3/4">
                <h3 className="text-3xl font-black text-zinc-900 mb-4 tracking-tight drop-shadow-sm">{service.title}</h3>
                <p className="text-[15px] text-zinc-700 mb-6 whitespace-pre-line leading-relaxed font-medium">{service.desc}</p>
                
                {service.points.length > 0 && (
                  <ul className="mb-8 space-y-3">
                    {service.points.map((pt, i) => (
                      <li key={i} className="flex items-center gap-3 text-[15px] text-zinc-800 font-bold bg-white/40 w-fit px-3 py-1.5 rounded-lg border border-white/60 shadow-sm">
                        <Check className="w-4 h-4 text-orange-600 stroke-[3]" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                )}

                <button className="bg-zinc-900 hover:bg-orange-600 text-white px-8 py-3.5 rounded-full font-bold text-[15px] transition-all shadow-xl hover:shadow-orange-600/40 mt-auto inline-flex items-center gap-2 group/btn relative overflow-hidden">
                  <span className="relative z-10">{service.btnText}</span>
                  <ArrowRight className="w-4 h-4 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-orange-600 translate-y-[100%] group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
                </button>
              </div>

              {/* Image positioned absolute to the right bottom */}
              <div className="absolute -bottom-8 -right-8 w-[55%] h-[85%] group-hover:scale-110 group-hover:-translate-y-4 group-hover:-translate-x-4 transition-all duration-700 ease-out">
                {/* Decorative glow behind image */}
                <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full scale-150"></div>
                <img src={service.img} alt={service.title} className="w-full h-full object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.2)] relative z-10" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
