import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Package, ShoppingBag, Calendar as CalendarIcon, TrendingUp, Search, Plus, Trash2, Edit } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { adminAPI } from '../services/api';
import toast from 'react-hot-toast';

const CHART_DATA = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 3000 },
  { name: 'Wed', revenue: 2000 },
  { name: 'Thu', revenue: 2780 },
  { name: 'Fri', revenue: 1890 },
  { name: 'Sat', revenue: 2390 },
  { name: 'Sun', revenue: 3490 },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [search, setSearch] = useState('');
  
  // Real data state
  const [stats, setStats] = useState({ revenue: 0, users: 0, orders: 0, pets: 0 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const statsRes = await adminAPI.getStats();
        setStats(statsRes.data);
        
        // Mock users for now until GET /api/admin/users is built
        setUsers([
          { id: '1', name: 'Super Admin', email: 'admin', role: 'admin', joined: 'Today' },
        ]);
      } catch (err) {
        toast.error('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAdminData();
  }, []);

  const STAT_CARDS = [
    { label: 'Total Revenue', value: `₹${stats.revenue.toLocaleString()}`, trend: '+12.5%', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Total Users', value: stats.users.toLocaleString(), trend: '+5.2%', icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Total Orders', value: stats.orders.toLocaleString(), trend: '+18.1%', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Total Pets', value: stats.pets.toLocaleString(), trend: '+2.4%', icon: Package, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 p-6 flex flex-col gap-2 shrink-0">
        <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Admin Panel</h2>
        {[
          { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
          { id: 'users', label: 'Users', icon: Users },
          { id: 'products', label: 'Products', icon: ShoppingBag },
          { id: 'pets', label: 'Pets', icon: Package },
          { id: 'appointments', label: 'Appointments', icon: CalendarIcon },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <h1 className="text-3xl font-black text-gray-900">Overview</h1>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {STAT_CARDS.map((stat, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-500 mb-1">{stat.label}</p>
                      <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
                      <p className="text-xs font-bold text-green-500 mt-1">{stat.trend} this week</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue This Week</h3>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={CHART_DATA}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dx={-10} />
                      <Tooltip 
                        cursor={{ fill: '#f3f4f6' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="revenue" fill="#8b5cf6" radius={[6, 6, 0, 0]} maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-black text-gray-900">User Management</h1>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search users..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400 transition"
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                        <th className="px-6 py-4 font-bold">Name</th>
                        <th className="px-6 py-4 font-bold">Role</th>
                        <th className="px-6 py-4 font-bold">Joined</th>
                        <th className="px-6 py-4 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4">
                            <p className="font-bold text-gray-900 text-sm">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                              user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{user.joined}</td>
                          <td className="px-6 py-4 text-right">
                            <button className="p-2 text-gray-400 hover:text-blue-600 transition"><Edit className="w-4 h-4" /></button>
                            <button className="p-2 text-gray-400 hover:text-red-600 transition"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Placeholders for other tabs */}
          {['products', 'pets', 'appointments'].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center h-96 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2 capitalize">Manage {activeTab}</h2>
              <p className="text-gray-500">This section will be connected to the backend API soon.</p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
