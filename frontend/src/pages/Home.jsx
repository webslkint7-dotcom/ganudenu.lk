import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API_URL from '../config';
import { resolveImageUrl } from '../utils/imageUrl';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [listings, setListings] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    axios.get(`${API_URL}/categories`).then(res => {
      const allowed = ['Properties', 'Vehicles'];
      setCategories(res.data.filter(c => allowed.includes(c.name)));
    }).catch(console.error);
    axios.get(`${API_URL}/listings`).then(res => setListings(res.data)).catch(console.error);
    axios.get(`${API_URL}/listings/featured`).then(res => setFeatured(res.data)).catch(console.error);
    setIsAuthenticated(!!localStorage.getItem('token'));
  }, []);

  return (
    <div className="font-sans min-h-screen bg-[#F8F9FA] text-slate-900">
      <Navbar isAuthenticated={isAuthenticated} />

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative z-10 max-w-xl">
            <h1 className="text-5xl lg:text-7xl font-bold text-navy leading-[1.1] mb-8">
              Buy, sell and find <br />
              <span className="text-navy">just about anythink.</span>
            </h1>
            <p className="text-lg text-slate-500 mb-10 leading-relaxed max-w-md">
              Buy and sell everything from used cars to mobile phones and computers, or search for property, and more all over the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link to="/post-ad" className="bg-navy hover:bg-navy-light text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition shadow-xl active:scale-95 text-center">
                Post Your Ad Now +
              </Link>
              <Link to="/all-ads" className="bg-slate-50 text-navy px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition shadow-sm active:scale-95 text-center border border-slate-100">
                Explore Listings
              </Link>
            </div>
          </div>
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-[500px] h-[500px]">
              {/* Main Circular Image */}
              <div className="absolute inset-0 rounded-[100px] overflow-hidden rotate-[-5deg] shadow-2xl">
                <img
                  src="/assets/hero-bg.png"
                  alt="People laughing"
                  className="w-full h-full object-cover rotate-[5deg] scale-110"
                  onError={(e) => e.target.src = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80"}
                />
              </div>
              {/* Decorative background shape */}
              <div className="absolute -z-10 -top-20 -right-20 w-[600px] h-[600px] bg-[#EEF2F6] rounded-full blur-3xl opacity-50"></div>
            </div>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce cursor-pointer group z-20"
          onClick={() => document.getElementById('recommended-ads')?.scrollIntoView({ behavior: 'smooth' })}>
          <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-navy transition-colors">Scroll Down</span>
          <div className="w-6 h-10 border-2 border-slate-200 rounded-full flex justify-center p-1 group-hover:border-navy transition-colors">
            <div className="w-1 h-2 bg-slate-300 rounded-full group-hover:bg-navy transition-colors"></div>
          </div>
        </div>
      </section>

      {/* How it Work Section */}
      <section className="py-24 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-navy mb-16">How it Work</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 01 */}
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-100 text-left relative overflow-hidden group hover:shadow-xl transition-all duration-500">
              <div className="absolute top-6 right-8 text-7xl font-bold text-slate-50 group-hover:text-slate-100 transition-colors">01</div>
              <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center mb-8">
                <span className="text-3xl">👤</span>
              </div>
              <h3 className="text-xl font-bold text-navy mb-4">Create Account</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae. Donec non lorem erat. Sed vitae vene.
              </p>
            </div>

            {/* Step 02 */}
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-100 text-left relative overflow-hidden group hover:shadow-xl transition-all duration-500">
              <div className="absolute top-6 right-8 text-7xl font-bold text-slate-50 group-hover:text-slate-100 transition-colors">02</div>
              <div className="w-14 h-14 rounded-xl bg-orange-50 flex items-center justify-center mb-8">
                <span className="text-3xl">📋</span>
              </div>
              <h3 className="text-xl font-bold text-navy mb-4">Post a Ads</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eu aliquet odio. Nulla pretium congue eros, nec rhoncus mi.
              </p>
            </div>

            {/* Step 03 */}
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-100 text-left relative overflow-hidden group hover:shadow-xl transition-all duration-500">
              <div className="absolute top-6 right-8 text-7xl font-bold text-slate-50 group-hover:text-slate-100 transition-colors">03</div>
              <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center mb-8">
                <span className="text-3xl">📦</span>
              </div>
              <h3 className="text-xl font-bold text-navy mb-4">Start Earning</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Vestibulum quis consectetur est. Fusce hendrerit neque at facilisis facilisis. Praesent a pretium elit. Nulla aliquam puru.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Fresh recommended ads */}
      <section id="recommended-ads" className="py-24 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-navy mb-4">Featured ads</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {listings.slice(0, 12).map((item, idx) => {
              const detailsLink = item.category?.name === 'Vehicles' ? `/vehicle/${item._id}` : `/property/${item._id}`;
              return (
                <Link
                  key={item._id || idx}
                  to={detailsLink}
                  className="bg-white rounded-xl overflow-hidden shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 group border border-slate-100 flex flex-col hover:-translate-y-1"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img src={resolveImageUrl(item.image)} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    {idx === 0 && (
                      <div className="absolute top-4 left-0">
                        <div className="bg-[#FF4D4D] text-white text-xs font-bold px-3 py-1 uppercase tracking-wider -rotate-45 -translate-x-1/4">New</div>
                      </div>
                    )}
                    {idx === 2 || idx === 6 ? (
                      <div className="absolute top-4 left-0">
                        <div className="bg-[#FF4D4D] text-white text-xs font-bold px-3 py-1 uppercase tracking-wider -rotate-45 -translate-x-1/4">Urgent</div>
                      </div>
                    ) : null}
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-1.5 text-slate-500 text-sm mb-3 font-semibold">
                      <span className="text-xs">📍</span> {item.location || 'All over'}
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg mb-4 line-clamp-2 leading-snug group-hover:text-blue-600 transition truncate uppercase tracking-tight">
                      {item.title}
                    </h3>
                    <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-2 font-bold uppercase tracking-widest">
                          <span>🛠️</span> {item.category?.name || 'Category'}
                        </div>
                        <div className="text-red-600 font-bold text-xl flex items-center tracking-tight">
                          <span className="text-sm mr-1">$</span>{item.price?.toLocaleString()}
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all">
                        ➜
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-16 text-center">
            <Link to="/all-ads" className="inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-white px-8 py-3.5 rounded-lg font-semibold transition shadow-lg shadow-navy/20 active:scale-95">
              View Ads <span className="text-lg">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Top Category Section */}
      <section className="py-24 bg-[#F5F7FA]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-bold text-navy">Top Category</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {categories.map((cat, idx) => {
              const count = listings.filter(l => (l.category?.name || l.category) === cat.name).length;
              const subLinks = cat.name === 'Vehicles'
                ? ['Luxury Cars', 'Vintage Collections', 'Daily Drivers', 'Motorcycles']
                : ['Villas & Estates', 'Luxury Penthouses', 'Modern Lofts', 'Nordic Cabins'];

              return (
                <div key={cat._id || idx} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100/50 hover:shadow-xl transition-all duration-300">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="text-2xl font-black text-navy mb-1 uppercase tracking-tight">{cat.name}</h3>
                      <p className="text-sm text-slate-400 font-bold">({count?.toLocaleString()})</p>
                    </div>
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${idx === 1 ? 'bg-navy text-white shadow-lg shadow-navy/30' : 'bg-slate-50 text-navy'}`}>
                      {cat.name === 'Properties' ? <span className="text-2xl">🏘️</span> : cat.name === 'Vehicles' ? <span className="text-2xl">🏎️</span> : '📦'}
                    </div>
                  </div>

                  <ul className="space-y-4 mb-10">
                    {subLinks.map((sub, sIdx) => (
                      <li key={sIdx} className="group">
                        <Link to={`/all-ads?category=${cat.name}&sub=${sub}`} className="flex items-center gap-4 text-slate-600 text-base hover:text-navy transition font-semibold">
                          <span className="text-sm text-slate-300 group-hover:text-navy group-hover:translate-x-1 transition-transform">➜</span> {sub}
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <Link to={`/all-ads?category=${cat.name}`} className="text-lg font-black text-navy hover:text-navy-light transition flex items-center gap-2 group underline decoration-navy/20 underline-offset-8">
                    View All <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
