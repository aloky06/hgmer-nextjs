"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Users, X } from "lucide-react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function ConsultancyAdmin() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: 0, title: "", description: "", price: "", imageUrl: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch("https://hgmer-git-master-hindsols-projects.vercel.app/api/consultancy-services");
      const data = await res.json();
      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch consultancy services", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("admin_token");
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `https://hgmer-git-master-hindsols-projects.vercel.app/api/consultancy-services/${formData.id}`
      : "https://hgmer-git-master-hindsols-projects.vercel.app/api/consultancy-services";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ 
          title: formData.title, 
          description: formData.description, 
          price: parseFloat(formData.price as string) || 0,
          imageUrl: formData.imageUrl 
        }),
      });

      if (res.ok) {
        setShowModal(false);
        fetchServices();
        setFormData({ id: 0, title: "", description: "", price: "", imageUrl: "" });
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to save", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    const token = localStorage.getItem("admin_token");
    try {
      await fetch(`https://hgmer-git-master-hindsols-projects.vercel.app/api/consultancy-services/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchServices();
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const uploadData = new FormData();
    uploadData.append("file", file);
    
    setUploadingImage(true);
    try {
      const res = await fetch("https://hgmer-git-master-hindsols-projects.vercel.app/api/upload", {
        method: "POST",
        body: uploadData,
      });
      const data = await res.json();
      if (data.url) {
        setFormData(prev => ({...prev, imageUrl: data.url}));
      }
    } catch (error) {
      console.error("Upload failed", error);
      alert("Image upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="text-purple-600" size={28} />
            </div>
            Consultancy Services
          </h1>
          <p className="text-gray-500 mt-2 text-lg">Manage professional astrology and pooja consultations.</p>
        </div>
        <button
          onClick={() => { setFormData({ id: 0, title: "", description: "", price: "", imageUrl: "" }); setIsEditing(false); setShowModal(true); }}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 transition-all text-white px-5 py-2.5 rounded-xl shadow-lg shadow-purple-200 font-medium"
        >
          <Plus size={20} />
          <span>Add Service</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 font-medium text-sm">
                <th className="p-5 font-semibold">Service Info</th>
                <th className="p-5 font-semibold">Price</th>
                <th className="p-5 font-semibold hidden md:table-cell">Description Snippet</th>
                <th className="p-5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      {s.imageUrl ? (
                        <img src={s.imageUrl} alt={s.title} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                          {s.title.charAt(0)}
                        </div>
                      )}
                      <span className="font-semibold text-gray-800">{s.title}</span>
                    </div>
                  </td>
                  <td className="p-5 font-semibold text-purple-600">₹{s.price}</td>
                  <td className="p-5 text-gray-500 hidden md:table-cell max-w-xs truncate" dangerouslySetInnerHTML={{ __html: s.description || '' }}></td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setFormData({...s, price: s.price.toString()}); setIsEditing(true); setShowModal(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={18} /></button>
                      <button onClick={() => handleDelete(s.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {services.length === 0 && !loading && (
                <tr><td colSpan={4} className="p-12 text-center text-gray-400">No services found. Add your first service.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">{isEditing ? "Edit Service" : "Create New Service"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:bg-gray-100 p-2 rounded-full transition-colors"><X size={20} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="consultancy-form" onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Service Title</label>
                    <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-purple-500 focus:bg-white rounded-xl outline-none transition-colors" placeholder="e.g. Kundli Matchmaking" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹)</label>
                    <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-purple-500 focus:bg-white rounded-xl outline-none transition-colors" placeholder="500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image</label>
                  <div className="flex items-center gap-4">
                    {formData.imageUrl && (
                      <img src={formData.imageUrl} alt="Preview" className="w-16 h-16 rounded-xl object-cover border border-gray-200" />
                    )}
                    <div className="flex-1">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 focus:border-purple-500 focus:bg-white rounded-xl outline-none transition-colors" 
                      />
                      {uploadingImage && <span className="text-xs text-purple-600 mt-1 block">Uploading...</span>}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Detailed Description</label>
                  <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
                    <ReactQuill 
                      theme="snow" 
                      value={formData.description} 
                      onChange={val => setFormData({...formData, description: val})} 
                      style={{ height: '250px', borderBottom: 'none' }}
                      modules={{
                        toolbar: [
                          [{ 'header': [1, 2, false] }],
                          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                          [{'list': 'ordered'}, {'list': 'bullet'}],
                          ['link', 'clean']
                        ],
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-12 mb-2">Explain what this service includes.</p>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
              <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-colors">Cancel</button>
              <button type="submit" form="consultancy-form" className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-md shadow-purple-200 font-medium transition-colors">Save Service</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
