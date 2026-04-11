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

      <section className="bg-[#000033] py-24 lg:py-32 text-white relative overflow-hidden">
        {/* Modern Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] -ml-48 -mb-48"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl lg:text-7xl font-black mb-6 uppercase tracking-tighter text-white leading-none">
              Explore Our <br/> <span className="text-blue-500">Premium Marketplace</span>
            </h1>
            <p className="text-slate-300 text-lg font-medium max-w-xl mb-10 leading-relaxed">
              Find the perfect match from our curated collection of luxury properties and high-performance vehicles across Sri Lanka.
            </p>
            <div className="flex items-center gap-6">
               <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-[#000033] bg-slate-800 flex items-center justify-center text-[10px] font-black">U{i}</div>)}
               </div>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Trusted by <span className="text-white font-bold">50k+</span> Active Traders</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
        <div className="bg-white/80 backdrop-blur-2xl p-4 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/50 flex flex-col lg:flex-row gap-4 items-stretch">
          
          <div className="flex-[3] flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-slate-100 bg-slate-50/50 rounded-[2rem] border border-slate-100 overflow-hidden">
             {/* Key Search */}
             <div className="flex-1 px-8 py-4 flex items-center gap-4 group">
                <span className="text-lg opacity-40 group-focus-within:opacity-100 transition-opacity">🔍</span>
                <div className="flex flex-col flex-1">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 group-focus-within:text-blue-600 transition">Keywords</label>
                   <input 
                      type="text" 
                      placeholder="e.g. BMW M4, Luxury Villa..." 
                      className="bg-transparent border-none text-[11px] font-bold text-slate-900 outline-none placeholder-slate-300 uppercase tracking-wider"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                   />
                </div>
             </div>
             {/* Location */}
             <div className="flex-1 px-8 py-4 flex items-center gap-4 group relative">
                <span className="text-lg opacity-40 group-focus-within:opacity-100 transition-opacity">📍</span>
                <div className="flex flex-col flex-1">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 group-focus-within:text-blue-600 transition">Location</label>
                   <select 
                      className="bg-transparent border-none text-[11px] font-bold text-slate-900 outline-none appearance-none cursor-pointer uppercase tracking-wider pr-10"
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                   >
                      <option value="All">All Regions</option>
                      {SRI_LANKA_DISTRICTS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                   </select>
                </div>
                <div className="absolute right-8 pointer-events-none opacity-40">⌄</div>
             </div>
          </div>

          <button className="bg-blue-600 hover:bg-blue-700 text-white font-black px-10 py-5 rounded-[1.8rem] uppercase tracking-widest text-[10px] shadow-xl shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3">
             Search Now
          </button>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-4 gap-12">
        <aside className="space-y-6">
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100/50">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-slate-400">Categories</h3>
            <div className="space-y-2">
              {['All', 'Properties', 'Vehicles'].map(cat => (
                <button 
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`w-full text-left flex justify-between items-center px-4 py-3 rounded-xl transition-all ${categoryFilter === cat ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  <span className="text-[11px] font-bold uppercase tracking-wider">{cat}</span>
                  {categoryFilter === cat && <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>}
                </button>
              ))}
            </div>
          </div>

          {categoryFilter !== 'All' && subCategoriesMap[categoryFilter] && (
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100/50 animate-in fade-in slide-in-from-top-4 duration-300">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-slate-400">Sub Categories</h3>
              <div className="space-y-2">
                <button 
                   onClick={() => setSubcategoryFilter('All')}
                   className={`w-full text-left flex justify-between items-center px-4 py-3 rounded-xl transition-all ${subcategoryFilter === 'All' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  <span className="text-[11px] font-bold uppercase tracking-wider">All Types</span>
                  {subcategoryFilter === 'All' && <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>}
                </button>
                {subCategoriesMap[categoryFilter].map(sub => (
                  <button 
                    key={sub}
                    onClick={() => setSubcategoryFilter(sub)}
                    className={`w-full text-left flex justify-between items-center px-4 py-3 rounded-xl transition-all ${subcategoryFilter === sub ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    <span className="text-[11px] font-bold uppercase tracking-wider">{sub}</span>
                    {subcategoryFilter === sub && <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100/50">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-slate-400">Price Range</h3>
            <div className="space-y-3">
               <div className="grid grid-cols-2 gap-2">
                  <input type="number" placeholder="Min" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-[11px] font-bold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" value={priceRange.min} onChange={(e) => setPriceRange({...priceRange, min: e.target.value})} />
                  <input type="number" placeholder="Max" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-[11px] font-bold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" value={priceRange.max} onChange={(e) => setPriceRange({...priceRange, max: e.target.value})} />
               </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#000033] to-blue-900 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
             <div className="relative z-10">
                <h4 className="text-lg font-black mb-3 uppercase leading-tight tracking-tight">Post Your Ad Fast & Secure</h4>
                <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-6 leading-relaxed">Reach millions of potential buyers today.</p>
                <Link to="/post-ad" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition shadow-lg w-full text-center">Get Started →</Link>
             </div>
             <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
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
                  <Link key={item._id} to={item.type === 'VEHICLE' ? `/vehicle/${item._id}` : `/property/${item._id}`} className="bg-white rounded-2xl overflow-hidden shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 group border border-slate-100 flex flex-col hover:-translate-y-1">
                     <div className="relative h-56 overflow-hidden">
                        <img 
                          src={resolveImageUrl(item.image)} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        />
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                           {item.isFeatured && (
                             <span className="bg-blue-600 text-white text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                               <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span> PRO BOOST
                             </span>
                           )}
                           <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm w-fit">
                             {item.subcategory || item.propertyType || item.category}
                           </span>
                        </div>
                     </div>
                     <div className="p-5 flex-1 flex flex-col">
                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mb-3 font-semibold">
                          <span className="text-xs">📍</span> {item.location || 'All over Sri Lanka'}
                        </div>
                        <h3 className="font-bold text-slate-900 text-base mb-4 line-clamp-2 leading-snug group-hover:text-blue-600 transition truncate uppercase tracking-tight">
                          {item.title}
                        </h3>
                        <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] mb-2 font-bold uppercase tracking-widest">
                              <span>🛠️</span> {item.subcategory || item.propertyType || item.category}
                            </div>
                            <div className="text-red-600 font-bold text-lg flex items-center tracking-tight">
                              <span className="text-[10px] mr-1">LKR</span>{item.price?.toLocaleString()}
                            </div>
                          </div>
                          <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                            ➜
                          </div>
                        </div>
                     </div>
                  </Link>
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
