"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBanner, setNewBanner] = useState({
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
    if (!confirm("Are you sure you want to delete this banner?")) return;
    try {
      await api.delete(`/banners/${id}`);
      fetchBanners();
    } catch (err) {
      alert("Error deleting banner");
    }
  };

  const handleCreateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select an image file first.");
      return;
    }

    try {
      // 1. Upload the image file first
      const formData = new FormData();
      formData.append("file", selectedFile);
      
      const uploadRes = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      const uploadedImageUrl = uploadRes.data.url;

      // 2. Create the banner with the uploaded URL
      await api.post("/banners", {
        ...newBanner,
        imageUrl: uploadedImageUrl
      });

      setIsModalOpen(false);
      setNewBanner({ title: "", subtitle: "", actionUrl: "Shop", isCampaign: false, productIds: [] });
      setSelectedFile(null);
      fetchBanners();
    } catch (err) {
      alert("Error creating banner and uploading image");
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage Banners</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#ff9933] hover:bg-orange-600 text-white px-4 py-2 rounded shadow"
        >
          + Add New Banner
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : banners.length === 0 ? (
        <p className="text-gray-500">No banners found.</p>
      ) : (
        <div className="bg-white shadow-sm border border-gray-100 rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
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
                    <img src={b.imageUrl} alt={b.title} className="w-24 h-12 object-cover rounded" />
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900">{b.title}</td>
                  <td className="py-3 px-4 text-gray-500 text-sm">{b.subtitle}</td>
                  <td className="py-3 px-4 text-gray-500 text-sm">
                    {b.isCampaign ? (
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">Campaign</span>
                    ) : (
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                        {b.actionUrl || "Shop"}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 flex justify-center space-x-2">
                    <button
                      onClick={() => handleDelete(b.id)}
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

      {/* Add Banner Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Banner</h2>
            
            <form onSubmit={handleCreateBanner} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Banner Title</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                  value={newBanner.title}
                  onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                  placeholder="e.g. Pooja Special"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Subtitle (Optional)</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                  value={newBanner.subtitle}
                  onChange={(e) => setNewBanner({ ...newBanner, subtitle: e.target.value })}
                  placeholder="e.g. Up to 50% Off"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Upload Banner Image</label>
                <input
                  type="file"
                  required
                  accept="image/*"
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                  onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Action Target (Where to go on click)</label>
                <select
                  disabled={newBanner.isCampaign}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 bg-white disabled:bg-gray-100"
                  value={newBanner.isCampaign ? 'Campaign' : newBanner.actionUrl}
                  onChange={(e) => setNewBanner({ ...newBanner, actionUrl: e.target.value })}
                >
                  <option value="Shop">Shop (Products)</option>
                  <option value="PanditService">Pandit Services</option>
                  <option value="Orders">Orders</option>
                  {newBanner.isCampaign && <option value="Campaign">Campaign Page</option>}
                </select>
              </div>

              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  id="isCampaign"
                  checked={newBanner.isCampaign}
                  onChange={(e) => setNewBanner({ ...newBanner, isCampaign: e.target.checked })}
                  className="h-4 w-4 text-[#ff9933] focus:ring-[#ff9933] border-gray-300 rounded"
                />
                <label htmlFor="isCampaign" className="ml-2 block text-sm text-gray-900 font-medium">
                  Is this a Campaign? (Link specific products)
                </label>
              </div>

              {newBanner.isCampaign && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Products for Campaign</label>
                  <div className="max-h-48 overflow-y-auto border border-gray-300 rounded p-2 bg-gray-50">
                    {availableProducts.map(product => (
                      <div key={product.id} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          id={`product-${product.id}`}
                          checked={newBanner.productIds.includes(product.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewBanner(prev => ({ ...prev, productIds: [...prev.productIds, product.id] }));
                            } else {
                              setNewBanner(prev => ({ ...prev, productIds: prev.productIds.filter(id => id !== product.id) }));
                            }
                          }}
                          className="h-4 w-4 text-[#ff9933] rounded"
                        />
                        <label htmlFor={`product-${product.id}`} className="ml-2 text-sm text-gray-700">
                          {product.name} (₹{product.price})
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-8">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#ff9933] text-white rounded hover:bg-orange-600"
                >
                  Upload & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
