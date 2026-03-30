
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [listings, setListings] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    axios.get('http://localhost:5000/api/categories').then(res => setCategories(res.data));
    axios.get('http://localhost:5000/api/listings').then(res => setListings(res.data));
    axios.get('http://localhost:5000/api/listings/featured').then(res => setFeatured(res.data));
    setIsAuthenticated(!!localStorage.getItem('token'));
  }, []);

  return (
    <div className="bg-[#fafbfa] min-h-screen font-sans">
      <Navbar isAuthenticated={isAuthenticated} />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 py-12 px-6 items-center">
        <div>
          <h1 className="text-5xl font-black leading-tight mb-4">
            CURATED <span className="text-green-700">AUTHORITY</span> IN TRADE.
          </h1>
          <p className="text-gray-600 mb-6">Discover a high-trust marketplace where every vehicle and property is treated as a featured story.</p>
          <div className="flex gap-2 mb-2">
            <input className="border rounded-l-lg px-4 py-3 w-1/2" placeholder="Search curated" />
            <select className="border px-4 py-3">
              <option>All Categories</option>
              {categories.map(cat => <option key={cat._id}>{cat.name}</option>)}
            </select>
            <button className="bg-green-700 text-white px-6 py-3 rounded-r-lg font-bold">Find →</button>
          </div>
          <div className="text-xs text-gray-500 mt-2">TRENDING: <span className="underline cursor-pointer">Vintage Porsches</span>, <span className="underline cursor-pointer">Mid-Century Villas</span></div>
        </div>
        <div className="flex flex-col gap-4 items-end">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden w-80">
            {featured[0] && (
              <img src={featured[0].image} alt="Featured" className="w-full h-48 object-cover" />
            )}
            <div className="p-4">
              <span className="bg-gray-100 text-xs px-2 py-1 rounded-full font-bold">FEATURED PROPERTY</span>
            </div>
          </div>
          <div className="flex gap-2">
            {featured.slice(1,3).map(f => (
              <img key={f._id} src={f.image} alt="Featured" className="w-24 h-20 object-cover rounded-lg shadow" />
            ))}
            <div className="bg-green-700 text-white rounded-lg flex flex-col justify-center items-center w-24 h-20 font-bold text-center">
              VERIFIED<br />EXCELLENCE
              <span className="text-xs font-normal mt-1">12,400 Quality Checks<br />Completed This Month</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black">Curated Categories</h2>
            <Link to="/property" className="text-green-900 font-semibold hover:underline">View All →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map(cat => (
              <Link to="/property" key={cat._id} className="bg-gray-50 rounded-xl p-6 flex flex-col items-center shadow-sm hover:shadow-md transition">
                <div className="text-4xl mb-2">{cat.icon || '📦'}</div>
                <div className="font-bold text-lg mb-1">{cat.name}</div>
                <div className="text-xs text-gray-500 text-center">{cat.description}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Picks */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-black">EDITORIAL PICKS</h2>
              <p className="text-gray-500 text-sm">The most compelling listings this week.</p>
            </div>
            <div className="flex gap-2">
              <button className="bg-yellow-600 text-white px-4 py-1 rounded-full text-xs font-bold">All</button>
              <button className="bg-gray-100 px-4 py-1 rounded-full text-xs font-bold">Vehicles</button>
              <Link to="/property" className="bg-gray-100 px-4 py-1 rounded-full text-xs font-bold hover:bg-yellow-100 transition">Property</Link>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.slice(0,5).map((item, idx) => (
              <div key={item._id || idx} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
                <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-2">
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold uppercase">{item.badges?.[0] || 'VERIFIED'}</span>
                    <span className="font-bold text-green-700 text-lg">${item.price?.toLocaleString()}</span>
                  </div>
                  <div className="font-black text-lg mb-1">{item.title}</div>
                  <div className="text-xs text-gray-500 mb-2">{item.location || '—'}</div>
                  <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg font-bold mt-auto self-end">View Details</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sell With Us */}
      <section className="bg-green-800 py-16 mt-12">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-black mb-4">READY TO SELL WITH<br />THE CURATORS?</h2>
          <p className="mb-8">Join the most trusted marketplace for premium assets. We provide professional photography and verified transaction security.</p>
          <div className="flex justify-center gap-4">
            <button className="bg-yellow-600 text-white px-8 py-3 rounded-lg font-bold">List Your Property</button>
            <button className="bg-white text-green-800 px-8 py-3 rounded-lg font-bold">Sell Your Vehicle</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-8 mt-12 border-t">
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
