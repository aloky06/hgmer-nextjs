"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Star, X } from "lucide-react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function HoroscopeAdmin() {
  const [horoscopes, setHoroscopes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: 0, sign: "Aries", prediction: "", date: new Date().toISOString().split('T')[0] });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchHoroscopes();
  }, []);

  const fetchHoroscopes = async () => {
    try {
      const res = await fetch("https://hgmer-git-master-hindsols-projects.vercel.app/api/horoscopes");
      const data = await res.json();
      setHoroscopes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch horoscopes", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("admin_token");
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `https://hgmer-git-master-hindsols-projects.vercel.app/api/horoscopes/${formData.id}`
      : "https://hgmer-git-master-hindsols-projects.vercel.app/api/horoscopes";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ 
          sign: formData.sign, 
          prediction: formData.prediction, 
          date: new Date(formData.date).toISOString() 
        }),
      });

      if (res.ok) {
        setShowModal(false);
        fetchHoroscopes();
        setFormData({ id: 0, sign: "Aries", prediction: "", date: new Date().toISOString().split('T')[0] });
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to save", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this horoscope?")) return;
    const token = localStorage.getItem("admin_token");
    try {
      await fetch(`https://hgmer-git-master-hindsols-projects.vercel.app/api/horoscopes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchHoroscopes();
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Star className="text-indigo-600" size={28} />
            </div>
            Daily Horoscopes
          </h1>
          <p className="text-gray-500 mt-2 text-lg">Manage daily predictions and astrological insights.</p>
        </div>
        <button
          onClick={() => { setFormData({ id: 0, sign: "Aries", prediction: "", date: new Date().toISOString().split('T')[0] }); setIsEditing(false); setShowModal(true); }}
          className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 transition-all text-white px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-200 font-medium"
        >
          <Plus size={20} />
          <span>Add Prediction</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 font-medium text-sm">
                <th className="p-5 font-semibold">Date</th>
                <th className="p-5 font-semibold">Zodiac Sign</th>
                <th className="p-5 font-semibold hidden md:table-cell">Prediction Snippet</th>
                <th className="p-5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {horoscopes.map((h) => (
                <tr key={h.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                  <td className="p-5 font-medium text-gray-600">{new Date(h.date).toLocaleDateString()}</td>
                  <td className="p-5">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-semibold text-sm">
                      {h.sign}
                    </span>
                  </td>
                  <td className="p-5 text-gray-500 hidden md:table-cell max-w-xs truncate" dangerouslySetInnerHTML={{ __html: h.prediction || '' }}></td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setFormData({...h, date: new Date(h.date).toISOString().split('T')[0]}); setIsEditing(true); setShowModal(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={18} /></button>
                      <button onClick={() => handleDelete(h.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {horoscopes.length === 0 && !loading && (
                <tr><td colSpan={4} className="p-12 text-center text-gray-400">No predictions found. Add your first prediction.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">{isEditing ? "Edit Prediction" : "Create New Prediction"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:bg-gray-100 p-2 rounded-full transition-colors"><X size={20} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="horoscope-form" onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Zodiac Sign</label>
                    <select required value={formData.sign} onChange={e => setFormData({...formData, sign: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:bg-white rounded-xl outline-none transition-colors">
                      {signs.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                    <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:bg-white rounded-xl outline-none transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Prediction Details</label>
                  <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
                    <ReactQuill 
                      theme="snow" 
                      value={formData.prediction} 
                      onChange={val => setFormData({...formData, prediction: val})} 
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
                  <p className="text-xs text-gray-400 mt-12 mb-2">Write the daily prediction cleanly.</p>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
              <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-colors">Cancel</button>
              <button type="submit" form="horoscope-form" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-200 font-medium transition-colors">Save Prediction</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
