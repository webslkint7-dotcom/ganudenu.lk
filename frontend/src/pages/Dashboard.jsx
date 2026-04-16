import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFF] text-[#1F2328] flex flex-col">
        <Navbar isAuthenticated={true} />
        <div className="flex-1 flex items-center justify-center text-sm text-[#6D7480]">Loading dashboard...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFF] text-[#1F2328] flex flex-col">
      <Navbar isAuthenticated={true} />

      <section className="bg-white border-b border-[#ECEEF1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 text-sm text-[#8A9099]">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => navigate('/')} className="hover:text-[#0B1F5E] transition">Home</button>
            <span>/</span>
            <span className="text-[#434A54]">Dashboard</span>
          </div>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto w-full py-8 px-4 sm:px-6">
        <section className="mb-6 bg-[#FFFFFF] border border-[#D9DEE8] rounded-sm p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#111827] text-white rounded-full flex items-center justify-center text-2xl font-bold">
                {user?.fullname?.[0] || 'U'}
              </div>
              <div>
                <h1 className="text-[28px] sm:text-[34px] font-extrabold text-[#262B31]">Welcome, {user?.fullname}</h1>
                <p className="text-[#6D7480] mt-1">Manage your listings, activity, and account overview.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Link to="/post-ad" className="h-11 px-5 bg-[#0B1F5E] text-white text-sm font-bold inline-flex items-center hover:bg-[#081742] transition">
                Post New Ad
              </Link>
              <button onClick={handleLogout} className="h-11 px-5 bg-[#111827] text-white text-sm font-bold hover:bg-[#000000] transition">
                Logout
              </button>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            {
              label: 'Total Listing Value',
              value: `LKR ${listings.reduce((acc, curr) => acc + (curr.price || 0), 0).toLocaleString()}`,
              tone: 'text-[#0B1F5E]'
            },
            {
              label: 'Active Listings',
              value: listings.length,
              tone: 'text-[#2B3036]'
            },
            {
              label: 'Account Email',
              value: user?.email || '-',
              tone: 'text-[#2B3036]'
            }
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-[#E7E9ED] rounded-sm p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <p className="text-[11px] uppercase tracking-[0.14em] text-[#9AA1AC] font-semibold">{stat.label}</p>
              <p className={`text-2xl font-extrabold mt-2 break-words ${stat.tone}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-[#E7E9ED] rounded-sm p-2 sm:p-3 mb-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex flex-wrap gap-2">
            {['assets', 'acquisitions', 'performance'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`h-10 px-4 text-sm font-semibold transition ${
                  activeTab === tab
                    ? 'bg-[#EAF0FF] text-[#0B1F5E] border border-[#CFD9F3]'
                    : 'text-[#606773] hover:bg-[#F7F8FA] border border-transparent'
                }`}
              >
                {tab === 'assets' ? 'My Listings' : tab === 'acquisitions' ? 'Inquiries' : 'Performance'}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'assets' ? (
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {listings.map((item) => (
              <div key={item._id} className="bg-white border border-[#E7E9ED] rounded-sm overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.08)] transition">
                <div className="relative h-44 bg-[#EFF2F5]">
                  <img src={resolveImageUrl(item.image)} alt={item.title} className="w-full h-full object-cover" />
                  <span className={`absolute top-3 left-3 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${item.status === 'APPROVED' ? 'bg-[#44A046] text-white' : 'bg-[#F5B82E] text-[#3F320B]'}`}>
                    {item.status}
                  </span>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[#9AA1AC] font-semibold">{item.type || 'Listing'}</p>
                    <p className="text-[#0B1F5E] text-lg font-extrabold whitespace-nowrap">LKR {item.price?.toLocaleString()}</p>
                  </div>
                  <h3 className="font-bold text-[#2B3036] line-clamp-1">{item.title}</h3>

                  <div className="flex gap-2 mt-4">
                    <Link to={`/edit-listing/${item._id}`} className="flex-1 h-10 bg-[#F7F8FA] border border-[#E7E9ED] text-[#505863] text-sm font-semibold inline-flex items-center justify-center hover:border-[#D9DDE3] transition">
                      Manage
                    </Link>
                    <Link to={resolveListingRoute(item)} className="flex-1 h-10 bg-[#111827] text-white text-sm font-semibold inline-flex items-center justify-center hover:bg-[#000000] transition">
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {listings.length === 0 && (
              <div className="col-span-full bg-white border border-[#E7E9ED] rounded-sm p-12 text-center text-[#8A9099]">
                <div className="text-5xl mb-4">📦</div>
                <h3 className="text-xl font-bold text-[#2B3036]">No listings yet</h3>
                <p className="text-sm mt-2 mb-5">Create your first ad to see it here.</p>
                <Link to="/post-ad" className="h-10 px-5 bg-[#0B1F5E] text-white text-sm font-bold inline-flex items-center hover:bg-[#081742] transition">
                  Post Your First Ad
                </Link>
              </div>
            )}
          </section>
        ) : (
          <section className="bg-white border border-[#E7E9ED] rounded-sm p-12 text-center text-[#8A9099] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="text-5xl mb-4">🔒</div>
            <h3 className="text-xl font-bold text-[#2B3036]">This section is coming soon</h3>
            <p className="text-sm mt-2">Inquiries and performance analytics are currently under maintenance.</p>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
