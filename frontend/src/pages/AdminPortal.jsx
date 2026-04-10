import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../api';
import { resolveImageUrl } from '../utils/imageUrl';

export default function AdminPortal() {
  const [listings, setListings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('moderation');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const role = localStorage.getItem('role');
      if (!localStorage.getItem('token') || role !== 'ADMIN') {
        navigate('/login');
        return;
      }

      try {
        const listingsRes = await API.get('/listings', { params: { all: true } });
        setListings(listingsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await API.put(`/listings/${id}`, { status });
      setListings(listings.map(l => l._id === id ? { ...l, status } : l));
    } catch (err) {
      alert('Error updating status');
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Securing Admin Channel...</div>;

  return (
    <div className="bg-[#fafbfa] min-h-screen font-sans">
      <Navbar isAuthenticated={true} />
      
      <main className="max-w-7xl mx-auto py-12 px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-black text-green-900 tracking-tighter uppercase">ADMINISTRATIVE CURATOR</h1>
            <div className="text-[10px] font-black text-gray-400 mt-1 tracking-widest italic">PLATFORM INTEGRITY & CONTENT GOVERNANCE</div>
          </div>
          <div className="flex bg-white rounded-2xl p-1 shadow-lg border border-gray-100">
            <button 
              onClick={() => setTab('moderation')}
              className={`px-8 py-3 rounded-xl font-bold text-sm transition-all ${tab === 'moderation' ? 'bg-green-700 text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              MODERATION
            </button>
            <button 
              onClick={() => setTab('users')}
              className={`px-8 py-3 rounded-xl font-bold text-sm transition-all ${tab === 'users' ? 'bg-green-700 text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              MEMBERS
            </button>
            <button 
              onClick={() => setTab('audit')}
              className={`px-8 py-3 rounded-xl font-bold text-sm transition-all ${tab === 'audit' ? 'bg-green-700 text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              AUDIT TRAIL
            </button>
          </div>
        </div>

        {tab === 'moderation' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black mb-8 uppercase italic border-l-4 border-yellow-400 pl-4 text-green-900">Pending Asset Verification</h2>
            <div className="bg-white rounded-[32px] shadow-2xl overflow-hidden border border-gray-100">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <th className="px-8 py-6">Listing Details</th>
                    <th className="px-8 py-6">Market Type</th>
                    <th className="px-8 py-6">Owner</th>
                    <th className="px-8 py-6">Investment</th>
                    <th className="px-8 py-6 text-center">Governance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {listings.map(listing => (
                    <tr key={listing._id} className="hover:bg-gray-50/50 transition">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <img src={resolveImageUrl(listing.image)} className="w-12 h-12 rounded-lg object-cover shadow-sm bg-gray-100" />
                          <div>
                            <div className="font-black text-zinc-900 text-sm truncate max-w-[200px] uppercase tracking-tight">{listing.title}</div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase">{listing.location}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest
                          ${listing.type === 'PROPERTY' ? 'bg-blue-50 text-blue-700' : 
                            listing.type === 'VEHICLE' ? 'bg-purple-50 text-purple-700' : 'bg-gray-50 text-gray-700'}`}
                        >
                          {listing.type}
                        </span>
                      </td>
                      <td className="px-8 py-6 font-bold text-sm text-zinc-600">{listing.owner?.fullname || 'REDACTED'}</td>
                      <td className="px-8 py-6 font-black text-green-700 text-sm">${listing.price?.toLocaleString()}</td>
                      <td className="px-8 py-6">
                        <div className="flex justify-center gap-2">
                           {listing.status === 'PENDING' ? (
                             <>
                               <button 
                                 onClick={() => handleUpdateStatus(listing._id, 'APPROVED')}
                                 className="bg-green-700 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-green-800 transition"
                               >
                                 APPROVE
                               </button>
                               <button 
                                 onClick={() => handleUpdateStatus(listing._id, 'REJECTED')}
                                 className="bg-red-50 text-red-700 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-100 hover:bg-red-100 transition"
                               >
                                 REJECT
                               </button>
                             </>
                           ) : (
                             <span className={`text-[10px] font-black uppercase tracking-widest ${listing.status === 'APPROVED' ? 'text-green-600' : 'text-red-500'}`}>
                               AUTHENTICATED {listing.status}
                             </span>
                           )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {listings.length === 0 && (
                <div className="p-24 text-center">
                  <div className="text-6xl mb-6 opacity-20 whitespace-normal">⚖️</div>
                  <h3 className="text-xl font-black text-gray-300 uppercase tracking-widest">Platform Neutral State</h3>
                  <p className="text-gray-400 italic text-sm mt-2">All assets have been successfully Curated for authenticity.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'users' && (
          <div className="p-24 text-center opacity-40 bg-white rounded-[40px] shadow-xl border-2 border-dashed border-gray-200">
             <div className="text-6xl mb-6 whitespace-normal">👤</div>
             <h3 className="text-xl font-black text-gray-400 uppercase tracking-widest">Member Registry Under Maintenance</h3>
             <p className="text-sm italic mt-2">Privacy safeguards are being implemented for high-net-worth curators.</p>
          </div>
        )}

        {tab === 'audit' && (
          <div className="p-24 text-center opacity-40 bg-white rounded-[40px] shadow-xl border-2 border-dashed border-gray-200">
             <div className="text-6xl mb-6 whitespace-normal">📋</div>
             <h3 className="text-xl font-black text-gray-400 uppercase tracking-widest">Immutable Audit Trail Logs</h3>
             <p className="text-sm italic mt-2">Tracking every governance decision with cryptographic certainty.</p>
          </div>
        )}

      </main>
    </div>
  );
}
