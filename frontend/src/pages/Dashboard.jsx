import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../api';
import { resolveImageUrl } from '../utils/imageUrl';

export default function Dashboard() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('assets');

  useEffect(() => {
    const fetchData = async () => {
      if (!localStorage.getItem('token')) return navigate('/login');
      
      try {
        const [userRes, listingsRes] = await Promise.all([
          API.get('/auth/me'),
          API.get('/listings/mine')
        ]);
        setUser(userRes.data);
        setListings(listingsRes.data);
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

  const resolveListingRoute = (item) => {
    const normalizedType = String(item.type || '').toLowerCase();
    const normalizedCategory = String(item.category || '').toLowerCase();
    const hasPropertyDetails = Boolean(item.propertyDetails?.beds || item.propertyDetails?.baths || item.propertyDetails?.sqft);
    const hasVehicleDetails = Boolean(item.vehicleDetails?.make || item.vehicleDetails?.model || item.vehicleDetails?.year || item.vehicleDetails?.mileage);

    if (normalizedType === 'property' || normalizedCategory.includes('propert') || normalizedCategory.includes('land') || hasPropertyDetails) {
      return `/property/${item._id}`;
    }

    if (normalizedType === 'vehicle' || normalizedCategory.includes('vehicle') || hasVehicleDetails) {
      return `/vehicle/${item._id}`;
    }

    return `/property/${item._id}`;
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Synchronizing with Curator Hub...</div>;

  return (
    <div className="bg-[#fafbfa] min-h-screen font-sans">
      <Navbar isAuthenticated={true} />
      
      {/* Header Profile Section */}
      <section className="bg-white border-b border-gray-100 py-16 animate-fadeIn">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-8">
            <div className="w-24 h-24 bg-green-700 text-white rounded-[32px] flex items-center justify-center text-4xl font-black shadow-2xl relative">
              {user?.fullname[0]}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full border-4 border-white"></div>
            </div>
            <div>
              <h1 className="text-4xl font-black text-green-900 tracking-tighter uppercase">{user?.fullname}</h1>
              <div className="flex items-center gap-4 mt-1 text-gray-400 font-bold text-xs">
                <span>ESTABLISHED CURATOR</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span className="uppercase">{user?.email}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
             <Link to="/post-ad" className="bg-green-700 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-800 transition shadow-xl">
               NEW LISTING +
             </Link>
             <button onClick={handleLogout} className="bg-gray-50 text-gray-400 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition">
               SECURE LOGOUT
             </button>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto py-12 px-6">
        
        {/* Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
           {[
             { label: 'Total Asset Value', val: `$${listings.reduce((acc, curr) => acc + (curr.price || 0), 0).toLocaleString()}`, color: 'text-green-700' },
             { label: 'Active Curations', val: listings.length, color: 'text-zinc-900' },
             // { label: 'Market Inquiries', val: '24', color: 'text-yellow-600' }
           ].map(stat => (
             <div key={stat.label} className="bg-white p-8 rounded-[32px] shadow-lg border border-gray-50 flex flex-col justify-center items-center text-center">
                <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{stat.label}</div>
                <div className={`text-4xl font-black ${stat.color} tracking-tighter`}>{stat.val}</div>
             </div>
           ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-100 mb-8 gap-12">
            {['assets', 'acquisitions', 'performance'].map(t => (
              <button 
                key={t}
                onClick={() => setActiveTab(t)}
                className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative
                ${activeTab === t ? 'text-green-700' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {t === 'assets' ? 'MY CURATED ASSETS' : t === 'acquisitions' ? 'ACQUISITION INTERESTS' : 'MARKET PERFORMANCE'}
                {activeTab === t && <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-700 rounded-t-full"></div>}
              </button>
            ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'assets' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map(item => (
              <div key={item._id} className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-50 group hover:translate-y-[-8px] transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img src={resolveImageUrl(item.image)} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-black tracking-widest 
                      ${item.status === 'APPROVED' ? 'bg-green-700 text-white' : 'bg-yellow-400 text-green-950'}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-xs font-black text-gray-400 uppercase">{item.type}</div>
                    <div className="text-2xl font-bold text-green-700 tracking-tight">${item.price?.toLocaleString()}</div>
                  </div>
                  <h3 className="font-bold text-xl text-zinc-900 uppercase tracking-tight mb-4 truncate">{item.title}</h3>
                  <div className="flex gap-2">
                    <Link to={`/edit-listing/${item._id}`} className="flex-1 text-center bg-gray-50 text-sm font-bold py-3 rounded-xl hover:bg-gray-100 transition uppercase tracking-widest shadow-sm">Manage</Link>
                    <Link to={resolveListingRoute(item)} className="flex-1 text-center bg-green-700 text-white text-sm font-bold py-3 rounded-xl hover:bg-green-800 transition uppercase tracking-widest shadow-lg">View</Link>
                  </div>
                </div>
              </div>
            ))}
            {listings.length === 0 && (
               <div className="col-span-full py-24 text-center opacity-30">
                  <div className="text-7xl mb-6">📦</div>
                  <h4 className="text-xl font-black text-gray-400 uppercase tracking-widest">No Active Curations</h4>
                  <Link to="/post-ad" className="text-green-700 font-bold border-b-2 border-green-700 mt-4 inline-block italic">Begin Your First Entry →</Link>
               </div>
            )}
          </div>
        )}

        {activeTab !== 'assets' && (
          <div className="py-32 text-center opacity-25">
             <div className="text-6xl mb-6">🔒</div>
             <h4 className="text-xl font-black text-gray-400 uppercase tracking-widest">Proprietary Data Vault</h4>
             <p className="text-sm italic mt-2">Deep analytics and saved archives are currently under maintenance.</p>
          </div>
        )}

      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}} />

    </div>
  );
}
