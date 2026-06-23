"use client";

import { useState, useEffect } from "react";
import { BookOpenCheck, MapPin, Calendar, Clock, User, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Booking {
  id: number;
  pandit: { user: { name: string; phone: string } };
  poojaType: { name: string };
  date: string;
  time: string;
  location: string;
  status: string;
  paymentStatus: string;
}

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      const token = localStorage.getItem("token"); // Assuming customer token
      if (!token) return;

      const res = await fetch("https://hgmer-git-master-hindsols-projects.vercel.app/api/bookings/my-bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-full border border-yellow-200">Pending Approval</span>;
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
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <BookOpenCheck className="text-[#ff9933]" />
              My Pooja Bookings
            </h1>
            <p className="text-gray-500 mt-2">Track the status of your pandit bookings</p>
          </div>
          <Link href="/pandits" className="flex items-center gap-2 text-[#ff9933] font-medium hover:text-[#e67e22] transition-colors">
            Book Another Pooja
            <ArrowRight size={18} />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
            <BookOpenCheck size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">No Bookings Found</h2>
            <p className="text-gray-500 mb-6">You haven't booked any poojas yet.</p>
            <Link href="/pandits" className="inline-block bg-[#ff9933] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#e67e22] transition-colors">
              Find a Pandit
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-50">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{booking.poojaType.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">Booking ID: #{booking.id}</p>
                  </div>
                  <div>{getStatusBadge(booking.status)}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-700">
                      <User className="text-gray-400" size={18} />
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Pandit Ji</p>
                        <p className="font-semibold text-gray-800">{booking.pandit.user.name}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-gray-700">
                      <MapPin className="text-[#ff9933] mt-1" size={18} />
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Location</p>
                        <p className="text-gray-800">{booking.location}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-700">
                      <Calendar className="text-[#ff9933]" size={18} />
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Date</p>
                        <p className="font-semibold text-gray-800">{new Date(booking.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <Clock className="text-[#ff9933]" size={18} />
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Time</p>
                        <p className="font-semibold text-gray-800">{booking.time}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 font-medium">Payment:</span>
                    <span className={booking.paymentStatus === "PENDING" ? "text-yellow-600 font-semibold" : "text-green-600 font-semibold"}>
                      {booking.paymentStatus}
                    </span>
                  </div>
                  {booking.status === "PENDING" && (
                    <p className="text-gray-400 italic">Waiting for Pandit confirmation...</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
