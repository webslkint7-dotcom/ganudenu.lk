import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const vehicles = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d',
    title: '2023 Porsche 911 Carrera S',
    price: 138500,
    badges: ['VERIFIED', "EDITOR'S PICK"],
    miles: '2,400 miles',
    location: 'Stuttgart, DE',
    details: ['3.2s 0-60', 'PDK Auto', 'Gas'],
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1511918984145-48de785d4c4e',
    title: '2022 BMW M5 CS',
    price: 124900,
    badges: ['VERIFIED'],
    miles: '11,000 miles',
    location: 'Munich, DE',
    details: ['627 HP', 'All-Wheel', 'Gas'],
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
    title: '2024 Tesla Model S Plaid',
    price: 89990,
    badges: ['VERIFIED', 'FULL ELECTRIC'],
    miles: 'Brand New',
    location: 'Palo Alto, CA',
    details: ['1,020 HP', '396 mi', 'Electric'],
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99',
    title: '1967 Jaguar E-Type',
    price: 185000,
    badges: ['HERITAGE EDITION'],
    miles: 'Fully Restored',
    location: 'London, UK',
    details: ['Vintage', 'Manual 4-Spd', 'Gas'],
  },
];

const brands = ['BMW', 'Mercedes', 'Audi', 'Tesla'];
const fuels = ['Electric', 'Hybrid', 'Gasoline'];

export default function VehiclesList() {
  const [selectedBrand, setSelectedBrand] = useState('BMW');
  const [selectedFuels, setSelectedFuels] = useState([]);

  return (
    <div className="bg-[#fafbfa] min-h-screen font-sans">
      <Navbar isAuthenticated={!!localStorage.getItem('token')} />

      <main className="max-w-7xl mx-auto flex gap-8 py-10 px-6">
        {/* Sidebar Filters */}
        <aside className="w-72 shrink-0">
          <div className="flex items-center gap-2 mb-4 text-green-900 font-bold text-lg">
            <span className="material-symbols-outlined">tune</span> Refine Search
          </div>
          <div className="mb-4">
            <label className="block font-bold mb-1">BRAND</label>
            <div className="flex gap-2 flex-wrap">
              {brands.map(brand => (
                <button
                  key={brand}
                  className={`px-3 py-1 rounded-full border ${selectedBrand === brand ? 'bg-yellow-400 text-zinc-900 font-bold border-yellow-400' : 'bg-zinc-100 text-zinc-700 border-zinc-200'}`}
                  onClick={() => setSelectedBrand(brand)}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block font-bold mb-1">YEAR RANGE</label>
            <div className="flex gap-2">
              <input className="w-1/2 border rounded-lg px-2 py-1" placeholder="Min" />
              <input className="w-1/2 border rounded-lg px-2 py-1" placeholder="Max" />
            </div>
          </div>
          <div className="mb-4">
            <label className="block font-bold mb-1">PRICE RANGE</label>
            <div className="flex items-center gap-2">
              <input type="range" min="0" max="260000" className="w-full accent-green-700" />
              <span className="text-xs">$0</span>
              <span className="text-xs">$260k+</span>
            </div>
          </div>
          <div className="mb-4">
            <label className="block font-bold mb-1">FUEL TYPE</label>
            <div className="flex flex-col gap-2">
              {fuels.map(fuel => (
                <label key={fuel} className="flex items-center gap-2 text-zinc-700">
                  <input type="checkbox" className="accent-green-700" /> {fuel}
                </label>
              ))}
            </div>
          </div>
          <button className="w-full bg-green-700 text-white font-bold py-3 rounded-lg shadow hover:bg-green-800 transition mb-2">Apply Filters</button>
          <button className="w-full text-green-700 underline text-sm">Clear all</button>
          <div className="bg-green-50 rounded-lg p-4 mt-6 text-green-900 text-sm">
            <b>Buy with Confidence</b><br />Our editorial team inspects every luxury vehicle for title clarity and mechanical integrity.
          </div>
        </aside>

        {/* Listings Section */}
        <section className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-zinc-400 text-sm mb-1">Home &gt; Marketplace &gt; <span className="text-green-900 font-bold">Vehicles</span></div>
              <h2 className="font-black text-2xl text-zinc-900 mb-1">Automotive Collection</h2>
              <div className="text-zinc-500 mb-2">Discover a curated selection of premium pre-owned vehicles, each verified for quality and heritage.</div>
            </div>
            <div>
              <label className="text-zinc-500 text-sm mr-2">Sort by:</label>
              <select className="border rounded-lg px-3 py-2">
                <option>Featured First</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
              </select>
            </div>
          </div>

          {/* Grid of Vehicles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vehicles.map(vehicle => (
              <div key={vehicle.id} className="bg-white rounded-xl shadow-lg overflow-hidden relative flex flex-col">
                <img src={vehicle.image} alt={vehicle.title} className="w-full h-56 object-cover" />
                <div className="absolute top-4 left-4 flex gap-2">
                  {vehicle.badges.map(b => (
                    <span key={b} className={`px-3 py-1 rounded-full text-xs font-bold ${b.includes('VERIFIED') ? 'bg-yellow-400 text-zinc-900' : 'bg-green-900 text-white'}`}>{b}</span>
                  ))}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="font-black text-lg mb-1">{vehicle.title}</div>
                  <div className="text-green-700 font-black text-lg mb-2">${vehicle.price.toLocaleString()}</div>
                  <div className="text-zinc-500 text-sm mb-1">{vehicle.miles} • {vehicle.location}</div>
                  <div className="flex gap-4 text-xs text-zinc-700 mb-4">
                    {vehicle.details.map((d, i) => <span key={i}>{d}</span>)}
                  </div>
                  <button className="bg-green-700 text-white font-bold py-2 rounded-lg hover:bg-green-800 transition mb-2">Inquire Now</button>
                  <button className="absolute top-4 right-4 bg-white/80 rounded-full p-2 text-xl">🤍</button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-10">
            <button className="w-10 h-10 rounded-lg border text-zinc-500">&lt;</button>
            <button className="w-10 h-10 rounded-lg bg-green-700 text-white font-bold">1</button>
            <button className="w-10 h-10 rounded-lg border text-zinc-500">2</button>
            <span className="mx-2 text-zinc-400">...</span>
            <button className="w-10 h-10 rounded-lg border text-zinc-500">12</button>
            <button className="w-10 h-10 rounded-lg border text-zinc-500">&gt;</button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white py-12 mt-12 border-t">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-black text-lg text-green-900">The Editorial Marketplace</span>
          <div className="flex flex-wrap gap-6 text-sm text-gray-500 font-medium">
            <a href="#">Terms of Service</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Safety Tips</a>
            <a href="#">Sell with Us</a>
            <a href="#">Contact Support</a>
          </div>
          <span className="text-xs text-gray-400">© 2024 The Editorial Marketplace. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
