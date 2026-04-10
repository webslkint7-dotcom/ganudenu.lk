import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API from '../api';
import { resolveImageUrl } from '../utils/imageUrl';

export default function VehiclesList() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const brands = ['BMW', 'Mercedes', 'Audi', 'Tesla', 'Toyota', 'Honda'];
  const fuelTypes = ['Electric', 'Hybrid', 'Gasoline', 'Diesel'];

  useEffect(() => {
    API.get('/listings')
      .then(res => {
        // Filter for items that look like vehicles
        const filtered = res.data.filter(l => 
          String(l.type || '').toUpperCase() === 'VEHICLE' || 
          String(l.category?.name || l.category || '').toLowerCase().includes('vehic')
        );
        setVehicles(filtered);
      })
      .catch(() => setError('Failed to load vehicles.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#f5f7fa] min-h-screen font-sans">
      <Navbar isAuthenticated={!!localStorage.getItem('token')} />

      {/* Hero Header */}
      <section className="bg-slate-900 py-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <h1 className="text-4xl font-black mb-2 uppercase tracking-tighter">Search Results for:</h1>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-500 uppercase tracking-widest">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <span>/</span>
            <span className="text-slate-400">Automotive Collection</span>
          </div>
        </div>
      </section>

      {/* Sub-Search Bar */}
      <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center px-4 py-2 border-r border-slate-100">
            <span className="mr-3 text-slate-400">📍</span>
            <select className="bg-transparent border-none w-full text-sm font-bold text-slate-700 outline-none">
              <option>Select Location</option>
              <option>California</option>
              <option>Florida</option>
              <option>Texas</option>
            </select>
          </div>
          <div className="flex items-center px-4 py-2 border-r border-slate-100">
            <span className="mr-3 text-slate-400">🚗</span>
            <select className="bg-transparent border-none w-full text-sm font-bold text-slate-700 outline-none">
              <option>Select Category</option>
              <option>Sedans</option>
              <option>SUVs</option>
              <option>Coupes</option>
              <option>Electric</option>
            </select>
          </div>
          <div className="flex items-center px-4 py-2">
            <span className="mr-3 text-slate-400">⌨️</span>
            <input type="text" placeholder="Search Brand, Model..." className="bg-transparent border-none w-full text-sm font-bold text-slate-700 outline-none placeholder-slate-300" />
          </div>
          <button className="bg-slate-900 hover:bg-blue-900 text-white font-black py-4 rounded-xl uppercase tracking-widest text-xs shadow-lg transition active:scale-95">
            Find Vehicle
          </button>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-4 gap-12">
        
        {/* Sidebar Filters */}
        <aside className="space-y-8">
          {/* Brand Filter */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex justify-between items-center text-slate-900">
              Brand <span className="text-blue-700">▴</span>
            </h3>
            <div className="space-y-3">
              {brands.map(brand => (
                <label key={brand} className="flex items-center gap-3 font-bold text-slate-500 text-sm cursor-pointer hover:text-blue-900 transition">
                  <input type="checkbox" className="w-4 h-4 rounded accent-blue-900" />
                  <span>{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* fuel Filter */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex justify-between items-center text-slate-900">
              Fuel Type <span className="text-blue-700">▴</span>
            </h3>
            <div className="space-y-3">
              {fuelTypes.map(fuel => (
                <label key={fuel} className="flex items-center gap-3 font-bold text-slate-500 text-sm cursor-pointer hover:text-blue-900 transition">
                  <input type="radio" name="fuel" className="w-4 h-4 accent-blue-900" />
                  <span>{fuel}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Year Range */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex justify-between items-center text-slate-900">
              Year Range <span className="text-blue-700">▴</span>
            </h3>
            <div className="flex gap-2">
              <input type="number" placeholder="Min Year" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:border-blue-700 transition" />
              <input type="number" placeholder="Max Year" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:border-blue-700 transition" />
            </div>
          </div>

          {/* Price Range */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex justify-between items-center text-slate-900">
              Price Range <span className="text-blue-700">▴</span>
            </h3>
            <div className="flex gap-2 mb-4">
              <input type="number" placeholder="Min Price" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:border-blue-700 transition" />
              <input type="number" placeholder="Max Price" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:border-blue-700 transition" />
            </div>
            <button className="w-full bg-slate-900 text-white font-black py-4 rounded-xl uppercase tracking-widest text-[10px] shadow-lg hover:bg-blue-900 transition">
              Apply Filters
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 border-b border-slate-100 pb-8">
            <div className="text-sm font-bold text-slate-400">
               Showing <span className="text-slate-900 font-black">1–{vehicles.length}</span> of <span className="text-slate-900 font-black">{vehicles.length}</span> results
            </div>
            <div className="flex items-center gap-4">
              <select className="bg-white border border-slate-100 rounded-full px-6 py-2 text-xs font-black uppercase text-slate-500 outline-none hover:border-blue-700 transition">
                <option>Featured First</option>
                <option>Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
              <div className="flex gap-1">
                 <button className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-lg active:scale-95 transition">▦</button>
                 <button className="w-10 h-10 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-300">☰</button>
              </div>
            </div>
          </div>

          {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {[1, 2, 3].map(i => <div key={i} className="h-96 bg-white animate-pulse rounded-3xl"></div>)}
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {vehicles.map(vehicle => {
                const specs = vehicle.vehicleDetails || {};
                return (
                  <div key={vehicle._id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
                    <div className="relative h-56 overflow-hidden bg-slate-100">
                      <img src={resolveImageUrl(vehicle.image)} alt={vehicle.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                         <span className="bg-slate-900 text-white text-[10px] px-2 py-1 rounded font-black tracking-widest uppercase shadow-md">Verified</span>
                         <span className="bg-blue-100 text-blue-900 text-[10px] px-2 py-1 rounded font-black tracking-widest uppercase">{specs.fuelType || 'Electric'}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="text-[10px] font-black text-blue-700 uppercase tracking-widest mb-2">{specs.make || 'BMW'} • {specs.year || '2024'}</div>
                      <h3 className="font-black text-slate-900 text-lg mb-4 line-clamp-1 uppercase tracking-tight group-hover:text-blue-700 transition">
                         {vehicle.title}
                      </h3>
                      <div className="text-slate-400 text-xs font-bold flex items-center gap-4 mb-6">
                         <span>🏁 {specs.mileage ? `${specs.mileage.toLocaleString()} km` : '0 km'}</span>
                         <span>⚙️ {specs.transmission || 'Auto'}</span>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                         <div className="text-slate-900 font-black text-xl">${vehicle.price?.toLocaleString()}</div>
                         <Link to={`/vehicle/${vehicle._id}`} className="bg-slate-900 text-white text-[10px] font-black px-4 py-2 rounded-lg uppercase tracking-widest hover:bg-blue-700 transition shadow-lg transition active:scale-95">
                           View Ad
                         </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center items-center gap-3">
            <button className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400">«</button>
            <button className="w-12 h-12 rounded-xl bg-slate-900 text-white font-black shadow-lg">1</button>
            <button className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center font-bold text-slate-500">2</button>
            <button className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400">»</button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
