"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Package,
  Calendar,
  Truck,
  CheckCircle2,
  Clock,
  ArrowLeft,
  MapPin,
  CreditCard,
  PhoneCall,
  ShieldCheck,
  Printer,
} from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { orders } = useCart();

  const order = orders.find((o) => String(o.id) === String(params.id)) || orders[0] || {
    id: 1001,
    orderNumber: "HGM-2026-9812",
    date: "05 Sep 2026",
    items: [
      {
        product: {
          id: 101,
          name: "सत्यनारायण महापूजा सम्पूर्ण किट (All-in-One Box)",
          description: "सत्यनारायण कथा के लिए आवश्यक 32 सामग्रियां",
          price: 899,
          mrp: 1299,
          imageUrl: "/havan_set.jpeg",
        },
        quantity: 1,
      },
    ],
    subtotal: 899,
    discount: 90,
    deliveryCharge: 0,
    totalAmount: 809,
    status: "CONFIRMED",
    shippingAddress: "Rahul Sharma, Ph: 9876543210, Babatpur, Varanasi, Uttar Pradesh - 221006",
    paymentMethod: "Cash on Delivery (कैश ऑन डिलीवरी)",
  };

  const timelineSteps = [
    { label: "ऑर्डर प्राप्त हुआ (Placed)", desc: "ऑर्डर सफलतापूर्वक दर्ज", done: true },
    {
      label: "पैकिंग व वैदिक शुद्धि (Processing)",
      desc: "सामग्रियों की पवित्र पैकिंग जारी",
      done: true,
    },
    {
      label: "कूरियर रवाना (Shipped)",
      desc: "डिलिवरी पार्टनर को सौंपा गया",
      done: order.status === "SHIPPED" || order.status === "DELIVERED",
    },
    {
      label: "सफलतापूर्वक डिलीवर (Delivered)",
      desc: "आपके द्वार पर पहुंच गया",
      done: order.status === "DELIVERED",
    },
  ];

  return (
    <div className="container mx-auto px-4 md:px-8 py-10 max-w-4xl">
      {/* Back button */}
      <button
        onClick={() => router.push("/orders")}
        className="inline-flex items-center gap-2 text-xs font-bold text-zinc-600 hover:text-orange-600 mb-6 bg-white border border-orange-200 px-4 py-2 rounded-xl shadow-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>मेरे सभी ऑर्डर्स पर वापस जाएं</span>
      </button>

      {/* Main Order Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] border border-orange-200 shadow-xl overflow-hidden p-6 md:p-10 space-y-8"
      >
        {/* Order Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-orange-100">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-orange-600 bg-orange-100 px-3 py-1 rounded-full inline-block mb-2">
              ऑर्डर विवरण (Order Receipt)
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-zinc-900">
              ऑर्डर #{order.orderNumber}
            </h1>
            <p className="text-xs text-zinc-500 font-medium mt-1 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-orange-600" />
              <span>ऑर्डर दिनांक: {order.date}</span>
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="self-start sm:self-auto bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>रसीद प्रिंट करें</span>
          </button>
        </div>

        {/* Live Tracking Timeline */}
        <div className="bg-[#FFFDF9] p-6 rounded-3xl border border-orange-100">
          <h3 className="text-sm font-black text-zinc-900 mb-6 flex items-center gap-2">
            <Truck className="w-4 h-4 text-orange-600" />
            ऑर्डर स्थिति ट्रैकर (Live Tracking)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
            {timelineSteps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                    step.done
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                      : "bg-zinc-200 text-zinc-500"
                  }`}
                >
                  {step.done ? "✓" : idx + 1}
                </div>
                <div>
                  <h4 className={`text-xs font-bold leading-tight ${step.done ? "text-zinc-900" : "text-zinc-400"}`}>
                    {step.label}
                  </h4>
                  <p className="text-[10px] text-zinc-500 mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ordered Items List */}
        <div>
          <h3 className="text-sm font-black text-zinc-900 mb-4 flex items-center gap-2">
            <Package className="w-4 h-4 text-orange-600" />
            सामग्री सूची (Items Ordered)
          </h3>

          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-orange-100 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-orange-50 p-1 shrink-0 border border-orange-100 flex items-center justify-center">
                    <img
                      src={item.product.imageUrl || "/puja_thali.jpeg"}
                      alt={item.product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs md:text-sm text-zinc-900">
                      {item.product.name}
                    </h4>
                    <p className="text-[11px] text-zinc-500">
                      मात्रा: {item.quantity} इकाई @ ₹{item.product.price}
                    </p>
                  </div>
                </div>

                <span className="font-black text-sm text-zinc-900">
                  ₹{item.product.price * item.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Address and Payment Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-orange-100">
          <div className="bg-[#FFFBF5] p-5 rounded-2xl border border-orange-100">
            <h4 className="text-xs font-bold text-orange-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-orange-600" />
              डिलीवरी का पता:
            </h4>
            <p className="text-xs text-zinc-700 font-medium leading-relaxed">
              {order.shippingAddress}
            </p>
          </div>

          <div className="bg-[#FFFBF5] p-5 rounded-2xl border border-orange-100">
            <h4 className="text-xs font-bold text-orange-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-orange-600" />
              भुगतान का प्रकार:
            </h4>
            <p className="text-xs text-zinc-700 font-medium">{order.paymentMethod}</p>
            <p className="text-[11px] text-emerald-700 font-bold mt-1">
              स्थिति: पुष्टि हो गई (Confirmed)
            </p>
          </div>
        </div>

        {/* Invoice Summary */}
        <div className="bg-zinc-900 text-white rounded-3xl p-6 space-y-2 text-xs">
          <div className="flex justify-between text-zinc-300">
            <span>सामग्री कुल (Subtotal):</span>
            <span>₹{order.subtotal || order.totalAmount}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-400 font-bold">
              <span>कूपन छूट (Discount):</span>
              <span>- ₹{order.discount}</span>
            </div>
          )}
          <div className="flex justify-between text-zinc-300">
            <span>डिलीवरी शुल्क:</span>
            <span>
              {order.deliveryCharge === 0 ? "मुफ्त (FREE)" : `₹${order.deliveryCharge}`}
            </span>
          </div>
          <div className="pt-2 border-t border-zinc-700 flex justify-between text-sm font-black">
            <span>कुल भुगतान राशि:</span>
            <span className="text-orange-400 text-lg font-black">₹{order.totalAmount}</span>
          </div>
        </div>

        {/* Helpline CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs text-zinc-600">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-orange-600" />
            <span>ऑर्डर से सम्बंधित किसी भी सहायता के लिए कॉल करें: 98765-43210</span>
          </div>
          <Link
            href="/shop"
            className="bg-orange-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-orange-700 transition-colors"
          >
            और खरीदारी करें
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
