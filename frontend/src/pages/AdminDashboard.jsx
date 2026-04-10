import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalListings: 0,
    pendingListings: 0,
    approvedListings: 0,
    rejectedListings: 0
  });
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const role = localStorage.getItem('role');
      if (!localStorage.getItem('token') || role !== 'ADMIN') {
        navigate('/login');
        return;
      }

      try {
        // Fetch all listings (admin access)
        const listingsRes = await API.get('/listings', { params: { all: true } });
        const allListings = listingsRes.data;
        
        // Calculate stats
        const pending = allListings.filter(l => l.status === 'PENDING').length;
        const approved = allListings.filter(l => l.status === 'APPROVED').length;
        const rejected = allListings.filter(l => l.status === 'REJECTED').length;
        
        setStats({
          totalListings: allListings.length,
          pendingListings: pending,
          approvedListings: approved,
          rejectedListings: rejected
        });
        
        // Show recent pending listings
        setListings(allListings.filter(l => l.status === 'PENDING').slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-white text-xl font-bold">Loading Admin Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen font-sans">
      <Navbar isAuthenticated={true} />
      
      <main className="max-w-7xl mx-auto py-12 px-6">
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">ADMIN DASHBOARD</h1>
            <p className="text-gray-500 mt-2 text-sm font-semibold">Welcome, Platform Administrator</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg"
          >
            Logout
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-2">Total Listings</div>
            <div className="text-4xl font-black text-slate-900">{stats.totalListings}</div>
            <div className="text-xs text-gray-400 mt-3">All marketplace items</div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-yellow-200 border-opacity-50">
            <div className="text-yellow-600 text-sm font-bold uppercase tracking-widest mb-2">Pending Review</div>
            <div className="text-4xl font-black text-yellow-600">{stats.pendingListings}</div>
            <div className="text-xs text-gray-400 mt-3">Awaiting approval</div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-green-200 border-opacity-50">
            <div className="text-green-600 text-sm font-bold uppercase tracking-widest mb-2">Approved</div>
            <div className="text-4xl font-black text-green-600">{stats.approvedListings}</div>
            <div className="text-xs text-gray-400 mt-3">Live on marketplace</div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-red-200 border-opacity-50">
            <div className="text-red-600 text-sm font-bold uppercase tracking-widest mb-2">Rejected</div>
            <div className="text-4xl font-black text-red-600">{stats.rejectedListings}</div>
            <div className="text-xs text-gray-400 mt-3">Not approved</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-black mb-6 uppercase text-slate-900">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => navigate('/admin-moderation')}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-blue-300 transition-all text-left group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🔍</div>
              <div className="font-black text-slate-900 text-lg">Moderation</div>
              <p className="text-gray-500 text-sm mt-2">Review and approve pending listings</p>
            </button>

            <button
              onClick={() => navigate('/admin-users')}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-blue-300 transition-all text-left group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">👥</div>
              <div className="font-black text-slate-900 text-lg">Members</div>
              <p className="text-gray-500 text-sm mt-2">Manage users and permissions</p>
            </button>

            <button
              onClick={() => navigate('/admin-audit')}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-blue-300 transition-all text-left group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📋</div>
              <div className="font-black text-slate-900 text-lg">Audit Trail</div>
              <p className="text-gray-500 text-sm mt-2">View platform activity logs</p>
            </button>
          </div>
        </div>

        {/* Recent Pending Listings */}
        {stats.pendingListings > 0 && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black uppercase text-slate-900">Recent Pending Listings</h2>
              <button
                onClick={() => navigate('/admin-moderation')}
                className="text-blue-600 font-bold hover:text-blue-800 transition-colors"
              >
                View All →
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-8 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Listing</th>
                    <th className="px-8 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Type</th>
                    <th className="px-8 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Price</th>
                    <th className="px-8 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Location</th>
                    <th className="px-8 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {listings.map(listing => (
                    <tr key={listing._id} className="hover:bg-gray-50 transition">
                      <td className="px-8 py-4">
                        <div className="font-bold text-slate-900 truncate max-w-[250px]">{listing.title}</div>
                      </td>
                      <td className="px-8 py-4">
                        <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold">
                          {listing.type || 'OTHER'}
                        </span>
                      </td>
                      <td className="px-8 py-4">
                        <div className="font-bold text-slate-900">${listing.price?.toLocaleString()}</div>
                      </td>
                      <td className="px-8 py-4 text-gray-600 text-sm">{listing.location}</td>
                      <td className="px-8 py-4 text-gray-500 text-sm">
                        {new Date(listing.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {stats.pendingListings === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-green-100">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-xl font-black text-slate-900 mb-2">All Clear!</h3>
            <p className="text-gray-500">No pending listings to review. Great work keeping the marketplace clean.</p>
          </div>
        )}
      </main>
    </div>
  );
}
