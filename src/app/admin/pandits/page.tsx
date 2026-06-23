"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { UserCheck, UserX, UserMinus, ShieldAlert, Edit, X, Upload } from "lucide-react";

export default function AdminPanditsPage() {
  const [pandits, setPandits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("PENDING"); // PENDING, APPROVED, REJECTED

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPandit, setEditingPandit] = useState<any>(null);
  const [formData, setFormData] = useState({
    experience: "",
    city: "",
    serviceRadius: "",
    photoUrl: "",
    rating: "",
    price: "",
    languages: "",
    specializations: "",
    bio: ""
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const fetchPandits = async () => {
    try {
      setLoading(true);
      const res = await api.get("/pandits/all");
      setPandits(res.data);
    } catch (err) {
      console.error("Failed to fetch pandits", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPandits();
  }, []);

  const handleStatusUpdate = async (id: number, status: "APPROVED" | "REJECTED" | "PENDING") => {
    let confirmMsg = "";
    if (status === "REJECTED") {
      confirmMsg = "Are you sure you want to SUSPEND this Pandit? They will no longer be visible on the mobile app.";
    } else if (status === "APPROVED") {
      confirmMsg = "Are you sure you want to APPROVE this Pandit?";
    } else {
      confirmMsg = "Move this Pandit back to PENDING review?";
    }

    if (!window.confirm(confirmMsg)) return;

    try {
      await api.put(`/pandits/${id}/status`, { status });
      fetchPandits();
    } catch (err) {
      alert("Error updating status");
    }
  };

  // --- Edit Profile Logic ---

  const openEditModal = (pandit: any) => {
    setEditingPandit(pandit);
    setFormData({
      experience: pandit.experience?.toString() || "",
      city: pandit.city || "",
      serviceRadius: pandit.serviceRadius?.toString() || "",
      photoUrl: pandit.photoUrl || "",
      rating: pandit.rating?.toString() || "",
      price: pandit.price?.toString() || "",
      languages: pandit.languages || "",
      specializations: pandit.specializations || "",
      bio: pandit.bio || ""
    });
    setShowEditModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const data = new FormData();
    data.append("file", file);

    setUploadingImage(true);
    try {
      const res = await api.post("/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFormData(prev => ({ ...prev, photoUrl: res.data.url }));
    } catch (err) {
      console.error(err);
      alert("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const saveProfile = async () => {
    if (!editingPandit) return;
    setSavingProfile(true);
    try {
      await api.put(`/pandits/${editingPandit.id}/profile`, formData);
      setShowEditModal(false);
      fetchPandits();
    } catch (err) {
      console.error(err);
      alert("Failed to save profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const filteredPandits = pandits.filter((p: any) => p.status === activeTab);

  return (
    <div className="p-8 relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Pandit Management</h1>
          <p className="text-gray-500 mt-1">Review applications, edit profiles, and manage active partners.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("PENDING")}
          className={`px-6 py-3 font-medium text-sm flex items-center space-x-2 border-b-2 ${
            activeTab === "PENDING"
              ? "border-orange-500 text-orange-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          <UserMinus size={18} />
          <span>Pending Approvals</span>
          <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
            {pandits.filter((p: any) => p.status === "PENDING").length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("APPROVED")}
          className={`px-6 py-3 font-medium text-sm flex items-center space-x-2 border-b-2 ${
            activeTab === "APPROVED"
              ? "border-green-500 text-green-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          <UserCheck size={18} />
          <span>Active Pandits</span>
          <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
            {pandits.filter((p: any) => p.status === "APPROVED").length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("REJECTED")}
          className={`px-6 py-3 font-medium text-sm flex items-center space-x-2 border-b-2 ${
            activeTab === "REJECTED"
              ? "border-red-500 text-red-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          <UserX size={18} />
          <span>Suspended</span>
          <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
            {pandits.filter((p: any) => p.status === "REJECTED").length}
          </span>
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filteredPandits.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-10 flex flex-col items-center justify-center">
          <ShieldAlert size={48} className="text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg font-medium">No pandits found in this list.</p>
        </div>
      ) : (
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Pandit Details</th>
                <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
                <th className="py-3 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Pricing</th>
                <th className="py-3 px-6 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPandits.map((p: any) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      {p.photoUrl ? (
                        <img 
                          src={p.photoUrl.startsWith('http') ? p.photoUrl : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/${p.photoUrl}`} 
                          alt="Pandit Photo" 
                          className="h-12 w-12 rounded-full object-cover border border-gray-200" 
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-lg">
                          {p.user?.name?.charAt(0) || 'P'}
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-bold text-gray-900">{p.user?.name || 'N/A'}</div>
                        <div className="text-xs text-gray-500 mt-1">{p.user?.phone || 'N/A'} | {p.user?.email || 'N/A'}</div>
                        <div className="text-xs font-medium text-orange-600 mt-0.5">{p.rating} ⭐ • {p.experience} Yrs Exp</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm font-medium text-gray-900">{p.city}</div>
                    <div className="text-xs text-gray-500">{p.serviceRadius} km radius</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm font-bold text-gray-900">₹{p.price}</div>
                    <div className="text-xs text-gray-500">Starting price</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col space-y-2 items-center">
                      <button
                        onClick={() => openEditModal(p)}
                        className="w-full flex justify-center items-center space-x-1 border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded-md text-xs font-medium transition"
                      >
                        <Edit size={14} /> <span>Edit Profile</span>
                      </button>

                      {activeTab === "PENDING" && (
                        <div className="flex w-full space-x-2">
                          <button
                            onClick={() => handleStatusUpdate(p.id, "APPROVED")}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white px-2 py-1.5 rounded-md text-xs font-medium transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(p.id, "REJECTED")}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-2 py-1.5 rounded-md text-xs font-medium transition"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      
                      {activeTab === "APPROVED" && (
                        <button
                          onClick={() => handleStatusUpdate(p.id, "REJECTED")}
                          className="w-full border border-red-500 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-md text-xs font-medium transition"
                        >
                          Suspend
                        </button>
                      )}

                      {activeTab === "REJECTED" && (
                        <button
                          onClick={() => handleStatusUpdate(p.id, "APPROVED")}
                          className="w-full bg-gray-800 hover:bg-gray-900 text-white px-3 py-1.5 rounded-md text-xs font-medium transition"
                        >
                          Re-Activate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- Edit Profile Modal --- */}
      {showEditModal && editingPandit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Edit Profile: {editingPandit.user?.name}</h3>
                <p className="text-sm text-gray-500">Update public information for this Pandit.</p>
              </div>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column */}
              <div className="space-y-4">
                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Photo</label>
                  <div className="flex items-center space-x-4">
                    <div className="h-20 w-20 rounded-full bg-gray-100 border border-gray-300 overflow-hidden flex items-center justify-center">
                      {formData.photoUrl ? (
                        <img 
                          src={formData.photoUrl.startsWith('http') ? formData.photoUrl : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/${formData.photoUrl}`} 
                          alt="Preview" 
                          className="h-full w-full object-cover" 
                        />
                      ) : (
                        <span className="text-gray-400 text-xs text-center p-2">No Image</span>
                      )}
                    </div>
                    <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 text-sm font-medium flex items-center space-x-2">
                      <Upload size={16} />
                      <span>{uploadingImage ? "Uploading..." : "Upload New Photo"}</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Starting Price (₹)</label>
                    <input 
                      type="number" 
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500" 
                      value={formData.price} 
                      onChange={e => setFormData({...formData, price: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Rating (Out of 5.0)</label>
                    <input 
                      type="number" step="0.1" max="5"
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500" 
                      value={formData.rating} 
                      onChange={e => setFormData({...formData, rating: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Experience (Years)</label>
                    <input 
                      type="number" 
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500" 
                      value={formData.experience} 
                      onChange={e => setFormData({...formData, experience: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Service Radius (KM)</label>
                    <input 
                      type="number" 
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500" 
                      value={formData.serviceRadius} 
                      onChange={e => setFormData({...formData, serviceRadius: e.target.value})} 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500" 
                    value={formData.city} 
                    onChange={e => setFormData({...formData, city: e.target.value})} 
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Specializations (Comma separated)</label>
                  <textarea 
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500 h-20" 
                    placeholder="e.g. Havan Ceremonies, Vastu Shanti"
                    value={formData.specializations} 
                    onChange={e => setFormData({...formData, specializations: e.target.value})} 
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Languages (Comma separated)</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500" 
                    placeholder="e.g. Hindi, Sanskrit"
                    value={formData.languages} 
                    onChange={e => setFormData({...formData, languages: e.target.value})} 
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">About / Bio</label>
                  <textarea 
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500 h-24" 
                    value={formData.bio} 
                    onChange={e => setFormData({...formData, bio: e.target.value})} 
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
              <button 
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={saveProfile}
                disabled={savingProfile}
                className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 font-medium"
              >
                {savingProfile ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
