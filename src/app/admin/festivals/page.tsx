"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function AdminFestivalsPage() {
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  
  const [editingFestivalId, setEditingFestivalId] = useState<number | null>(null);
  const [festivalForm, setFestivalForm] = useState({
    name: "",
    date: "",
    linkText: "Shop Special",
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
    if (!confirm("Are you sure you want to permanently delete this festival and its image?")) return;
    
    setDeletingIds(prev => [...prev, id]);
    try {
      await api.delete(`/festivals/${id}`);
      setFestivals(prev => prev.filter((f: any) => f.id !== id));
    } catch (err) {
      alert("Error deleting festival");
    } finally {
      setDeletingIds(prev => prev.filter(delId => delId !== id));
    }
  };

  const openEditModal = (festival: any) => {
    setEditingFestivalId(festival.id);
    setFestivalForm({
      name: festival.name || "",
      date: festival.date || "",
      linkText: festival.linkText || "Shop Special",
    });
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingFestivalId(null);
    setFestivalForm({ name: "", date: "", linkText: "Shop Special" });
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFestivalId && !selectedFile) {
      alert("Please select an image file to create a festival.");
      return;
    }

    setIsSubmitting(true);
    try {
      let uploadedImageUrl = undefined;

      // Only upload a new image if one was selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        const uploadRes = await api.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        uploadedImageUrl = uploadRes.data.url;
      }

      const payload = {
        ...festivalForm,
        ...(uploadedImageUrl ? { imageUrl: uploadedImageUrl } : {})
      };

      if (editingFestivalId) {
        // Edit Mode
        await api.patch(`/festivals/${editingFestivalId}`, payload);
      } else {
        // Create Mode
        await api.post("/festivals", payload);
      }

      setIsModalOpen(false);
      setFestivalForm({ name: "", date: "", linkText: "Shop Special" });
      setSelectedFile(null);
      setEditingFestivalId(null);
      fetchFestivals();
    } catch (err) {
      alert(`Error ${editingFestivalId ? 'updating' : 'creating'} festival.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage Festivals</h1>
        <button 
          onClick={openCreateModal}
          className="bg-[#ff9933] hover:bg-orange-600 text-white px-4 py-2 rounded shadow transition"
        >
          + Add New Festival
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff9933]"></div>
        </div>
      ) : festivals.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
          <p className="text-gray-500">No festivals found. Create one to get started.</p>
        </div>
      ) : (
        <div className="bg-white shadow-sm border border-gray-100 rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
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
                    <img src={f.imageUrl} alt={f.name} className="w-16 h-16 object-cover rounded-full shadow-sm border border-gray-100" />
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900">{f.name}</td>
                  <td className="py-3 px-4 text-gray-500 text-sm">{f.date}</td>
                  <td className="py-3 px-4 flex justify-center space-x-3 items-center h-full">
                    <button
                      onClick={() => openEditModal(f)}
                      disabled={deletingIds.includes(f.id)}
                      className="text-[#ff9933] hover:text-orange-700 hover:bg-orange-50 px-3 py-1 rounded transition-colors disabled:opacity-50 mt-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(f.id)}
                      disabled={deletingIds.includes(f.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded transition-colors disabled:opacity-50 mt-4"
                    >
                      {deletingIds.includes(f.id) ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Festival Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {editingFestivalId ? "Edit Festival" : "Add New Festival"}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700">Festival Name</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-[#ff9933] focus:border-[#ff9933]"
                  value={festivalForm.name}
                  onChange={(e) => setFestivalForm({ ...festivalForm, name: e.target.value })}
                  placeholder="e.g. Diwali Special"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Date/Duration</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-[#ff9933] focus:border-[#ff9933]"
                  value={festivalForm.date}
                  onChange={(e) => setFestivalForm({ ...festivalForm, date: e.target.value })}
                  placeholder="e.g. 10 Nov - 15 Nov"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Link Text</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-[#ff9933] focus:border-[#ff9933]"
                  value={festivalForm.linkText}
                  onChange={(e) => setFestivalForm({ ...festivalForm, linkText: e.target.value })}
                  placeholder="e.g. Shop Special"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {editingFestivalId ? "Update Festival Image (Optional)" : "Upload Festival Image"}
                </label>
                <input
                  type="file"
                  required={!editingFestivalId}
                  accept="image/*"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-[#ff9933] hover:file:bg-orange-100"
                  onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                />
                {editingFestivalId && !selectedFile && (
                  <p className="text-xs text-gray-500 mt-1">Leave empty to keep the current image.</p>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-md transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-[#ff9933] font-medium text-white rounded-md hover:bg-orange-600 transition disabled:opacity-70 flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {editingFestivalId ? "Saving..." : "Uploading..."}
                    </>
                  ) : (
                    editingFestivalId ? "Save Changes" : "Upload & Save"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
