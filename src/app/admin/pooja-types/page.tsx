"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Flower2 } from "lucide-react";

interface PoojaType {
  id: number;
  name: string;
  description: string;
}

export default function PoojaTypesPage() {
  const [poojaTypes, setPoojaTypes] = useState<PoojaType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: 0, name: "", description: "" });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchPoojaTypes();
  }, []);

  const fetchPoojaTypes = async () => {
    try {
      const res = await fetch("https://hgmer-git-master-hindsols-projects.vercel.app/api/pooja-types");
      const data = await res.json();
      setPoojaTypes(data);
    } catch (error) {
      console.error("Failed to fetch pooja types", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("admin_token");
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `https://hgmer-git-master-hindsols-projects.vercel.app/api/pooja-types/${formData.id}`
      : "https://hgmer-git-master-hindsols-projects.vercel.app/api/pooja-types";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: formData.name, description: formData.description }),
      });

      if (res.ok) {
        setShowModal(false);
        fetchPoojaTypes();
        setFormData({ id: 0, name: "", description: "" });
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to save pooja type", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this Pooja Type?")) return;
    const token = localStorage.getItem("admin_token");
    try {
      await fetch(`https://hgmer-git-master-hindsols-projects.vercel.app/api/pooja-types/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPoojaTypes();
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  const openEdit = (type: PoojaType) => {
    setFormData(type);
    setIsEditing(true);
    setShowModal(true);
  };

  const openCreate = () => {
    setFormData({ id: 0, name: "", description: "" });
    setIsEditing(false);
    setShowModal(true);
  };

  if (loading) return <div className="p-8">Loading Pooja Types...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Flower2 className="text-[#ff9933]" />
            Manage Pooja Types
          </h1>
          <p className="text-gray-500 mt-1">Configure available poojas for pandit booking</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center space-x-2 bg-[#ff9933] text-white px-4 py-2 rounded-lg hover:bg-[#e67e22] transition-colors shadow-md"
        >
          <Plus size={20} />
          <span>Add Pooja Type</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 font-semibold text-sm">
              <th className="p-4">ID</th>
              <th className="p-4">Name</th>
              <th className="p-4">Description</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {poojaTypes.map((type) => (
              <tr key={type.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="p-4 text-gray-500">#{type.id}</td>
                <td className="p-4 font-medium text-gray-800">{type.name}</td>
                <td className="p-4 text-gray-600 truncate max-w-xs">{type.description}</td>
                <td className="p-4 text-right space-x-3">
                  <button
                    onClick={() => openEdit(type)}
                    className="text-blue-500 hover:text-blue-700 transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(type.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {poojaTypes.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  No pooja types found. Add your first one!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-6 text-gray-800">
              {isEditing ? "Edit Pooja Type" : "Add Pooja Type"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff9933] focus:border-[#ff9933] outline-none"
                  placeholder="e.g. Satyanarayan Pooja"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff9933] focus:border-[#ff9933] outline-none h-32"
                  placeholder="Brief description of the pooja..."
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#ff9933] text-white rounded-lg hover:bg-[#e67e22] transition-colors font-medium shadow-md"
                >
                  {isEditing ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
