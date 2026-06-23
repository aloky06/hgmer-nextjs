"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock, Box, Save, X, MessageSquare, Edit } from "lucide-react";
import api from "@/lib/api";

export default function ProductApprovalsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isRejecting, setIsRejecting] = useState(false);
  const [adminNote, setAdminNote] = useState("");
  const [formData, setFormData] = useState<any>(null);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resProducts, resCategories] = await Promise.all([
        api.get("/products/admin"),
        api.get("/products/categories")
      ]);
      setProducts(resProducts.data.filter((p: any) => p.status === 'PENDING'));
      setCategories(resCategories.data);
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openReviewModal = (product: any) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      weight: product.weight || "",
      unit: product.unit || "kg",
      categoryId: product.categoryId,
    });
    setIsRejecting(false);
    setAdminNote("");
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setFormData(null);
    setIsRejecting(false);
    setAdminNote("");
  };

  const handleApprove = async () => {
    if (!selectedProduct) return;
    try {
      // 1. Save any edits first
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        weight: formData.weight ? parseFloat(formData.weight) : null,
        unit: formData.unit,
        categoryId: parseInt(formData.categoryId),
      };
      await api.put(`/products/${selectedProduct.id}`, payload);
      
      // 2. Approve
      await api.patch(`/products/${selectedProduct.id}/approve`);
      alert("Product approved successfully!");
      closeModal();
      fetchData();
    } catch (err: any) {
      alert("Error approving product: " + (err.response?.data?.message || err.message));
    }
  };

  const handleReject = async () => {
    if (!selectedProduct) return;
    if (!adminNote.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }
    try {
      await api.patch(`/products/${selectedProduct.id}/reject`, { adminNote });
      alert("Product rejected.");
      closeModal();
      fetchData();
    } catch (err: any) {
      alert("Error rejecting product: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff9933]"></div></div>;

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Clock className="mr-2 text-orange-500" /> Pending Approvals
          </h1>
          <p className="text-gray-500 text-sm mt-1">Review, edit, and approve vendor products.</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product Info</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price (₹)</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {products.map((p: any) => (
              <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 overflow-hidden">
                      {p.images && p.images.length > 0 ? (
                        <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <Box size={20} />
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-semibold text-gray-900">{p.name}</div>
                      <div className="text-xs text-gray-500 max-w-xs truncate" title={p.description}>
                        {p.description || "No description"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{p.category?.name || "N/A"}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-gray-900">₹{p.price}</div>
                  <div className="text-xs text-gray-500">{p.weight ? `${p.weight} ${p.unit || 'kg'}` : "N/A"}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    PENDING
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => openReviewModal(p)} className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200">
                    <Edit size={16} className="mr-1" /> Review
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  <Clock size={32} className="mx-auto mb-3 text-gray-300" />
                  <p>No products pending approval.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Review Modal */}
      {selectedProduct && formData && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                Review Product
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Col: Images Preview */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Product Gallery</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedProduct.images?.map((img: any) => (
                      <div 
                        key={img.id} 
                        className="aspect-square rounded-lg border border-gray-200 overflow-hidden bg-gray-50 cursor-pointer hover:opacity-80 transition-opacity relative group"
                        onClick={() => setFullscreenImage(img.url)}
                      >
                        <img src={img.url} alt="Product" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white text-xs font-semibold">View Full</span>
                        </div>
                      </div>
                    ))}
                    {(!selectedProduct.images || selectedProduct.images.length === 0) && (
                      <div className="aspect-square rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 bg-gray-50 col-span-2">
                        <Box size={32} className="mb-2" />
                        <span className="text-sm">No Images Provided</span>
                      </div>
                    )}
                  </div>
                  {selectedProduct.vendor && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Vendor Info</h4>
                      <p className="text-sm text-gray-800 font-medium">{selectedProduct.vendor.businessName}</p>
                      <p className="text-xs text-gray-500">Contact: {selectedProduct.vendor.user?.email}</p>
                    </div>
                  )}
                </div>

                {/* Right Col: Details Form */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Product Name <span className="text-gray-400 text-xs font-normal">(Editable)</span></label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#ff9933] outline-none"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Description <span className="text-gray-400 text-xs font-normal">(Editable)</span></label>
                    <textarea
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#ff9933] outline-none"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 block">Category</label>
                      <select
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#ff9933] outline-none bg-white"
                        value={formData.categoryId}
                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      >
                        <option value={0} disabled>Select</option>
                        {categories.map((c: any) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 block">Price (₹)</label>
                      <input
                        type="number"
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#ff9933] outline-none"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700">Measurement / Unit</label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#ff9933] outline-none"
                        placeholder="e.g. 0.5"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      />
                      <select
                        className="w-1/3 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#ff9933] outline-none bg-white"
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      >
                        <option value="kg">kg</option>
                        <option value="g">g</option>
                        <option value="L">L</option>
                        <option value="ml">ml</option>
                        <option value="pcs">pcs</option>
                        <option value="pack">pack</option>
                      </select>
                    </div>
                  </div>

                  {/* Reject Section Toggle */}
                  {isRejecting && (
                    <div className="mt-6 p-4 border border-red-200 bg-red-50 rounded-lg">
                      <label className="text-sm font-semibold text-red-800 mb-1 block flex items-center">
                        <MessageSquare size={14} className="mr-1" /> Rejection Reason
                      </label>
                      <textarea
                        rows={3}
                        className="w-full border border-red-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 outline-none text-sm"
                        placeholder="Explain why this product is being rejected (e.g. Unclear images, wrong category...)"
                        value={adminNote}
                        onChange={(e) => setAdminNote(e.target.value)}
                      />
                      <div className="flex justify-end gap-2 mt-3">
                        <button onClick={() => setIsRejecting(false)} className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded-md transition-colors">
                          Cancel
                        </button>
                        <button onClick={handleReject} className="px-3 py-1.5 text-sm bg-red-600 text-white hover:bg-red-700 rounded-md transition-colors font-medium">
                          Confirm Reject
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between shrink-0">
              {!isRejecting ? (
                <button
                  type="button"
                  onClick={() => setIsRejecting(true)}
                  className="px-6 py-2.5 rounded-lg font-medium transition-colors border border-red-200 text-red-600 hover:bg-red-50 flex items-center"
                >
                  <XCircle size={18} className="mr-2" /> Reject
                </button>
              ) : <div></div>}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2.5 rounded-lg font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleApprove}
                  className="px-6 py-2.5 rounded-lg font-medium bg-[#ff9933] text-white hover:bg-[#e68a2e] transition-colors flex items-center shadow-sm"
                >
                  <CheckCircle size={18} className="mr-2" /> Save & Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Image Preview */}
      {fullscreenImage && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-4 cursor-zoom-out" onClick={() => setFullscreenImage(null)}>
          <button className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors" onClick={() => setFullscreenImage(null)}>
            <X size={32} />
          </button>
          <img src={fullscreenImage} alt="Fullscreen Preview" className="max-w-full max-h-full object-contain" />
        </div>
      )}
    </div>
  );
}
