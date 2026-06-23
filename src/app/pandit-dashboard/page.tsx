"use client";

import { useState, useEffect } from "react";
import { BookOpenCheck, MapPin, Calendar, Clock, User, Check, X, CheckCircle } from "lucide-react";

interface Booking {
  id: number;
  customer: { name: string; phone: string };
  poojaType: { name: string };
  date: string;
  time: string;
  location: string;
  status: string;
  paymentStatus: string;
}

export default function PanditDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token"); // Assuming pandit uses the standard token for now. In reality, they might use 'pandit_token' or 'token' with role check.
      if (!token) return;

      const res = await fetch("https://hgmer-git-master-hindsols-projects.vercel.app/api/bookings/pandit-requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (error) {
      console.error("Failed to fetch requests", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://hgmer-git-master-hindsols-projects.vercel.app/api/bookings/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      
      if (res.ok) {
        fetchRequests();
      }
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-full border border-yellow-200">New Request</span>;
      case "CONFIRMED":
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full border border-blue-200">Confirmed</span>;
      case "COMPLETED":
        return <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full border border-green-200">Completed</span>;
      case "CANCELLED":
        return <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-semibold rounded-full border border-red-200">Cancelled</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-semibold rounded-full border border-gray-200">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <BookOpenCheck className="text-[#ff9933]" />
            Pandit Dashboard
          </h1>
          <p className="text-gray-500 mt-2">Manage your pooja bookings and schedule</p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading requests...</div>
        ) : bookings.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
            <BookOpenCheck size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">No Booking Requests</h2>
            <p className="text-gray-500">You don't have any incoming requests yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.map((booking) => (
              <div key={booking.id} className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-shadow p-6 ${booking.status === 'PENDING' ? 'border-[#ff9933]/50 shadow-md ring-1 ring-[#ff9933]/20' : 'border-gray-100 hover:shadow-md'}`}>
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-50">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{booking.poojaType.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">Booking ID: #{booking.id}</p>
                  </div>
                  <div>{getStatusBadge(booking.status)}</div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-gray-700">
                      <Calendar className="text-[#ff9933]" size={18} />
                      <div>
                        <p className="font-semibold text-gray-800">{new Date(booking.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <Clock className="text-[#ff9933]" size={18} />
                      <div>
                        <p className="font-semibold text-gray-800">{booking.time}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <MapPin className="text-[#ff9933] mt-0.5" size={18} />
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Location</p>
                      <p className="text-gray-800 font-medium">{booking.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-700">
                    <User className="text-gray-400" size={18} />
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Customer</p>
                      <p className="font-semibold text-gray-800">{booking.customer.name} <span className="text-gray-500 font-normal">({booking.customer.phone})</span></p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {booking.status === "PENDING" && (
                  <div className="flex gap-3 pt-4 border-t border-gray-50">
                    <button
                      onClick={() => updateStatus(booking.id, "CANCELLED")}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2.5 rounded-xl font-semibold transition-colors"
                    >
                      <X size={18} />
                      Decline
                    </button>
                    <button
                      onClick={() => updateStatus(booking.id, "CONFIRMED")}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-50 text-green-600 hover:bg-green-100 px-4 py-2.5 rounded-xl font-semibold transition-colors"
                    >
                      <Check size={18} />
                      Accept
                    </button>
                  </div>
                )}
                {booking.status === "CONFIRMED" && (
                  <div className="pt-4 border-t border-gray-50">
                    <button
                      onClick={() => updateStatus(booking.id, "COMPLETED")}
                      className="w-full flex items-center justify-center gap-2 bg-[#ff9933] hover:bg-[#e67e22] text-white px-4 py-2.5 rounded-xl font-semibold transition-colors shadow-sm"
                    >
                      <CheckCircle size={18} />
                      Mark as Completed
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
