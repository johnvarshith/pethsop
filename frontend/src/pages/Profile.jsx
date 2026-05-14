import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Package, Calendar, Heart, Edit3, Save, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { appointmentsAPI } from '../services/api';
import toast from 'react-hot-toast';

// Mock orders until backend orders API is fully built
const MOCK_ORDERS = [
  { id: '#ORD-001', date: '2025-05-01', items: 'Premium Dog Food × 2', total: '₹999', status: 'Delivered', deliveryInfo: 'Delivered on May 4' },
  { id: '#ORD-002', date: '2025-05-08', items: 'Orthopedic Dog Bed', total: '₹7,999', status: 'Processing', deliveryInfo: 'Arriving in 2 days' },
];


const STATUS_COLORS = {
  Delivered: 'bg-green-100 text-green-700',
  Processing: 'bg-yellow-100 text-yellow-700',
  Upcoming: 'bg-blue-100 text-blue-700',
  Completed: 'bg-gray-100 text-gray-600',
  Cancelled: 'bg-red-100 text-red-700',
};

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'appointments', label: 'Appointments', icon: Calendar },
  { id: 'favorites', label: 'Favorites', icon: Heart },
];

export default function Profile() {
  const { user } = useAuth();
  const { orders, cancelOrder } = useCart();
  const [activeTab, setActiveTab] = useState('profile');
  const [editing, setEditing] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({
    first_name: user?.first_name || '',
    second_name: user?.second_name || '',
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  useEffect(() => {
    if (activeTab === 'appointments') {
      appointmentsAPI.getMine()
        .then(res => setAppointments(res.data))
        .catch(() => toast.error('Failed to load appointments'));
    }
  }, [activeTab]);

  const handleSave = async () => {
    // In real app: await authAPI.updateProfile(form)
    toast.success('Profile updated successfully!');
    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header banner */}
      <div className="h-48 bg-gradient-to-r from-purple-600 via-purple-500 to-teal-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,.1) 0, rgba(255,255,255,.1) 1px, transparent 0, transparent 50%)',
          backgroundSize: '20px 20px',
        }} />
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {/* Profile avatar block */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-16 mb-8 relative z-10">
          <div className="w-28 h-28 rounded-3xl bg-white shadow-xl border-4 border-white flex items-center justify-center text-4xl font-black text-purple-600 shrink-0"
            style={{ fontFamily: 'Pacifico, cursive' }}>
            {(user?.first_name?.[0] || 'U').toUpperCase()}
          </div>
          <div className="flex-1 pb-2">
            <h1 className="text-2xl font-black text-gray-900">
              {user?.first_name} {user?.second_name}
            </h1>
            <p className="text-gray-500 text-sm">@{user?.username}</p>
            {user?.role === 'admin' && (
              <span className="inline-block mt-1 bg-purple-100 text-purple-700 text-xs font-bold px-2.5 py-1 rounded-full">Admin</span>
            )}
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:text-purple-700 hover:border-purple-300 px-4 py-2 rounded-xl text-sm font-semibold transition shadow-sm"
          >
            <Edit3 className="w-4 h-4" /> {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-2xl p-1 shadow-sm border border-gray-100 mb-6 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-black text-gray-900 mb-6">Personal Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'first_name', label: 'First Name' },
                  { key: 'second_name', label: 'Last Name' },
                  { key: 'username', label: 'Username' },
                  { key: 'email', label: 'Email' },
                  { key: 'phone', label: 'Phone' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">{label}</label>
                    {editing ? (
                      <input
                        value={form[key]}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400 transition"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium text-sm py-2.5 px-4 bg-gray-50 rounded-xl">
                        {form[key] || <span className="text-gray-400 italic">Not set</span>}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {editing && (
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition"
                  >
                    <Save className="w-4 h-4" /> Save Changes
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="flex items-center gap-2 border border-gray-200 text-gray-600 px-6 py-2.5 rounded-xl font-bold text-sm transition hover:border-gray-300"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-black text-gray-900">Order History</h2>
              </div>
              {orders.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No orders yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition">
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{order.id}</p>
                        <p className="text-xs text-gray-500 mt-0.5 max-w-xs truncate" title={order.items}>{order.items}</p>
                        <p className="text-xs text-gray-400">{order.date}</p>
                        {order.deliveryInfo && (
                          <p className={`text-xs font-semibold mt-1 ${order.status === 'Cancelled' ? 'text-red-500' : 'text-purple-600'}`}>{order.deliveryInfo}</p>
                        )}
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <p className="font-black text-gray-900">{order.total}</p>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full mt-1 inline-block ${STATUS_COLORS[order.status]}`}>
                          {order.status}
                        </span>
                        {order.status === 'Processing' && (
                          <button 
                            onClick={() => cancelOrder(order.id)}
                            className="mt-2 text-xs text-red-500 hover:text-red-700 underline font-semibold transition"
                          >
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-black text-gray-900">My Appointments</h2>
              </div>
              {appointments.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No appointments booked yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {appointments.map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition">
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{apt.serviceType}</p>
                        <p className="text-xs text-gray-500 mt-0.5">For: {apt.petName}</p>
                        <p className="text-xs text-gray-400">{apt.date} · {apt.time}</p>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[apt.status] || 'bg-gray-100 text-gray-600'}`}>
                        {apt.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Favorites Tab */}
          {activeTab === 'favorites' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center text-gray-400">
              <Heart className="w-14 h-14 mx-auto mb-3 opacity-20 text-red-400" />
              <p className="font-semibold">Your favorited pets will appear here</p>
              <p className="text-sm mt-1">Browse the <a href="/adoption" className="text-purple-600 font-bold hover:underline">Adoption page</a> and heart pets you love!</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
