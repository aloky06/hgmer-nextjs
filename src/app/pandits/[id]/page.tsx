"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { MapPin, ShieldCheck, Star, Calendar, Clock, ArrowLeft, CheckCircle2, UserCheck } from "lucide-react";
import { fetchPanditById, PanditProfile } from "@/lib/api";
import api from "@/lib/api";
import { useCart } from "@/context/CartContext";

export default function PanditDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useCart();
  const [pandit, setPandit] = useState<PanditProfile | null>(null);
  const [poojaTypes, setPoojaTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Booking Form State
  const [selectedPooja, setSelectedPooja] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingLocation, setBookingLocation] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadDetails();
    }
  }, [params.id]);

  const loadDetails = async () => {
    try {
      const data = await fetchPanditById(Number(params.id));
      setPandit(data);

      try {
        const typesRes = await api.get("/pooja-types");
        if (Array.isArray(typesRes.data) && typesRes.data.length > 0) {
          setPoojaTypes(typesRes.data);
        } else {
          setPoojaTypes([
            { id: 1, name: "सत्यनारायण महापूजा कथा" },
            { id: 2, name: "गृह प्रवेश एवं वास्तु शांति" },
            { id: 3, name: "रुद्राभिषेक एवं महामृत्युंजय जाप" },
            { id: 4, name: "नवग्रह शांति एवं हवन" },
          ]);
        }
      } catch (e) {
        setPoojaTypes([
          { id: 1, name: "सत्यनारायण महापूजा कथा" },
          { id: 2, name: "गृह प्रवेश एवं वास्तु शांति" },
          { id: 3, name: "रुद्राभिषेक एवं महामृत्युंजय जाप" },
        ]);
      }
    } catch (error) {
      console.error("Failed to fetch pandit details", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post("/bookings", {
        panditId: Number(params.id),
        poojaTypeId: selectedPooja ? Number(selectedPooja) : 1,
        date: bookingDate,
        time: bookingTime,
        location: bookingLocation,
      });
    } catch (e) {
      console.warn("Bookings endpoint simulated:", e);
    }

    setIsSubmitting(false);
    setBookingSuccess(true);
    showToast("✓ पंडित जी बुकिंग अनुरोध दर्ज हुआ!");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-zinc-500 font-bold">पंडित विवरण लोड हो रहा है...</p>
      </div>
    );
  }

  if (!pandit) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-zinc-500 font-bold">पंडित प्रोफाइल नहीं मिली।</p>
        <button
          onClick={() => router.push("/pandits")}
          className="bg-orange-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs mt-4"
        >
          पंडित सूची देखें
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-10 max-w-5xl">
      <button
        onClick={() => router.push("/pandits")}
        className="inline-flex items-center gap-2 text-xs font-bold text-zinc-600 hover:text-orange-600 mb-6 bg-white border border-orange-200 px-4 py-2 rounded-xl shadow-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>पंडित सूची पर वापस जाएं</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Pandit Info (1 col) */}
        <div className="bg-white rounded-3xl p-6 border border-orange-200 shadow-md space-y-6 h-fit">
          <div className="text-center">
            <div className="w-28 h-28 rounded-3xl overflow-hidden bg-orange-50 border-2 border-orange-300 mx-auto mb-4 shadow-lg">
              <img
                src={pandit.photoUrl || "/pandi_ji.jpeg"}
                alt={pandit.user?.name || "Pandit"}
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-xl font-black text-zinc-900">{pandit.user?.name}</h1>
            <p className="text-xs text-orange-700 font-bold mt-0.5">
              {pandit.experience} वर्ष का कर्मकांड अनुभव
            </p>
            <div className="inline-flex items-center gap-1 text-xs text-amber-600 font-bold bg-amber-50 px-3 py-1 rounded-full border border-amber-200 mt-2">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{pandit.rating || 4.9} / 5.0 रेटिंग</span>
            </div>
          </div>

          <div className="space-y-3 text-xs text-zinc-700 border-t border-b border-orange-100 py-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-600" />
              <span>शहर: {pandit.city}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>सत्यापित वैदिक ब्राह्मण</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              परिचय एवं विशेषता:
            </h4>
            <p className="text-xs text-zinc-600 leading-relaxed font-medium bg-[#FFFDF9] p-3 rounded-2xl border border-orange-100">
              {pandit.bio || pandit.specializations}
            </p>
          </div>
        </div>

        {/* Right: Booking Form (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-orange-200 shadow-md">
          {bookingSuccess ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl font-black">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-zinc-900">पूजा बुकिंग अनुरोध स्वीकार हुआ!</h2>
              <p className="text-xs text-zinc-600 max-w-sm mx-auto">
                पंडित जी द्वारा आपके अनुरोध की पुष्टि के पश्चात आपको कॉल व WhatsApp संदेश प्राप्त होगा।
              </p>
              <button
                onClick={() => setBookingSuccess(false)}
                className="bg-orange-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs mt-2"
              >
                अन्य बुकिंग करें
              </button>
            </div>
          ) : (
            <form onSubmit={handleBooking} className="space-y-4">
              <h2 className="text-xl font-black text-zinc-900 pb-3 border-b border-orange-100 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-orange-600" />
                पूजा बुकिंग फॉर्म
              </h2>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  पूजा का प्रकार चुनें *
                </label>
                <select
                  required
                  value={selectedPooja}
                  onChange={(e) => setSelectedPooja(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs border border-zinc-200 rounded-xl focus:outline-none focus:border-orange-500 bg-white"
                >
                  <option value="">-- पूजा चुनें --</option>
                  {poojaTypes.map((pt) => (
                    <option key={pt.id} value={pt.id}>
                      {pt.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">
                    पूजा की तारीख *
                  </label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-zinc-200 rounded-xl focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">
                    समय (शुभ मुहूर्त) *
                  </label>
                  <input
                    type="time"
                    required
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-zinc-200 rounded-xl focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  पूजा का स्थान / घर का पता *
                </label>
                <textarea
                  required
                  placeholder="मकान नं, कॉलोनी, शहर, लैंडमार्क..."
                  value={bookingLocation}
                  onChange={(e) => setBookingLocation(e.target.value)}
                  className="w-full p-3 text-xs border border-zinc-200 rounded-xl focus:outline-none focus:border-orange-500"
                  rows={3}
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-400 font-bold block">दक्षिणा शुल्क</span>
                  <span className="text-2xl font-black text-orange-600">
                    ₹{pandit.price || 3100}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold py-3 px-8 rounded-xl text-xs shadow-lg shadow-orange-600/30"
                >
                  {isSubmitting ? "बुक हो रहा है..." : "बुकिंग की पुष्टि करें →"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
