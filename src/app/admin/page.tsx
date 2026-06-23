"use client";

import { useEffect, useState } from "react";
import { PackageSearch, ShoppingCart, Warehouse, Users, TrendingUp, AlertCircle } from "lucide-react";
import api from "@/lib/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    warehouses: 0,
    orders: 0,
    pandits: 0
  });

  useEffect(() => {
    // In a real app, you would have a /stats endpoint.
    // For now, we'll fetch basic counts by parallel requests
    const fetchStats = async () => {
      try {
        const [prodRes, wareRes, panditRes] = await Promise.all([
          api.get("/products"),
          api.get("/inventory/warehouses"),
          api.get("/pandits/pending")
        ]);
        setStats({
          products: prodRes.data.length || 0,
          warehouses: wareRes.data.length || 0,
          pandits: panditRes.data.length || 0,
          orders: 3 // Mocked for now
        });
      } catch (err) {
        console.error("Error fetching stats", err);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { title: "Total Products", value: stats.products, icon: <PackageSearch size={24} className="text-blue-500" />, bg: "bg-blue-50", border: "border-blue-100" },
    { title: "Active Orders", value: stats.orders, icon: <ShoppingCart size={24} className="text-emerald-500" />, bg: "bg-emerald-50", border: "border-emerald-100" },
    { title: "Dark Stores", value: stats.warehouses, icon: <Warehouse size={24} className="text-purple-500" />, bg: "bg-purple-50", border: "border-purple-100" },
    { title: "Pending Pandits", value: stats.pandits, icon: <Users size={24} className="text-amber-500" />, bg: "bg-amber-50", border: "border-amber-100" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, Admin</h1>
        <p className="text-gray-500 mt-1">Here is what's happening with your platform today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((c, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{c.title}</p>
                <h3 className="text-3xl font-bold text-gray-900">{c.value}</h3>
              </div>
              <div className={`w-12 h-12 rounded-full ${c.bg} border ${c.border} flex items-center justify-center`}>
                {c.icon}
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-emerald-600 font-medium">
              <TrendingUp size={16} className="mr-1" />
              <span>+2.5%</span>
              <span className="text-gray-400 font-normal ml-2">vs last week</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Orders</h2>
          <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
            <p className="text-gray-500 font-medium flex items-center">
              <AlertCircle size={18} className="mr-2" />
              No recent orders found.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Low Stock Alerts</h2>
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-red-50 text-red-700 rounded-lg border border-red-100">
              <AlertCircle size={20} className="mr-3 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm">Brass Diya</p>
                <p className="text-xs">Only 2 units left in Varanasi Hub</p>
              </div>
            </div>
            <div className="flex items-center justify-center h-40 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
              <p className="text-gray-500 font-medium text-sm">No other alerts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
