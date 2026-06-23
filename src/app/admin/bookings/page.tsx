"use client";

import { useState, useEffect } from "react";
import { BookOpenCheck, MapPin, Calendar, Clock, User } from "lucide-react";

interface Booking {
  id: number;
  customer: { name: string; phone: string };
  pandit: { user: { name: string; phone: string } };
  poojaType: { name: string };
  date: string;
  time: string;
  location: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch("https://hgmer-git-master-hindsols-projects.vercel.app/api/bookings/admin/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setBookings(data);
      } else {
        console.error("Failed to fetch bookings:", data);
        setBookings([]);
      }
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "COMPLETED":
        return "bg-green-100 text-green-800 border-green-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) return <div className="p-8">Loading Bookings...</div>;

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <BookOpenCheck className="text-[#ff9933]" />
          Platform Bookings
        </h1>
        <p className="text-gray-500 mt-1">Monitor all pandit bookings across the platform</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 font-semibold text-sm">
              <th className="p-4">Booking ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Pandit</th>
              <th className="p-4">Pooja Details</th>
              <th className="p-4">Schedule & Location</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {bookings.map((b) => (
              <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium text-gray-800">#{b.id}</td>
                <td className="p-4">
                  <div className="font-medium text-gray-800">{b.customer.name}</div>
                  <div className="text-xs text-gray-500">{b.customer.phone}</div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-gray-400" />
                    <span className="font-medium text-gray-800">{b.pandit.user.name}</span>
                  </div>
                  <div className="text-xs text-gray-500 ml-5">{b.pandit.user.phone}</div>
                </td>
                <td className="p-4">
                  <div className="font-medium text-[#ff9933]">{b.poojaType.name}</div>
                  <div className="text-xs text-gray-500 mt-1">Payment: {b.paymentStatus}</div>
                </td>
                <td className="p-4 space-y-1">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar size={14} className="text-[#ff9933]" />
                    <span>{new Date(b.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock size={14} className="text-[#ff9933]" />
                    <span>{b.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin size={14} className="text-gray-400" />
                    <span className="truncate max-w-[150px]" title={b.location}>{b.location}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                      b.status
                    )}`}
                  >
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
