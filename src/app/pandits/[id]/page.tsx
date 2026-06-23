"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { MapPin, ShieldCheck, Star, Calendar, Clock, Flower2 } from "lucide-react";

interface PanditProfile {
  id: number;
  user: { name: string; email: string; phone: string };
  bio: string;
  experience: number;
  city: string;
  serviceRadius: number;
}

interface PoojaType {
  id: number;
  name: string;
  description: string;
}

export default function PanditDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [pandit, setPandit] = useState<PanditProfile | null>(null);
  const [poojaTypes, setPoojaTypes] = useState<PoojaType[]>([]);
  const [loading, setLoading] = useState(true);

  // Booking Form State
  const [selectedPooja, setSelectedPooja] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingLocation, setBookingLocation] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchPanditDetails();
      fetchPoojaTypes();
    }
  }, [params.id]);

  const fetchPanditDetails = async () => {
    try {
      const res = await fetch(`https://hgmer-git-master-hindsols-projects.vercel.app/api/pandits/profile/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setPandit(data);
      }
    } catch (error) {
      console.error("Failed to fetch pandit details", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPoojaTypes = async () => {
    try {
      const res = await fetch("https://hgmer-git-master-hindsols-projects.vercel.app/api/pooja-types");
      const data = await res.json();
      setPoojaTypes(data);
    } catch (error) {
      console.error("Failed to fetch pooja types", error);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // Assuming customer token
    if (!token) {
      alert("Please login as a customer to book a Pandit");
      router.push("/login"); // Adjust to your actual login route
      return;
    }

    try {
      const res = await fetch("https://hgmer-git-master-hindsols-projects.vercel.app/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          panditId: Number(params.id),
          poojaTypeId: Number(selectedPooja),
          date: bookingDate,
          time: bookingTime,
          location: bookingLocation,
        }),
      });

      if (res.ok) {
        setBookingSuccess(true);
        setTimeout(() => {
          router.push("/customer/bookings");
        }, 2000);
      } else {
        const errorData = await res.json();
        alert(`Booking failed: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Booking error", error);
      alert("Failed to submit booking");
    }
  };

  if (loading) return <div className="p-12 text-center text-gray-500 text-lg">Loading profile...</div>;
  if (!pandit) return <div className="p-12 text-center text-red-500 text-lg">Pandit not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Pandit Details Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{pandit.user.name}</h1>
                <div className="flex items-center gap-2 text-green-600 mt-2 font-medium bg-green-50 w-max px-3 py-1 rounded-full text-sm">
                  <ShieldCheck size={18} />
                  HGM Verified Pandit
                </div>
              </div>
              <div className="flex flex-col items-center justify-center bg-orange-50 text-orange-600 p-4 rounded-xl border border-orange-100">
                <Star size={24} className="fill-orange-500 mb-1" />
                <span className="font-bold text-xl">4.9</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-8 p-6 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <p className="text-sm text-gray-500 uppercase font-semibold tracking-wide">Experience</p>
                <p className="text-lg font-medium text-gray-800 mt-1">{pandit.experience} Years</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase font-semibold tracking-wide">Base Location</p>
                <p className="text-lg font-medium text-gray-800 mt-1 flex items-center gap-1">
                  <MapPin size={18} className="text-[#ff9933]" />
                  {pandit.city}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-800 mb-3">About Pandit Ji</h2>
              <p className="text-gray-600 leading-relaxed">
                {pandit.bio || "A highly experienced and knowledgeable pandit dedicated to performing traditional poojas and rituals with complete devotion and authenticity."}
              </p>
            </div>
          </div>
        </div>

        {/* Booking Form Column */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-[#ff9933]/20 p-6 sticky top-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Flower2 className="text-[#ff9933]" />
              Book Pooja
            </h2>

            {bookingSuccess ? (
              <div className="bg-green-50 text-green-700 p-6 rounded-xl border border-green-200 text-center">
                <ShieldCheck size={48} className="mx-auto mb-4 text-green-500" />
                <h3 className="text-xl font-bold mb-2">Booking Confirmed!</h3>
                <p className="text-sm text-green-600">Your booking request has been sent to the Pandit. Redirecting to your dashboard...</p>
              </div>
            ) : (
              <form onSubmit={handleBooking} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Select Pooja</label>
                  <select
                    required
                    value={selectedPooja}
                    onChange={(e) => setSelectedPooja(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff9933] focus:border-[#ff9933] outline-none bg-white text-gray-700"
                  >
                    <option value="" disabled>-- Select a Pooja --</option>
                    {poojaTypes.map((pooja) => (
                      <option key={pooja.id} value={pooja.id}>{pooja.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff9933] focus:border-[#ff9933] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="time"
                      required
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff9933] focus:border-[#ff9933] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-4 text-gray-400" size={18} />
                    <textarea
                      required
                      value={bookingLocation}
                      onChange={(e) => setBookingLocation(e.target.value)}
                      placeholder="Enter full address for the pooja"
                      className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff9933] focus:border-[#ff9933] outline-none h-24 resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#ff9933] hover:bg-[#e67e22] text-white py-3.5 rounded-xl font-bold text-lg transition-colors shadow-lg shadow-orange-500/30"
                >
                  Confirm Booking
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
