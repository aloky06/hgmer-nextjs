"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function AdminWarehousesPage() {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    pincode: "",
    address: "",
    serviceablePincodes: "", // Display as comma separated string
  });

  const fetchWarehouses = async () => {
    try {
      const res = await api.get("/inventory/warehouses");
      setWarehouses(res.data);
    } catch (err) {
      console.error("Failed to fetch warehouses", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const openAddModal = () => {
    setIsEdit(false);
    setFormData({ id: 0, name: "", pincode: "", address: "", serviceablePincodes: "" });
    setShowModal(true);
  };

  const openEditModal = (w: any) => {
    setIsEdit(true);
    let sp = "";
    try {
      if (w.serviceablePincodes) {
        sp = JSON.parse(w.serviceablePincodes).join(", ");
      }
    } catch(e) {}

    setFormData({
      id: w.id,
      name: w.name,
      pincode: w.pincode || "",
      address: w.address || "",
      serviceablePincodes: sp,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Process serviceable pincodes
      let spJson = null;
      if (formData.serviceablePincodes) {
        spJson = JSON.stringify(formData.serviceablePincodes.split(",").map(p => p.trim()).filter(Boolean));
      }

      const payload = {
        name: formData.name,
        pincode: formData.pincode,
        address: formData.address,
        serviceablePincodes: spJson,
      };

      if (isEdit) {
        await api.post(`/inventory/warehouses/${formData.id}`, payload);
      } else {
        await api.post("/inventory/warehouses", payload);
      }

      setShowModal(false);
      fetchWarehouses();
    } catch (err: any) {
      alert("Error saving warehouse: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage Dark Stores (Warehouses)</h1>
        <button
          onClick={openAddModal}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded shadow font-medium"
        >
          + Add New Warehouse
        </button>
      </div>

      <div className="bg-white shadow-sm border border-gray-100 rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pincode</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serviceable Pincodes</th>
              <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {warehouses.map((w: any) => {
              let spDisplay = "All";
              try {
                if (w.serviceablePincodes) {
                  const arr = JSON.parse(w.serviceablePincodes);
                  spDisplay = arr.join(", ");
                }
              } catch(e) {}

              return (
                <tr key={w.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-gray-900">#{w.id}</td>
                  <td className="py-3 px-4 text-gray-700 font-medium">{w.name}</td>
                  <td className="py-3 px-4 text-gray-700">{w.pincode || "-"}</td>
                  <td className="py-3 px-4 text-sm text-gray-500 max-w-xs truncate" title={spDisplay}>
                    {spDisplay}
                  </td>
                  <td className="py-3 px-4 flex justify-center">
                    <button
                      onClick={() => openEditModal(w)}
                      className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded transition-colors text-xs font-medium"
                    >
                      Edit Warehouse
                    </button>
                  </td>
                </tr>
              );
            })}
            {warehouses.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">No warehouses found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4">{isEdit ? "Edit Warehouse" : "Add Warehouse"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse Name</label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded p-2"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location Pincode</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded p-2"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  className="w-full border border-gray-300 rounded p-2"
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Serviceable Pincodes</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded p-2"
                  placeholder="e.g. 110001, 110002"
                  value={formData.serviceablePincodes}
                  onChange={(e) => setFormData({ ...formData, serviceablePincodes: e.target.value })}
                />
                <p className="text-xs text-gray-500 mt-1">Comma separated. Leave blank for all pincodes.</p>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 font-medium"
                >
                  Save Warehouse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
