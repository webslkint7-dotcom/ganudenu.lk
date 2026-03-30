import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

// Dummy data for demonstration
const listings = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    title: 'The Glass Pavilion',
    location: 'Highland Park, CA',
    price: 8450000,
    badges: ['FEATURED EDITORIAL', 'VERIFIED'],
    beds: 5,
    baths: 6,
    sqft: 6000,
    type: 'EXCLUSIVE LISTING',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b',
    title: 'Azure Bay Residence',
    location: 'Nice, French Riviera',
    price: 4200000,
    badges: ['COASTAL MODERN'],
    beds: 3,
    baths: 3,
    sqft: 3200,
    type: '',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae',
    title: 'Cedar Ridge Lodge',
    location: 'Aspen, Colorado',
    price: 2850000,
    badges: ['ALPINE RETREAT'],
    beds: 4,
    baths: 4,
    sqft: 4100,
    type: '',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
    title: 'The Meridian Loft',
    location: 'TriBeCa, New York',
    price: 6100000,
    badges: ['URBAN CORE'],
    beds: 2,
    baths: 2,
    sqft: 2400,
    type: '',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29',
    title: 'Rosegate Cottage',
    location: 'Cotswolds, UK',
    price: 1050000,
    badges: ['HERITAGE'],
    beds: 3,
    baths: 2,
    sqft: 1850,
    type: '',
  },
];

const categories = [
  { name: 'Residential' },
  { name: 'Commercial' },
  { name: 'Industrial' },
];

const amenities = [
  'Private Pool',
  'Home Gymnasium',
  'Wine Cellar',
  'Concierge Service',
];

export default function PropertyListings() {
  // Filter state (not functional yet)
  const [selectedCategory, setSelectedCategory] = useState('Residential');
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  return (
    <div className="bg-[#fafbfa] min-h-screen font-sans">
      <Navbar isAuthenticated={!!localStorage.getItem('token')} />

      <main className="max-w-7xl mx-auto flex gap-8 py-10 px-6">
        {/* Sidebar Filters */}
        <aside className="w-72 shrink-0">
          <h2 className="font-black text-2xl text-zinc-900 mb-2">Property</h2>
          <div className="text-zinc-500 mb-6">124 Curated Listings</div>
          <div className="mb-4">
            <label className="block font-bold mb-1">Location</label>
            <select className="w-full border rounded-lg px-3 py-2">
              <option>All Regions</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block font-bold mb-1">Category</label>
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat.name}
                  className={`px-3 py-1 rounded-full border ${selectedCategory === cat.name ? 'bg-yellow-400 text-zinc-900 font-bold border-yellow-400' : 'bg-zinc-100 text-zinc-700 border-zinc-200'}`}
                  onClick={() => setSelectedCategory(cat.name)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block font-bold mb-1">Price Range</label>
            <div className="flex gap-2">
              <input className="w-1/2 border rounded-lg px-2 py-1" placeholder="Min" />
              <input className="w-1/2 border rounded-lg px-2 py-1" placeholder="Max" />
            </div>
          </div>
          <div className="mb-4">
            <label className="block font-bold mb-1">Bedrooms</label>
            <div className="flex gap-2 flex-wrap">
              {['Any', 1, 2, 3, '4+'].map(b => (
                <button key={b} className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200">{b}</button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block font-bold mb-1">Bathrooms</label>
            <div className="flex gap-2 flex-wrap">
              {['Any', 1, 2, 3].map(b => (
                <button key={b} className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200">{b}</button>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <label className="block font-bold mb-1">Amenities</label>
            <div className="flex flex-col gap-2">
              {amenities.map(a => (
                <label key={a} className="flex items-center gap-2 text-zinc-700">
                  <input type="checkbox" className="accent-green-700" /> {a}
                </label>
              ))}
            </div>
          </div>
          <button className="w-full bg-green-700 text-white font-bold py-3 rounded-lg shadow hover:bg-green-800 transition">Apply Search Filters</button>
        </aside>

        {/* Listings Section */}
        <section className="flex-1">
          <div className="flex items-center gap-8 mb-6">
            <div className="flex gap-6 text-green-900 font-bold">
              <button className="border-b-2 border-green-700 pb-1">CURATED</button>
              <button>NEWEST</button>
              <button>PRICE: HIGH TO LOW</button>
            </div>
            <div className="ml-auto flex gap-2">
              <button className="text-2xl">☰</button>
              <button className="text-2xl">▦</button>
            </div>
          </div>

          {/* Featured Listing */}
          <div className="mb-8">
            <div className="relative rounded-xl overflow-hidden shadow-lg">
              <img src={listings[0].image} alt={listings[0].title} className="w-full h-72 object-cover" />
              <div className="absolute top-4 left-4 flex gap-2">
                {listings[0].badges.map(b => (
                  <span key={b} className={`px-3 py-1 rounded-full text-xs font-bold ${b === 'VERIFIED' ? 'bg-yellow-400 text-zinc-900' : 'bg-zinc-900 text-white'}`}>{b}</span>
                ))}
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 flex flex-col justify-end h-2/3">
                <div className="text-white text-2xl font-black mb-2">{listings[0].title}</div>
                <div className="text-zinc-200 flex items-center gap-4 text-sm mb-2">
                  <span>📍 {listings[0].location}</span>
                  <span>🛏 {listings[0].beds} Beds</span>
                  <span>🛁 {listings[0].baths} Baths</span>
                </div>
                <div className="flex justify-between items-end">
                  <div className="text-white font-bold text-lg">{listings[0].type}</div>
                  <div className="text-yellow-400 text-3xl font-black">${listings[0].price.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Grid of Listings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {listings.slice(1).map(listing => (
              <div key={listing.id} className="bg-white rounded-xl shadow-lg overflow-hidden relative">
                <img src={listing.image} alt={listing.title} className="w-full h-56 object-cover" />
                <button className="absolute top-4 right-4 bg-white/80 rounded-full p-2 text-xl">🤍</button>
                <div className="p-6">
                  <div className="text-green-900 font-bold text-xs mb-1">{listing.badges[0]}</div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-black text-lg">{listing.title}</div>
                    <div className="text-green-700 font-black text-lg">${listing.price.toLocaleString()}</div>
                  </div>
                  <div className="text-zinc-500 text-sm mb-1">{listing.location}</div>
                  <div className="flex gap-4 text-xs text-zinc-700">
                    <span>{listing.beds}BD</span>
                    <span>{listing.baths}BA</span>
                    <span>{listing.sqft.toLocaleString()} SQFT</span>
                  </div>
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
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <span className="font-black text-lg text-zinc-900 block mb-2">The Editorial</span>
            <div className="text-zinc-500 text-sm">CURATING THE WORLD'S FINEST MARKETPLACES FOR THE DISCERNING INDIVIDUAL.</div>
          </div>
          <div>
            <div className="font-bold mb-2">MARKETPLACE</div>
            <div className="flex flex-col gap-1 text-zinc-600 text-sm">
              <a href="#">VEHICLES</a>
              <a href="#" className="font-black text-green-900">PROPERTY</a>
              <a href="#">CURATED</a>
              <a href="#">AUCTION</a>
            </div>
          </div>
          <div>
            <div className="font-bold mb-2">SUPPORT</div>
            <div className="flex flex-col gap-1 text-zinc-600 text-sm">
              <a href="#">PRIVACY POLICY</a>
              <a href="#">TERMS OF SERVICE</a>
              <a href="#">COOKIE POLICY</a>
              <a href="#">CONTACT US</a>
            </div>
          </div>
          <div>
            <div className="font-bold mb-2">CONNECT</div>
            <div className="flex gap-4 text-green-900 text-xl">
              <a href="#">✉️</a>
              <a href="#">📞</a>
              <a href="#">💬</a>
            </div>
          </div>
        </div>
        <div className="text-xs text-zinc-400 text-center mt-8">© 2024 THE EDITORIAL MARKETPLACE. ALL RIGHTS RESERVED.</div>
      </footer>
    </div>
  );
}
