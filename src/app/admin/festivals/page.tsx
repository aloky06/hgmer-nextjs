"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function AdminFestivalsPage() {
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFestivals = async () => {
    try {
      const res = await api.get("/festivals");
      setFestivals(res.data);
    } catch (err) {
      console.error("Failed to fetch festivals", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFestivals();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this festival?")) return;
    try {
      await api.delete(`/festivals/${id}`);
      fetchFestivals();
    } catch (err) {
      alert("Error deleting festival");
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage Festivals</h1>
        <button className="bg-[#ff9933] hover:bg-orange-600 text-white px-4 py-2 rounded shadow">
          + Add New Festival
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : festivals.length === 0 ? (
        <p className="text-gray-500">No festivals found.</p>
      ) : (
        <div className="bg-white shadow-sm border border-gray-100 rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {festivals.map((f: any) => (
                <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <img src={f.imageUrl} alt={f.name} className="w-16 h-16 object-cover rounded-full shadow-sm" />
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900">{f.name}</td>
                  <td className="py-3 px-4 text-gray-500 text-sm">{f.date}</td>
                  <td className="py-3 px-4 flex justify-center space-x-2 items-center h-full">
                    <button
                      onClick={() => handleDelete(f.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
