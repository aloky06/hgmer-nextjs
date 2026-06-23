"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustData, setAdjustData] = useState({ productId: 0, warehouseId: 0, quantity: 0, reason: "" });

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const res = await api.get("/inventory/warehouses");
      setWarehouses(res.data);
    } catch (err) {
      console.error("Failed to fetch warehouses", err);
    }
  };

  useEffect(() => {
    Promise.all([fetchProducts(), fetchWarehouses()]).finally(() => setLoading(false));
  }, []);

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/inventory/adjust", adjustData);
      alert("Stock adjusted successfully!");
      setShowAdjustModal(false);
      setAdjustData({ productId: 0, warehouseId: 0, quantity: 0, reason: "" });
      fetchProducts(); // Refresh stock
    } catch (err: any) {
      alert("Error adjusting stock: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage Inventory (Dark Store)</h1>
        <Link href="/admin/inventory/inwards" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow font-medium">
          + Goods Receipt (GRN)
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="bg-white shadow-sm border border-gray-100 rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Status</th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((p: any) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-900">{p.name}</td>
                  <td className="py-3 px-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${p.type === 'BUNDLE' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                      {p.type || 'STANDARD'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {p.type === 'BUNDLE' ? (
                      <span className="italic text-gray-500">Auto-calculated from components</span>
                    ) : (
                      p.inventories?.length > 0 ? (
                        <ul className="space-y-2">
                          {p.inventories.map((inv: any) => (
                            <li key={inv.id} className="bg-gray-50 p-2 rounded border border-gray-200 text-xs">
                              <p className="font-semibold text-gray-800">{inv.warehouse.name}</p>
                              <div className="flex justify-between mt-1 text-gray-600">
                                <span>Physical: {inv.quantity}</span>
                                <span>Reserved: <span className="text-orange-500">{inv.reservedQuantity}</span></span>
                                <span>Available: <strong className="text-green-600">{inv.quantity - inv.reservedQuantity}</strong></span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-red-500 font-semibold bg-red-50 px-2 py-1 rounded">Out of Stock</span>
                      )
                    )}
                  </td>
                  <td className="py-3 px-4 flex justify-center space-x-2">
                    {p.type !== 'BUNDLE' && (
                      <button
                        onClick={() => {
                          setAdjustData({ ...adjustData, productId: p.id, warehouseId: warehouses[0]?.id || 0 });
                          setShowAdjustModal(true);
                        }}
                        className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1 rounded transition-colors text-xs font-medium border border-blue-200"
                      >
                        Adjust Loss/Wastage
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {showAdjustModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-red-600">Adjust Wastage/Loss</h2>
            <form onSubmit={handleAdjustSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse</label>
                <select
                  required
                  className="w-full border border-gray-300 rounded p-2"
                  value={adjustData.warehouseId}
                  onChange={(e) => setAdjustData({ ...adjustData, warehouseId: parseInt(e.target.value) })}
                >
                  <option value={0} disabled>Select Warehouse</option>
                  {warehouses.map((w: any) => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity to Deduct (Negative)</label>
                <input
                  type="number"
                  required
                  max="-1"
                  className="w-full border border-gray-300 rounded p-2"
                  value={adjustData.quantity || ""}
                  onChange={(e) => setAdjustData({ ...adjustData, quantity: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason (e.g. Damage, Expired)</label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded p-2"
                  placeholder="e.g. Item expired"
                  value={adjustData.reason}
                  onChange={(e) => setAdjustData({ ...adjustData, reason: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Deduct Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
