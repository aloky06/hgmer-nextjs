"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function AdminInwardsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    warehouseId: 0,
    productId: 0,
    quantity: "",
    costPrice: "",
    mrp: "",
    batchNumber: "",
    expiryDate: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, wareRes] = await Promise.all([
          api.get("/products"),
          api.get("/inventory/warehouses"),
        ]);
        // Only STANDARD products can be inwarded directly
        setProducts(prodRes.data.filter((p: any) => p.type === 'STANDARD'));
        setWarehouses(wareRes.data);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/inventory/inward", {
        warehouseId: Number(formData.warehouseId),
        productId: Number(formData.productId),
        quantity: Number(formData.quantity),
        costPrice: Number(formData.costPrice),
        mrp: formData.mrp ? Number(formData.mrp) : undefined,
        batchNumber: formData.batchNumber,
        expiryDate: formData.expiryDate || undefined,
      });
      alert("Goods Receipt Note (GRN) processed successfully!");
      router.push("/admin/inventory");
    } catch (err: any) {
      alert("Error processing GRN: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Goods Receipt Note (GRN)</h1>
        <button onClick={() => router.back()} className="text-gray-600 hover:underline">
          &larr; Back to Inventory
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination Warehouse</label>
              <select
                required
                className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-green-500"
                value={formData.warehouseId}
                onChange={(e) => setFormData({ ...formData, warehouseId: e.target.value as any })}
              >
                <option value={0} disabled>Select Warehouse</option>
                {warehouses.map((w: any) => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product (Standard SKU)</label>
              <select
                required
                className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-green-500"
                value={formData.productId}
                onChange={(e) => setFormData({ ...formData, productId: e.target.value as any })}
              >
                <option value={0} disabled>Select Product</option>
                {products.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity Received</label>
              <input
                type="number"
                required
                min="1"
                className="w-full border border-gray-300 rounded p-2"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price (per unit)</label>
              <input
                type="number"
                step="0.01"
                required
                min="0"
                className="w-full border border-gray-300 rounded p-2"
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">MRP (Optional)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="w-full border border-gray-300 rounded p-2"
                value={formData.mrp}
                onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Batch Number</label>
              <input
                type="text"
                required
                className="w-full border border-gray-300 rounded p-2 font-mono text-sm"
                placeholder="e.g. BATCH-2023-11A"
                value={formData.batchNumber}
                onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date (For FEFO tracking)</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded p-2"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              />
              <p className="text-xs text-gray-500 mt-1">Leave blank for non-perishable items</p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded font-medium hover:bg-green-700 shadow-sm"
            >
              Submit GRN & Add to Inventory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
