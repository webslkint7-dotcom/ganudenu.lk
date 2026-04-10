import React, { useState } from 'react';

export default function FilterModal({ isOpen, onClose, onApply, categories = [] }) {
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    location: '',
    type: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fadeIn">
      <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-md transition-all" onClick={onClose}></div>
      
      <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-10 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-4xl font-black text-green-900 tracking-tighter uppercase">Curated Discovery</h2>
            <div className="text-xs font-black text-gray-400 mt-1 tracking-widest italic">REFINING YOUR SEARCH PARAMETERS</div>
          </div>
          <button onClick={onClose} className="text-3xl font-light hover:rotate-90 transition-transform">✕</button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-10 space-y-10">
          
          {/* Category Chips */}
          <div>
            <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-4">Market Category</label>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setFilters(prev => ({ ...prev, category: '' }))}
                className={`px-6 py-2 rounded-full text-xs font-black transition-all ${!filters.category ? 'bg-green-700 text-white shadow-lg' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
              >
                ALL ASSETS
              </button>
              {categories.map(cat => (
                <button 
                  key={cat._id}
                  onClick={() => setFilters(prev => ({ ...prev, category: cat.name }))}
                  className={`px-6 py-2 rounded-full text-xs font-black transition-all ${filters.category === cat.name ? 'bg-yellow-600 text-white shadow-lg' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                >
                  {cat.name.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Type Logic */}
          <div>
            <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-4">Asset Classification</label>
            <div className="grid grid-cols-3 gap-4">
               {['PROPERTY', 'VEHICLE', 'OTHER'].map(t => (
                 <button
                   key={t}
                   onClick={() => setFilters(prev => ({ ...prev, type: t }))}
                   className={`p-4 rounded-2xl border-2 font-black text-xs tracking-tight transition-all
                   ${filters.type === t ? 'border-green-700 bg-green-50 text-green-900' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}
                 >
                   {t}
                 </button>
               ))}
            </div>
          </div>

          {/* Pricing Range */}
          <div>
            <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-4">Investment Scale ($)</label>
            <div className="flex gap-6 items-center">
              <div className="flex-1 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                <input 
                  name="minPrice"
                  type="number"
                  value={filters.minPrice}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-gray-100 rounded-2xl pl-8 pr-4 py-4 focus:bg-white focus:ring-2 focus:ring-green-700 outline-none transition-all text-sm font-bold"
                  placeholder="MINIMUM"
                />
              </div>
              <div className="h-0.5 w-4 bg-gray-200"></div>
              <div className="flex-1 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                <input 
                  name="maxPrice"
                  type="number"
                  value={filters.maxPrice}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-gray-100 rounded-2xl pl-8 pr-4 py-4 focus:bg-white focus:ring-2 focus:ring-green-700 outline-none transition-all text-sm font-bold"
                  placeholder="MAXIMUM"
                />
              </div>
            </div>
          </div>

          {/* Location Focus */}
          <div>
            <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-4">Regional Focus</label>
            <input 
              name="location"
              value={filters.location}
              onChange={handleChange}
              className="w-full bg-gray-50 border-gray-100 rounded-2xl px-6 py-4 focus:bg-white focus:ring-2 focus:ring-green-700 outline-none transition-all text-sm font-bold shadow-inner"
              placeholder="e.g. French Riviera, Manhattan..."
            />
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-10 bg-gray-50 border-t border-gray-100 flex gap-4">
          <button 
            onClick={() => setFilters({ category: '', minPrice: '', maxPrice: '', location: '', type: '' })}
            className="flex-1 py-4 text-sm font-black text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-widest"
          >
            Reset Catalog
          </button>
          <button 
            onClick={handleApply}
            className="flex-[2] bg-green-700 text-white py-4 rounded-2xl font-black text-sm shadow-xl hover:bg-green-800 transition-all active:scale-95 uppercase tracking-widest"
          >
            Apply Verification Filters
          </button>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}} />

    </div>
  );
}
