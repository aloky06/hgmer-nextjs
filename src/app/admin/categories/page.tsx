"use client";

import { useEffect, useState } from "react";
import { Search, Plus, Edit2, Trash2, FolderTree, Info } from "lucide-react";
import api from "@/lib/api";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    description: "",
    parentId: 0,
    iconUrl: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setIsEdit(false);
    setFormData({
      id: 0,
      name: "",
      description: "",
      parentId: 0,
      iconUrl: "",
    });
    setSelectedFile(null);
    setShowModal(true);
  };

  const handleOpenEdit = (c: any) => {
    setIsEdit(true);
    setFormData({
      id: c.id,
      name: c.name,
      description: c.description || "",
      parentId: c.parentId || 0,
      iconUrl: c.iconUrl || "",
    });
    setSelectedFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to permanently delete this category? Subcategories or products linked might be affected.")) return;
    
    setDeletingIds(prev => [...prev, id]);
    try {
      await api.delete(`/products/categories/${id}`);
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      alert("Error deleting category: " + (err.response?.data?.message || err.message));
    } finally {
      setDeletingIds(prev => prev.filter(delId => delId !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let uploadedIconUrl = formData.iconUrl;

      // Only upload a new image if one was selected
      if (selectedFile) {
        const uploadData = new FormData();
        uploadData.append("file", selectedFile);
        const uploadRes = await api.post("/upload", uploadData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        uploadedIconUrl = uploadRes.data.url;
      }

      const payload = {
        name: formData.name,
        description: formData.description,
        parentId: formData.parentId ? parseInt(formData.parentId as any) : null,
        ...(uploadedIconUrl ? { iconUrl: uploadedIconUrl } : {})
      };

      if (isEdit) {
        await api.put(`/products/categories/${formData.id}`, payload);
      } else {
        await api.post("/products/categories", payload);
      }
      
      setShowModal(false);
      fetchData();
    } catch (err: any) {
      alert("Error saving category: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff9933]"></div></div>;

  return (
    <div className="p-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <FolderTree className="mr-2 text-[#ff9933]" /> Manage Categories
          </h1>
          <p className="text-gray-500 text-sm mt-1">Add, edit, or remove product categories.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center bg-[#ff9933] hover:bg-orange-600 text-white px-4 py-2 rounded-lg shadow-sm font-medium transition-colors"
        >
          <Plus size={18} className="mr-1" /> Add New Category
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-t-xl border border-gray-200 border-b-0 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search categories by name..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff9933] focus:border-transparent outline-none transition-all"
          />
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Info size={16} className="mr-1" />
          Showing {categories.length} categories
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-gray-200 rounded-b-xl shadow-sm overflow-hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Icon</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Parent Category</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {categories.map((c: any) => (
              <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  {c.iconUrl ? (
                    <img src={c.iconUrl} alt={c.name} className="w-12 h-12 rounded object-cover border border-gray-200" />
                  ) : (
                    <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
                      <FolderTree size={20} />
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-gray-900">{c.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500 max-w-xs truncate" title={c.description}>
                    {c.description || "-"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {c.parentId ? categories.find((cat: any) => cat.id === c.parentId)?.name || "Unknown" : "None (Root)"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2 items-center">
                    <button 
                      onClick={() => handleOpenEdit(c)} 
                      disabled={deletingIds.includes(c.id)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-50" 
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(c.id)} 
                      disabled={deletingIds.includes(c.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 flex items-center" 
                      title="Delete"
                    >
                      {deletingIds.includes(c.id) ? <span className="text-xs">Deleting...</span> : <Trash2 size={18} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  <FolderTree size={32} className="mx-auto mb-3 text-gray-300" />
                  <p>No categories found.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl flex flex-col w-full max-w-lg max-h-[95vh] shadow-2xl overflow-hidden transform transition-all">
            <div className="p-6 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                {isEdit ? <Edit2 className="mr-2 text-blue-500" size={20} /> : <Plus className="mr-2 text-green-500" size={20} />}
                {isEdit ? "Edit Category" : "Create New Category"}
              </h2>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="categoryForm" onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Category Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#ff9933] outline-none transition-shadow"
                    placeholder="e.g. Incense Sticks"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Description</label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#ff9933] outline-none resize-none"
                    rows={3}
                    placeholder="Enter category description..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Parent Category</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#ff9933] outline-none bg-white"
                    value={formData.parentId || 0}
                    onChange={(e) => setFormData({ ...formData, parentId: parseInt(e.target.value) })}
                  >
                    <option value={0}>None (Root Category)</option>
                    {categories.filter((c: any) => c.id !== formData.id).map((c: any) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1 mt-4">
                  <label className="text-sm font-semibold text-gray-700">
                    {isEdit ? "Update Category Icon (Optional)" : "Category Icon (Optional)"}
                  </label>
                  
                  {formData.iconUrl && !selectedFile && (
                    <div className="mb-2">
                      <img src={formData.iconUrl} alt="Current Icon" className="w-16 h-16 rounded border border-gray-200 object-cover" />
                      <p className="text-xs text-gray-500 mt-1">Current icon. Upload a new one to replace.</p>
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-[#ff9933] hover:file:bg-orange-100"
                    onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                  />
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-gray-100 flex-shrink-0 flex justify-end space-x-3 bg-gray-50">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 text-gray-600 bg-gray-50 hover:bg-gray-100 font-medium rounded-lg transition-colors border border-gray-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="categoryForm"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-[#ff9933] text-white hover:bg-orange-600 font-medium rounded-lg shadow-sm transition-colors disabled:opacity-70 flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  isEdit ? "Update Category" : "Save Category"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
