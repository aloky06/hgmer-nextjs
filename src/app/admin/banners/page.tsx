"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  
  const [editingBannerId, setEditingBannerId] = useState<number | null>(null);
  const [bannerForm, setBannerForm] = useState({
    title: "",
    subtitle: "",
    actionUrl: "Shop",
    isCampaign: false,
    productIds: [] as number[]
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [availableProducts, setAvailableProducts] = useState<any[]>([]);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setAvailableProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  const fetchBanners = async () => {
    try {
      const res = await api.get("/banners");
      setBanners(res.data);
    } catch (err) {
      console.error("Failed to fetch banners", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to permanently delete this banner and its image?")) return;
    
    setDeletingIds(prev => [...prev, id]);
    try {
      await api.delete(`/banners/${id}`);
      setBanners(prev => prev.filter((b: any) => b.id !== id));
    } catch (err) {
      alert("Error deleting banner");
    } finally {
      setDeletingIds(prev => prev.filter(delId => delId !== id));
    }
  };

  const openEditModal = (banner: any) => {
    setEditingBannerId(banner.id);
    setBannerForm({
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      actionUrl: banner.actionUrl || "Shop",
      isCampaign: banner.isCampaign || false,
      productIds: banner.products ? banner.products.map((p: any) => p.id) : []
    });
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingBannerId(null);
    setBannerForm({ title: "", subtitle: "", actionUrl: "Shop", isCampaign: false, productIds: [] });
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBannerId && !selectedFile) {
      alert("Please select an image file to create a banner.");
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
        ...bannerForm,
        ...(uploadedImageUrl ? { imageUrl: uploadedImageUrl } : {})
      };

      if (editingBannerId) {
        // Edit Mode
        await api.patch(`/banners/${editingBannerId}`, payload);
      } else {
        // Create Mode
        await api.post("/banners", payload);
      }

      setIsModalOpen(false);
      setBannerForm({ title: "", subtitle: "", actionUrl: "Shop", isCampaign: false, productIds: [] });
      setSelectedFile(null);
      setEditingBannerId(null);
      fetchBanners();
    } catch (err) {
      alert(`Error ${editingBannerId ? 'updating' : 'creating'} banner.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage Banners</h1>
        <button 
          onClick={openCreateModal}
          className="bg-[#ff9933] hover:bg-orange-600 text-white px-4 py-2 rounded shadow transition"
        >
          + Add New Banner
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff9933]"></div>
        </div>
      ) : banners.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
          <p className="text-gray-500">No banners found. Create one to get started.</p>
        </div>
      ) : (
        <div className="bg-white shadow-sm border border-gray-100 rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtitle</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {banners.map((b: any) => (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <img src={b.imageUrl} alt={b.title} className="w-24 h-12 object-cover rounded shadow-sm border border-gray-100" />
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900">{b.title}</td>
                  <td className="py-3 px-4 text-gray-500 text-sm">{b.subtitle || "-"}</td>
                  <td className="py-3 px-4 text-gray-500 text-sm">
                    {b.isCampaign ? (
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">Campaign</span>
                    ) : (
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                        {b.actionUrl || "Shop"}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 flex justify-center space-x-3">
                    <button
                      onClick={() => openEditModal(b)}
                      disabled={deletingIds.includes(b.id)}
                      className="text-[#ff9933] hover:text-orange-700 hover:bg-orange-50 px-3 py-1 rounded transition-colors disabled:opacity-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
                      disabled={deletingIds.includes(b.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded transition-colors disabled:opacity-50"
                    >
                      {deletingIds.includes(b.id) ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Banner Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {editingBannerId ? "Edit Banner" : "Add New Banner"}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700">Banner Title</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-[#ff9933] focus:border-[#ff9933]"
                  value={bannerForm.title}
                  onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                  placeholder="e.g. Pooja Special"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Subtitle (Optional)</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-[#ff9933] focus:border-[#ff9933]"
                  value={bannerForm.subtitle}
                  onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                  placeholder="e.g. Up to 50% Off"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {editingBannerId ? "Update Banner Image (Optional)" : "Upload Banner Image"}
                </label>
                <input
                  type="file"
                  required={!editingBannerId}
                  accept="image/*"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-[#ff9933] hover:file:bg-orange-100"
                  onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                />
                {editingBannerId && !selectedFile && (
                  <p className="text-xs text-gray-500 mt-1">Leave empty to keep the current image.</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Action Target</label>
                <select
                  disabled={bannerForm.isCampaign}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 bg-white disabled:bg-gray-100 focus:ring-[#ff9933] focus:border-[#ff9933]"
                  value={bannerForm.isCampaign ? 'Campaign' : bannerForm.actionUrl}
                  onChange={(e) => setBannerForm({ ...bannerForm, actionUrl: e.target.value })}
                >
                  <option value="Shop">Shop (Products)</option>
                  <option value="PanditService">Pandit Services</option>
                  <option value="Orders">Orders</option>
                  {bannerForm.isCampaign && <option value="Campaign">Campaign Page</option>}
                </select>
              </div>

              <div className="flex items-center mt-4 bg-orange-50 p-3 rounded-md border border-orange-100">
                <input
                  type="checkbox"
                  id="isCampaign"
                  checked={bannerForm.isCampaign}
                  onChange={(e) => setBannerForm({ ...bannerForm, isCampaign: e.target.checked })}
                  className="h-4 w-4 text-[#ff9933] focus:ring-[#ff9933] border-gray-300 rounded"
                />
                <label htmlFor="isCampaign" className="ml-2 block text-sm text-gray-900 font-medium">
                  Is this a Campaign? (Link specific products)
                </label>
              </div>

              {bannerForm.isCampaign && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Products for Campaign</label>
                  <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-md p-2 bg-gray-50">
                    {availableProducts.map(product => (
                      <div key={product.id} className="flex items-center mb-2 hover:bg-gray-100 p-1 rounded transition">
                        <input
                          type="checkbox"
                          id={`product-${product.id}`}
                          checked={bannerForm.productIds.includes(product.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setBannerForm(prev => ({ ...prev, productIds: [...prev.productIds, product.id] }));
                            } else {
                              setBannerForm(prev => ({ ...prev, productIds: prev.productIds.filter(id => id !== product.id) }));
                            }
                          }}
                          className="h-4 w-4 text-[#ff9933] focus:ring-[#ff9933] rounded"
                        />
                        <label htmlFor={`product-${product.id}`} className="ml-2 text-sm text-gray-700 cursor-pointer flex-1">
                          {product.name} <span className="text-gray-400 font-medium">(₹{product.price})</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
                      {editingBannerId ? "Saving..." : "Uploading..."}
                    </>
                  ) : (
                    editingBannerId ? "Save Changes" : "Upload & Save"
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
