"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Package,
  Calendar,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function OrdersPage() {
  const { orders } = useCart();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return (
          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-xs font-black">
            <CheckCircle2 className="w-3.5 h-3.5" />
            डिलीवर हो गया (Delivered)
          </span>
        );
      case "SHIPPED":
        return (
          <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full text-xs font-black">
            <Truck className="w-3.5 h-3.5" />
            रास्ते में है (Shipped)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-orange-700 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full text-xs font-black">
            <Clock className="w-3.5 h-3.5" />
            पुष्टि हुई (Confirmed)
          </span>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-10 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">
          मेरे <span className="font-light italic text-orange-600">ऑर्डर (My Orders)</span>
        </h1>
        <p className="text-xs md:text-sm text-zinc-500 mt-1">
          अपने सभी पूर्व एवं वर्तमान पूजा सामग्री ऑर्डर्स की स्थिति व ट्रैकिंग देखें
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-orange-100 shadow-sm text-center max-w-lg mx-auto">
          <div className="w-20 h-20 rounded-full bg-orange-50 text-orange-400 flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 stroke-[1.2]" />
          </div>
          <h3 className="text-xl font-black text-zinc-900 mb-1">आपने अभी तक कोई ऑर्डर नहीं दिया है</h3>
          <p className="text-xs text-zinc-500 mb-6">
            100% शुद्ध पूजा सामग्री, किट एवं अनुष्ठान बॉक्स खरीदने के लिए ई-शॉप देखें।
          </p>
          <Link
            href="/shop"
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-3 rounded-xl text-xs transition-colors inline-flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            पूजा सामग्री खरीदें
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, idx) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-3xl border border-orange-200 shadow-md p-6 md:p-8 hover:shadow-xl transition-all"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-orange-100">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-base text-zinc-900">
                      ऑर्डर #{order.orderNumber}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-500 font-semibold mt-1">
                    <Calendar className="w-3.5 h-3.5 text-orange-600" />
                    <span>दिनांक: {order.date}</span>
                    <span>•</span>
                    <span>भुगतान: {order.paymentMethod}</span>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-zinc-500 font-bold block">कुल राशि</span>
                  <span className="text-xl font-black text-orange-600">
                    ₹{order.totalAmount}
                  </span>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="py-4 space-y-3">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-4 bg-[#FFFDF9] p-3 rounded-2xl border border-orange-100/60"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-orange-50 p-1 shrink-0 border border-orange-100 flex items-center justify-center">
                        <img
                          src={item.product.imageUrl || "/puja_thali.jpeg"}
                          alt={item.product.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs md:text-sm text-zinc-900 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <span className="text-[11px] text-zinc-500 font-medium">
                          मात्रा: {item.quantity} इकाई (₹{item.product.price} प्रति इकाई)
                        </span>
                      </div>
                    </div>
                    <span className="font-black text-xs md:text-sm text-zinc-900 shrink-0">
                      ₹{item.product.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Footer & Action */}
              <div className="pt-4 border-t border-orange-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <p className="text-zinc-600 line-clamp-1">
                  <strong>डिलिवरी पता:</strong> {order.shippingAddress}
                </p>

                <Link
                  href={`/orders/${order.id}`}
                  className="bg-zinc-900 hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <span>विस्तृत विवरण व रसीद</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
