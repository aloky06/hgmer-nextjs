"use client";

import { useEffect, useState } from "react";
import { Search, Plus, Edit2, Trash2, Box, Info } from "lucide-react";
import api from "@/lib/api";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    description: "",
    price: "",
    mrp: "",
    weight: "",
    unit: "kg",
    categoryId: 0,
    type: "STANDARD",
    initialStock: "0",
  });
  const [existingImages, setExistingImages] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        api.get("/products/admin"),
        api.get("/products/categories")
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
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
      price: "",
      mrp: "",
      weight: "",
      unit: "kg",
      categoryId: categories.length > 0 ? categories[0].id : 0,
      type: "STANDARD",
      initialStock: "0",
    });
    setExistingImages([]);
    setSelectedFiles([]);
    setShowModal(true);
  };

  const handleOpenEdit = (p: any) => {
    setIsEdit(true);
    setFormData({
      id: p.id,
      name: p.name,
      description: p.description || "",
      price: p.price,
      mrp: p.mrp || "",
      weight: p.weight || "",
      unit: p.unit || "kg",
      categoryId: p.categoryId,
      type: p.type || "STANDARD",
      initialStock: "0",
    });
    setExistingImages(p.images || []);
    setSelectedFiles([]);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      alert("Product deleted successfully");
      fetchData();
    } catch (err: any) {
      alert("Error deleting product: " + (err.response?.data?.message || err.message));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const basePayload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price as string),
        mrp: formData.mrp ? parseFloat(formData.mrp as string) : null,
        weight: formData.weight ? parseFloat(formData.weight as string) : null,
        unit: formData.unit,
        categoryId: parseInt(formData.categoryId as any),
        type: formData.type,
      };

      // Handle local file uploads first
      let uploadedUrls: string[] = [];
      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          const uploadData = new FormData();
          uploadData.append('file', file);
          const uploadRes = await api.post('/upload', uploadData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          if (uploadRes.data && uploadRes.data.url) {
            uploadedUrls.push(uploadRes.data.url);
          }
        }
      }

      const allUrls = [...existingImages.map(img => img.url), ...uploadedUrls];

      const payload = {
        ...basePayload,
        galleryUrls: allUrls,
        initialStock: !isEdit ? parseInt(formData.initialStock) : undefined,
      };

      if (isEdit) {
        await api.put(`/products/${formData.id}`, payload);
      } else {
        await api.post("/products", payload);
      }
      setShowModal(false);
      fetchData();
    } catch (err: any) {
      alert("Error saving product: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff9933]"></div></div>;

  return (
    <div className="p-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Box className="mr-2 text-[#ff9933]" /> Manage Products
          </h1>
          <p className="text-gray-500 text-sm mt-1">Add, edit, or remove standard SKUs from your catalog.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center bg-[#ff9933] hover:bg-orange-600 text-white px-4 py-2 rounded-lg shadow-sm font-medium transition-colors"
        >
          <Plus size={18} className="mr-1" /> Add New Product
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-t-xl border border-gray-200 border-b-0 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search products by name..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff9933] focus:border-transparent outline-none transition-all"
          />
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Info size={16} className="mr-1" />
          Showing {products.length} products
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-gray-200 rounded-b-xl shadow-sm overflow-hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product Info</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price (₹)</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type / Unit</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {products.map((p: any) => (
              <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                      <Box size={20} />
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
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {p.category?.name || "Uncategorized"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-gray-900">₹{p.price}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium border ${
                    p.type === 'BUNDLE' ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-green-50 border-green-200 text-green-700'
                  }`}>
                    {p.type || 'STANDARD'}
                  </span>
                  <div className="text-xs text-gray-500 mt-1">
                    {p.weight ? `${p.weight} ${p.unit || 'kg'}` : "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button onClick={() => handleOpenEdit(p)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  <Box size={32} className="mx-auto mb-3 text-gray-300" />
                  <p>No products found in the catalog.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl flex flex-col w-full max-w-xl max-h-[95vh] shadow-2xl overflow-hidden transform transition-all">
            <div className="p-6 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                {isEdit ? <Edit2 className="mr-2 text-blue-500" size={20} /> : <Plus className="mr-2 text-green-500" size={20} />}
                {isEdit ? "Edit Product" : "Create New Product"}
              </h2>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="productForm" onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Product Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#ff9933] outline-none transition-shadow"
                  placeholder="e.g. Premium Agarbatti"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Category <span className="text-red-500">*</span></label>
                <select
                  required
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#ff9933] outline-none bg-white"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: parseInt(e.target.value) })}
                >
                  <option value={0} disabled>Select a category</option>
                  {categories.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Selling Price (₹) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#ff9933] outline-none"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">MRP (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#ff9933] outline-none"
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                    placeholder="e.g. 150"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Product Type</label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#ff9933] outline-none bg-white"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="STANDARD">STANDARD (Physical Item)</option>
                  <option value="BUNDLE">BUNDLE (Kit/Combo)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Description</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#ff9933] outline-none resize-none"
                  rows={3}
                  placeholder="Enter product details..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700">Product Images</label>
                
                {/* Image Previews */}
                {(existingImages.length > 0 || selectedFiles.length > 0) && (
                  <div className="flex flex-wrap gap-3">
                    {/* Existing Images */}
                    {existingImages.map((img) => (
                      <div key={`existing-${img.id}`} className="relative w-20 h-20 border border-gray-200 rounded-lg overflow-hidden group">
                        <img src={img.url} alt="Product" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setExistingImages(existingImages.filter(i => i.id !== img.id))}
                          className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                    
                    {/* New Uploads */}
                    {selectedFiles.map((file, idx) => (
                      <div key={`new-${idx}`} className="relative w-20 h-20 border-2 border-green-200 rounded-lg overflow-hidden group">
                        <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={12} />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-green-500 text-white text-[9px] text-center py-0.5">NEW</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* File Input */}
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-[#ff9933] transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-500">
                      <Box size={24} className="mb-2 text-gray-400" />
                      <p className="mb-1 text-sm"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-gray-400">PNG, JPG or WEBP (Max 5MB)</p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) {
                          setSelectedFiles([...selectedFiles, ...Array.from(e.target.files)]);
                          // Reset input value so the same files can be selected again if needed
                          e.target.value = '';
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {!isEdit && (
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Initial Stock (Nearest Warehouse)</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#ff9933] outline-none"
                    value={formData.initialStock}
                    onChange={(e) => setFormData({ ...formData, initialStock: e.target.value })}
                  />
                  <p className="text-xs text-gray-500">Stock will be assigned to your nearest warehouse automatically.</p>
                </div>
              )}

              </form>
            </div>
            
            <div className="p-6 border-t border-gray-100 flex-shrink-0 flex justify-end space-x-3 bg-gray-50">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 text-gray-600 bg-gray-50 hover:bg-gray-100 font-medium rounded-lg transition-colors border border-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="productForm"
                className="px-5 py-2.5 bg-[#ff9933] text-white hover:bg-orange-600 font-medium rounded-lg shadow-sm transition-colors"
              >
                {isEdit ? "Update Product" : "Save Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
