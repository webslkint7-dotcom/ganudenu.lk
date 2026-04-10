import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ isAuthenticated }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="sticky top-0 z-50 w-full">
      {/* Top Bar - Clean & Professional */}
      <div className="bg-navy text-white/70 py-2 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-xs font-black uppercase tracking-[0.2em]">
          <div className="flex gap-6">
            <span className="flex items-center gap-1.5"><span className="text-blue-500">●</span> Premium Marketplace</span>
            <span className="flex items-center gap-1.5"><span className="text-blue-500">●</span> Verified Listings</span>
          </div>
          <div className="flex gap-6">
            {isAuthenticated ? (
              <button onClick={handleLogout} className="hover:text-white transition cursor-pointer">Sign Out</button>
            ) : (
              <Link to="/login" className="hover:text-white transition">Sign In</Link>
            )}
            <span className="text-white/20">|</span>
            <Link to="/signup" className="hover:text-white transition">Register</Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-100 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-navy rounded-xl flex items-center justify-center group-hover:bg-navy-light transition-colors shadow-lg">
              <span className="text-white font-black text-xl">E</span>
            </div>
            <div className="flex flex-col -gap-1">
              <span className="text-xl font-black text-navy tracking-tighter leading-none">THE EDITORIAL</span>
              <span className="text-[10px] font-black text-navy-light tracking-[0.3em] uppercase opacity-50">Classifieds</span>
            </div>
          </Link>

<div className="hidden lg:flex items-center gap-10">
  <Link to="/" className="text-sm font-black uppercase tracking-widest text-slate-400 hover:text-navy transition">Home</Link>
  <Link to="/all-ads" className="text-sm font-black uppercase tracking-widest text-slate-400 hover:text-navy transition">All Ads</Link>
  {isAuthenticated && <Link to="/messaging" className="text-sm font-black uppercase tracking-widest text-slate-400 hover:text-navy transition">Messages</Link>}
  <Link to="/contact" className="text-sm font-black uppercase tracking-widest text-slate-400 hover:text-navy transition">Contact</Link>
</div>

          {/* Action Area */}
          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <Link to="/profile" className="bg-white border border-slate-200 text-slate-900 px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-slate-50 transition shadow-sm active:scale-95 group">
                <div className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition">
                  <span className="text-xs">👤</span>
                </div>
                <span className="text-xs font-black uppercase tracking-widest">My Account</span>
              </Link>
            )}
            <Link to="/post-ad" className="bg-navy hover:bg-navy-light text-white px-6 py-3 rounded-xl flex items-center gap-3 transition shadow-lg active:scale-95 group">
              <span className="text-xs font-black uppercase tracking-widest">Post Your Ad</span>
              <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/20 transition">
                <span className="text-lg font-bold">+</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
