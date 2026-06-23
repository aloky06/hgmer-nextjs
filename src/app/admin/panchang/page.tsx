"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Sun, X } from "lucide-react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function PanchangAdmin() {
  const [panchangs, setPanchangs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: 0, date: new Date().toISOString().split('T')[0], tithi: "", nakshatra: "", sunrise: "", sunset: "", details: "" });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchPanchangs();
  }, []);

  const fetchPanchangs = async () => {
    try {
      const res = await fetch("https://hgmer-git-master-hindsols-projects.vercel.app/api/panchangs");
      const data = await res.json();
      setPanchangs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch panchangs", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("admin_token");
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `https://hgmer-git-master-hindsols-projects.vercel.app/api/panchangs/${formData.id}`
      : "https://hgmer-git-master-hindsols-projects.vercel.app/api/panchangs";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ 
          date: new Date(formData.date).toISOString(),
          tithi: formData.tithi,
          nakshatra: formData.nakshatra,
          sunrise: formData.sunrise,
          sunset: formData.sunset,
          details: formData.details
        }),
      });

      if (res.ok) {
        setShowModal(false);
        fetchPanchangs();
        setFormData({ id: 0, date: new Date().toISOString().split('T')[0], tithi: "", nakshatra: "", sunrise: "", sunset: "", details: "" });
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to save", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this panchang?")) return;
    const token = localStorage.getItem("admin_token");
    try {
      await fetch(`https://hgmer-git-master-hindsols-projects.vercel.app/api/panchangs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPanchangs();
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Sun className="text-yellow-600" size={28} />
            </div>
            Daily Panchang
          </h1>
          <p className="text-gray-500 mt-2 text-lg">Manage tithi, nakshatra, and daily astrological timings.</p>
        </div>
        <button
          onClick={() => { setFormData({ id: 0, date: new Date().toISOString().split('T')[0], tithi: "", nakshatra: "", sunrise: "", sunset: "", details: "" }); setIsEditing(false); setShowModal(true); }}
          className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 transition-all text-white px-5 py-2.5 rounded-xl shadow-lg shadow-yellow-200 font-medium"
        >
          <Plus size={20} />
          <span>Add Panchang</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 font-medium text-sm">
                <th className="p-5 font-semibold">Date</th>
                <th className="p-5 font-semibold">Tithi & Nakshatra</th>
                <th className="p-5 font-semibold hidden md:table-cell">Details Snippet</th>
                <th className="p-5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {panchangs.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                  <td className="p-5 font-medium text-gray-800">{new Date(p.date).toLocaleDateString()}</td>
                  <td className="p-5">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800">{p.tithi}</span>
                      <span className="text-sm text-gray-500">{p.nakshatra}</span>
                    </div>
                  </td>
                  <td className="p-5 text-gray-500 hidden md:table-cell max-w-xs truncate" dangerouslySetInnerHTML={{ __html: p.details || '' }}></td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setFormData({...p, date: new Date(p.date).toISOString().split('T')[0]}); setIsEditing(true); setShowModal(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={18} /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {panchangs.length === 0 && !loading && (
                <tr><td colSpan={4} className="p-12 text-center text-gray-400">No panchang records found. Add your first record.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">{isEditing ? "Edit Panchang" : "Create New Panchang"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:bg-gray-100 p-2 rounded-full transition-colors"><X size={20} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="panchang-form" onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                    <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-yellow-500 focus:bg-white rounded-xl outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tithi</label>
                    <input type="text" required value={formData.tithi} onChange={e => setFormData({...formData, tithi: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-yellow-500 focus:bg-white rounded-xl outline-none transition-colors" placeholder="e.g. Ekadashi" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nakshatra</label>
                    <input type="text" required value={formData.nakshatra} onChange={e => setFormData({...formData, nakshatra: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-yellow-500 focus:bg-white rounded-xl outline-none transition-colors" placeholder="e.g. Rohini" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Sunrise</label>
                    <input type="time" value={formData.sunrise} onChange={e => setFormData({...formData, sunrise: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-yellow-500 focus:bg-white rounded-xl outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Sunset</label>
                    <input type="time" value={formData.sunset} onChange={e => setFormData({...formData, sunset: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-yellow-500 focus:bg-white rounded-xl outline-none transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Details</label>
                  <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
                    <ReactQuill 
                      theme="snow" 
                      value={formData.details} 
                      onChange={val => setFormData({...formData, details: val})} 
                      style={{ height: '200px', borderBottom: 'none' }}
                      modules={{
                        toolbar: [
                          ['bold', 'italic', 'underline'],
                          [{'list': 'bullet'}],
                          ['clean']
                        ],
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-12 mb-2">Any special notes about today's panchang.</p>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
              <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-colors">Cancel</button>
              <button type="submit" form="panchang-form" className="px-5 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl shadow-md shadow-yellow-200 font-medium transition-colors">Save Panchang</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
