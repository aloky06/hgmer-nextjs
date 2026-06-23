"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, MapPin, Star, ShieldCheck } from "lucide-react";

interface PanditProfile {
  id: number;
  user: { name: string };
  bio: string;
  experience: number;
  city: string;
  serviceRadius: number;
}

export default function PanditsListingPage() {
  const [pandits, setPandits] = useState<PanditProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState("");

  useEffect(() => {
    fetchPandits();
  }, []);

  const fetchPandits = async (city?: string) => {
    setLoading(true);
    try {
      const url = city 
        ? `https://hgmer-git-master-hindsols-projects.vercel.app/api/pandits/approved?city=${encodeURIComponent(city)}`
        : "https://hgmer-git-master-hindsols-projects.vercel.app/api/pandits/approved";
      const res = await fetch(url);
      const data = await res.json();
      setPandits(data);
    } catch (error) {
      console.error("Failed to fetch pandits", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPandits(searchCity);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#ff9933] to-[#e67e22] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">Find the Perfect Pandit for Your Pooja</h1>
          <p className="text-lg md:text-xl text-orange-50">
            Book verified and experienced Pandits for all your religious ceremonies.
          </p>

          <form onSubmit={handleSearch} className="mt-8 flex justify-center max-w-2xl mx-auto">
            <div className="relative w-full flex items-center bg-white rounded-full p-1 shadow-lg">
              <div className="pl-4 text-gray-400">
                <MapPin size={20} />
              </div>
              <input
                type="text"
                placeholder="Search by city (e.g., Mumbai, Delhi)"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="w-full py-3 px-4 outline-none text-gray-800 bg-transparent rounded-full"
              />
              <button
                type="submit"
                className="bg-[#ff9933] text-white px-6 py-3 rounded-full font-medium hover:bg-[#e67e22] transition-colors flex items-center gap-2"
              >
                <Search size={18} />
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Pandits List */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">
          {pandits.length} {pandits.length === 1 ? "Pandit" : "Pandits"} available
        </h2>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading Pandits...</div>
        ) : pandits.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-lg">No Pandits found for your search.</p>
            <button 
              onClick={() => { setSearchCity(""); fetchPandits(); }}
              className="mt-4 text-[#ff9933] font-medium hover:underline"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pandits.map((pandit) => (
              <div key={pandit.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{pandit.user.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-green-600 mt-1 font-medium">
                        <ShieldCheck size={16} />
                        Verified Pandit
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-orange-50 text-orange-600 px-2.5 py-1 rounded-lg text-sm font-semibold border border-orange-100">
                      <Star size={16} className="fill-orange-500" />
                      4.9
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-2">
                    {pandit.bio || "Experienced Pandit for all types of Poojas and rituals."}
                  </p>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Experience</p>
                      <p className="font-medium text-gray-800 mt-0.5">{pandit.experience} Years</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Location</p>
                      <p className="font-medium text-gray-800 mt-0.5 flex items-center gap-1 truncate">
                        <MapPin size={14} className="text-[#ff9933]" />
                        {pandit.city}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 border-t border-gray-100">
                  <Link href={`/pandits/${pandit.id}`} className="block w-full text-center bg-white border border-[#ff9933] text-[#ff9933] hover:bg-[#ff9933] hover:text-white py-2.5 rounded-xl font-medium transition-colors">
                    View Profile & Book
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
