import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API from '../api';
import API_URL from '../config';
import { resolveImageUrl } from '../utils/imageUrl';
import { SRI_LANKA_DISTRICTS } from '../utils/locations';

export default function AllAds() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Filter states
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || 'All');
  const [subcategoryFilter, setSubcategoryFilter] = useState(searchParams.get('sub') || 'All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  // Reset subcategory when category changes
  const handleCategoryChange = (cat) => {
    setCategoryFilter(cat);
    setSubcategoryFilter('All');
    setSearchParams({ category: cat });
  };

  useEffect(() => {
    setLoading(true);
    API.get('/listings')
      .then(res => setListings(res.data))
      .catch(() => setError('Failed to load listings.'))
      .finally(() => setLoading(false));
  }, []);

  const filteredListings = listings.filter(item => {
    let matchesCategory = true;
    if (categoryFilter !== 'All') {
      const itemCat = String(item.category || '').toLowerCase();
      const itemType = String(item.type || '').toLowerCase();
      const filter = categoryFilter.toLowerCase();
      const stem = filter.endsWith('s') ? filter.slice(0, -1) : filter;
      matchesCategory = itemCat.includes(stem) || itemType.includes(stem);
    }

    const matchesSubcategory = subcategoryFilter === 'All' || 
      (item.subcategory || '').toLowerCase() === subcategoryFilter.toLowerCase() ||
      (item.propertyType || '').toLowerCase() === subcategoryFilter.toLowerCase();

    const matchesLocation = locationFilter === 'All' || (item.location || '').toLowerCase().includes(locationFilter.toLowerCase());
    const matchesSearch = searchQuery === '' || item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = (priceRange.min === '' || item.price >= Number(priceRange.min)) && (priceRange.max === '' || item.price <= Number(priceRange.max));
    return matchesCategory && matchesSubcategory && matchesLocation && matchesSearch && matchesPrice;
  });

  const subCategoriesMap = {
    'Properties': ['Villas & Estates', 'Luxury Penthouses', 'Modern Lofts', 'Nordic Cabins', 'Apartments', 'Lands'],
    'Vehicles': ['Luxury Cars', 'Vintage Collections', 'Daily Drivers', 'Motorcycles', 'SUVs', 'Vans']
  };

  return (
    <div className="bg-[#f5f7fa] min-h-screen font-sans">
      <Navbar isAuthenticated={!!localStorage.getItem('token')} />

      <section className="bg-slate-950 py-32 text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950 to-slate-950 z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80" 
            className="w-full h-full object-cover opacity-30 fixed"
            alt="Global Network"
          />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl lg:text-8xl font-black mb-8 uppercase tracking-tighter text-white leading-[0.9]">
              Find Everything <br/> <span className="text-blue-600">Everywhere.</span>
            </h1>
            <p className="text-slate-400 text-lg font-medium max-w-xl mb-10 leading-relaxed capitalize">
              Discover the most curated selection of properties and high-performance vehicles across Sri Lanka's premier marketplace.
            </p>
            <div className="flex items-center gap-6">
               <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center text-[10px] font-black">U{i}</div>)}
               </div>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Trusted by <span className="text-white">50k+</span> Active Traders</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
        <div className="bg-white p-4 rounded-[3rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.2)] border border-slate-100 flex flex-col lg:flex-row gap-4 items-stretch">
          
          <div className="flex-[2] flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-slate-100 bg-slate-50/50 rounded-[2rem] border border-slate-100 overflow-hidden">
             {/* Key Search */}
             <div className="flex-1 px-8 py-5 flex items-center gap-4 group">
                <span className="text-xl opacity-20 group-focus-within:opacity-100 transition-opacity">🔍</span>
                <div className="flex flex-col flex-1">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 group-focus-within:text-blue-600 transition">Keywords</label>
                   <input 
                      type="text" 
                      placeholder="BMW M4, Modern Villa..." 
                      className="bg-transparent border-none text-xs font-black text-slate-900 outline-none placeholder-slate-300 uppercase tracking-widest"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                   />
                </div>
             </div>
             {/* Location */}
             <div className="flex-1 px-8 py-5 flex items-center gap-4 group relative">
                <span className="text-xl opacity-20 group-focus-within:opacity-100 transition-opacity">📍</span>
                <div className="flex flex-col flex-1">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 group-focus-within:text-blue-600 transition">Location</label>
                   <select 
                      className="bg-transparent border-none text-xs font-black text-slate-900 outline-none appearance-none cursor-pointer uppercase tracking-widest pr-10"
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                   >
                      <option value="All">Across All Regions</option>
                      {SRI_LANKA_DISTRICTS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                   </select>
                </div>
                <div className="absolute right-8 pointer-events-none opacity-20 underline-offset-4">⌄</div>
             </div>
          </div>

          <button className="bg-blue-700 hover:bg-blue-600 text-white font-black px-12 py-6 rounded-[2rem] uppercase tracking-[0.3em] text-[11px] shadow-2xl shadow-blue-700/20 transition active:scale-95 flex items-center justify-center gap-3">
             Update Listings <span>→</span>
          </button>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-4 gap-12">
        <aside className="space-y-8">
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-50">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8 text-slate-400">Categories</h3>
            <div className="space-y-4">
              {['All', 'Properties', 'Vehicles'].map(cat => (
                <button 
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`w-full text-left flex justify-between items-center group transition-colors ${categoryFilter === cat ? 'text-navy' : 'text-slate-400'}`}
                >
                  <span className="text-xs font-black uppercase tracking-widest group-hover:text-navy transition">{cat}</span>
                  {categoryFilter === cat && <span className="w-2 h-2 bg-navy rounded-full"></span>}
                </button>
              ))}
            </div>
          </div>

          {categoryFilter !== 'All' && subCategoriesMap[categoryFilter] && (
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-50 animate-in fade-in slide-in-from-top-4 duration-300">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8 text-slate-400">Sub Categories</h3>
              <div className="space-y-4">
                <button 
                  onClick={() => setSubcategoryFilter('All')}
                  className={`w-full text-left flex justify-between items-center group transition-colors ${subcategoryFilter === 'All' ? 'text-navy' : 'text-slate-400'}`}
                >
                  <span className="text-xs font-black uppercase tracking-widest group-hover:text-navy transition">All Types</span>
                  {subcategoryFilter === 'All' && <span className="w-2 h-2 bg-navy rounded-full"></span>}
                </button>
                {subCategoriesMap[categoryFilter].map(sub => (
                  <button 
                    key={sub}
                    onClick={() => setSubcategoryFilter(sub)}
                    className={`w-full text-left flex justify-between items-center group transition-colors ${subcategoryFilter === sub ? 'text-navy' : 'text-slate-400'}`}
                  >
                    <span className="text-xs font-black uppercase tracking-widest group-hover:text-navy transition">{sub}</span>
                    {subcategoryFilter === sub && <span className="w-2 h-2 bg-navy rounded-full"></span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-50">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8 text-slate-400">Price Range</h3>
            <div className="space-y-4">
               <div className="flex gap-2">
                  <input type="number" placeholder="Min" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-black outline-none focus:border-navy transition" value={priceRange.min} onChange={(e) => setPriceRange({...priceRange, min: e.target.value})} />
                  <input type="number" placeholder="Max" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-black outline-none focus:border-navy transition" value={priceRange.max} onChange={(e) => setPriceRange({...priceRange, max: e.target.value})} />
               </div>
            </div>
          </div>

          <div className="bg-blue-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
             <div className="relative z-10">
                <h4 className="text-xl font-black mb-4 uppercase leading-tight">Post Your Ad Fast & Secure</h4>
                <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-8 leading-relaxed">Reach millions of potential buyers today.</p>
                <Link to="/post-ad" className="inline-block bg-white text-blue-900 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-50 transition shadow-lg">Get Started →</Link>
             </div>
             <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          </div>
        </aside>

        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-12 border-b border-slate-100 pb-8">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Found <span className="text-slate-900">{filteredListings.length}</span> Results</p>
          </div>

          {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-80 bg-white animate-pulse rounded-[2rem]"></div>)}
             </div>
          ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
               {filteredListings.map(item => (
                  <div key={item._id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group border border-slate-100 flex flex-col">
                     <div className="relative h-64 overflow-hidden">
                        <img 
                          src={resolveImageUrl(item.image)} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        />
                        <div className="absolute top-6 left-6 flex flex-col gap-2">
                           {item.isFeatured && (
                             <span className="bg-blue-600 text-white text-[8px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] shadow-2xl flex items-center gap-2">
                               <span className="w-1.5 h-1.5 bg-white rounded-full animate-blink"></span> PRO BOOST
                             </span>
                           )}
                           <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[8px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] shadow-lg w-fit">
                             {item.subcategory || item.propertyType || item.category}
                           </span>
                        </div>
                        <div className="absolute bottom-6 left-6 right-6">
                           <div className="bg-slate-950/20 backdrop-blur-3xl text-white px-5 py-3 rounded-2xl border border-white/10 flex justify-between items-center translate-y-20 group-hover:translate-y-0 transition-transform duration-500">
                              <span className="text-[9px] font-black uppercase tracking-widest">{item.location}</span>
                              <span className="text-xs font-black">LKR {item.price?.toLocaleString()}</span>
                           </div>
                        </div>
                     </div>
                     <div className="p-8 flex-1 flex flex-col bg-white">
                        <div className="flex justify-between items-start mb-4">
                           <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight group-hover:text-blue-700 transition leading-tight line-clamp-2 pr-4">{item.title}</h3>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 line-clamp-2 leading-relaxed">
                           {item.description?.substring(0, 100)}...
                        </p>
                        <div className="mt-auto pt-6 border-t border-slate-50 flex justify-between items-center">
                           <div className="flex items-center gap-2 text-[10px] font-black text-blue-700 uppercase tracking-widest">
                              <span className="w-2 h-2 rounded-full bg-blue-700"></span> Live Ad
                           </div>
                           <Link to={item.type === 'VEHICLE' ? `/vehicle/${item._id}` : `/property/${item._id}`} className="text-[10px] font-black uppercase tracking-[0.3em] hover:text-blue-700 transition flex items-center gap-2">
                              View Details <span>→</span>
                           </Link>
                        </div>
                     </div>
                  </div>
               ))}
              </div>
          )}

          {/* STAGE 4: Load More / Footer Section Improvements */}
          <div className="flex flex-col items-center py-20 border-t border-slate-100 mt-20 text-center animate-in fade-in slide-in-from-bottom-10 duration-1000">
             <div className="w-1 h-20 bg-gradient-to-b from-blue-700 to-transparent rounded-full mb-10"></div>
             <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-4">The End Of The Line?</h2>
             <p className="text-slate-500 font-medium mb-12 max-w-sm">We've reached the current results limit. Upgrade your search or post your own listing today.</p>
             <div className="flex gap-4">
                <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="bg-slate-100 text-slate-900 px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition">Back To Top</button>
                <Link to="/post-ad" className="bg-blue-700 text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 transition shadow-2xl shadow-blue-700/20">Post Yours Now</Link>
             </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
