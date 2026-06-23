'use client';

import { useState } from 'react';
import api from '@/lib/api';

export default function NotificationsPage() {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'offer',
    linkType: 'none',
    linkTarget: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      const res = await api.post('/notifications/broadcast', formData);
      setSuccess(`Success! Notification sent to ${res.data.count} users.`);
      setFormData({ title: '', message: '', type: 'offer', linkType: 'none', linkTarget: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send broadcast');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Push Notifications</h1>
        <p className="text-gray-500 mt-1">Broadcast marketing offers, sales, and alerts to all customers instantly.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl">
        <form onSubmit={handleBroadcast}>
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-700 rounded-lg flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
              {success}
            </div>
          )}
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Notification Type</label>
              <div className="grid grid-cols-3 gap-4">
                {['offer', 'order', 'alert'].map((type) => (
                  <label key={type} className={`cursor-pointer border rounded-lg p-4 flex flex-col items-center justify-center transition-all ${formData.type === type ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                    <input 
                      type="radio" 
                      name="type" 
                      value={type} 
                      className="hidden"
                      checked={formData.type === type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                    />
                    <span className="capitalize font-medium">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Notification Title</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none"
                placeholder="e.g. 🎉 Mega Flash Sale!"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Message Content</label>
              <textarea 
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none"
                placeholder="Write your exciting offer or alert message here..."
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              ></textarea>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-100 rounded-lg space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Action Link (Deep Link)</label>
                <select 
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                  value={formData.linkType}
                  onChange={(e) => setFormData({...formData, linkType: e.target.value, linkTarget: ''})}
                >
                  <option value="none">No Link</option>
                  <option value="product">Link to a Product</option>
                  <option value="category">Link to a Category</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">What should happen when the user taps this notification?</p>
              </div>

              {formData.linkType !== 'none' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Target ID</label>
                  <input 
                    type="number" 
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder={`Enter ${formData.linkType === 'product' ? 'Product' : 'Category'} ID`}
                    value={formData.linkTarget}
                    onChange={(e) => setFormData({...formData, linkTarget: e.target.value})}
                  />
                </div>
              )}
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium flex items-center justify-center transition-all ${loading ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 shadow-md shadow-orange-200'}`}
            >
              {loading ? 'Broadcasting...' : 'Broadcast to All Users'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
