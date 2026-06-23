"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Book, X } from "lucide-react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function PoojaVidhiAdmin() {
  const [vidhis, setVidhis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: 0, title: "", procedure: "", imageUrl: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchVidhis();
  }, []);

  const fetchVidhis = async () => {
    try {
      const res = await fetch("https://hgmer-git-master-hindsols-projects.vercel.app/api/pooja-vidhis");
      const data = await res.json();
      setVidhis(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch pooja vidhis", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("admin_token");
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `https://hgmer-git-master-hindsols-projects.vercel.app/api/pooja-vidhis/${formData.id}`
      : "https://hgmer-git-master-hindsols-projects.vercel.app/api/pooja-vidhis";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: formData.title, procedure: formData.procedure, imageUrl: formData.imageUrl }),
      });

      if (res.ok) {
        setShowModal(false);
        fetchVidhis();
        setFormData({ id: 0, title: "", procedure: "", imageUrl: "" });
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to save", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this guide?")) return;
    const token = localStorage.getItem("admin_token");
    try {
      await fetch(`https://hgmer-git-master-hindsols-projects.vercel.app/api/pooja-vidhis/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchVidhis();
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
            <div className="p-2 bg-orange-100 rounded-lg">
              <Book className="text-orange-600" size={28} />
            </div>
            Manage Pooja Vidhi Guides
          </h1>
          <p className="text-gray-500 mt-2 text-lg">Create step-by-step spiritual guides with rich media.</p>
        </div>
        <button
          onClick={() => { setFormData({ id: 0, title: "", procedure: "", imageUrl: "" }); setIsEditing(false); setShowModal(true); }}
          className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all text-white px-5 py-2.5 rounded-xl shadow-lg shadow-orange-200 font-medium"
        >
          <Plus size={20} />
          <span>Add New Guide</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 font-medium text-sm">
                <th className="p-5 font-semibold">Guide Name</th>
                <th className="p-5 font-semibold hidden md:table-cell">Procedure Snippet</th>
                <th className="p-5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vidhis.map((v) => (
                <tr key={v.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      {v.imageUrl ? (
                        <img src={v.imageUrl} alt={v.title} className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                          {v.title.charAt(0)}
                        </div>
                      )}
                      <span className="font-semibold text-gray-800">{v.title}</span>
                    </div>
                  </td>
                  <td className="p-5 text-gray-500 hidden md:table-cell max-w-xs truncate" dangerouslySetInnerHTML={{ __html: v.procedure || '' }}></td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setFormData(v); setIsEditing(true); setShowModal(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={18} /></button>
                      <button onClick={() => handleDelete(v.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {vidhis.length === 0 && !loading && (
                <tr><td colSpan={3} className="p-12 text-center text-gray-400">No guides found. Click "Add New Guide" to create one.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">{isEditing ? "Edit Guide" : "Create New Guide"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:bg-gray-100 p-2 rounded-full transition-colors"><X size={20} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="vidhi-form" onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Guide Title</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-orange-500 focus:bg-white rounded-xl outline-none transition-colors" placeholder="e.g. Satyanarayan Katha" />
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
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 focus:border-orange-500 focus:bg-white rounded-xl outline-none transition-colors" 
                      />
                      {uploadingImage && <span className="text-xs text-orange-600 mt-1 block">Uploading...</span>}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Step-by-Step Procedure</label>
                  <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
                    <ReactQuill 
                      theme="snow" 
                      value={formData.procedure} 
                      onChange={val => setFormData({...formData, procedure: val})} 
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
                  <p className="text-xs text-gray-400 mt-12 mb-2">Use the editor to format the guide professionally.</p>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
              <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-colors">Cancel</button>
              <button type="submit" form="vidhi-form" className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-md shadow-orange-200 font-medium transition-colors">Save Guide</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
