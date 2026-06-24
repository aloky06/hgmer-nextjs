"use client";

import { ShieldCheck, Truck, Clock, Users } from "lucide-react";

export default function FooterBadges() {
  const badges = [
    { icon: ShieldCheck, title: "100% सुरक्षित", subtitle: "भुगतान" },
    { icon: Truck, title: "पूरे भारत में", subtitle: "डिलीवरी" },
    { icon: Clock, title: "24x7", subtitle: "ग्राहक सेवा" },
    { icon: Users, title: "लाखों का", subtitle: "भरोसा" },
  ];

  return (
    <div className="bg-[#FFFDF9] py-10 border-t border-orange-100">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-wrap justify-between items-center gap-6">
          {badges.map((badge, idx) => (
            <div key={idx} className="flex items-center gap-4 flex-1 min-w-[200px] justify-center md:justify-start">
              <div className="w-12 h-12 rounded-full border-2 border-orange-200 flex items-center justify-center text-orange-600 bg-white shadow-sm hover:scale-110 hover:border-orange-400 hover:bg-orange-50 transition-all duration-300">
                <badge.icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 leading-tight">{badge.title}</h4>
                <p className="text-sm text-zinc-500">{badge.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
