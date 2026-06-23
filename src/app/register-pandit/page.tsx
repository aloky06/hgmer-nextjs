"use client";

import { useState } from "react";
import api from "@/lib/api";

export default function RegisterPanditPage() {
  const [formData, setFormData] = useState({
    bio: "",
    experience: 0,
    city: "",
    serviceRadius: 0,
    videoIntroUrl: "",
  });
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Submitting...");
    try {
      // In a real flow, the user would already be logged in and we'd pass their JWT token
      // For this demo, we'll assume they have a token or we'll mock the auth
      await api.post("/pandits/register", {
        ...formData,
        experience: Number(formData.experience),
        serviceRadius: Number(formData.serviceRadius),
      });
      setStatus("Success! Your profile is pending Admin approval.");
    } catch (err) {
      setStatus("Error submitting application. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-4xl font-bold text-saffron mb-6 text-center">Join as a Pandit</h1>
      <p className="text-gray-600 mb-8 text-center">
        Complete your profile to offer spiritual services across Har Ghar Mandir.
      </p>

      <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Short Bio</label>
            <textarea
              className="w-full border rounded-lg p-3 text-gray-800"
              rows={3}
              placeholder="Tell us about your spiritual journey..."
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Experience (Years)</label>
              <input
                type="number"
                className="w-full border rounded-lg p-3 text-gray-800"
                placeholder="e.g. 10"
                onChange={(e) => setFormData({ ...formData, experience: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
              <input
                type="text"
                className="w-full border rounded-lg p-3 text-gray-800"
                placeholder="e.g. Ayodhya"
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Service Radius (km)</label>
              <input
                type="number"
                className="w-full border rounded-lg p-3 text-gray-800"
                placeholder="e.g. 50"
                onChange={(e) => setFormData({ ...formData, serviceRadius: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Video Intro URL (Optional)</label>
              <input
                type="text"
                className="w-full border rounded-lg p-3 text-gray-800"
                placeholder="YouTube/Drive Link"
                onChange={(e) => setFormData({ ...formData, videoIntroUrl: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-saffron hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition"
          >
            Submit Application
          </button>
          
          {status && <p className="text-center mt-4 font-semibold text-gray-800">{status}</p>}
        </div>
      </form>
    </div>
  );
}
