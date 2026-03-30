import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ isAuthenticated }) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
        <span className="font-black text-2xl text-green-900 tracking-tight">The Editorial Marketplace</span>
        <nav className="flex gap-8 text-green-900 font-semibold">
          <Link to="/vehicles" className="hover:underline">Vehicles</Link>
          <Link to="/property" className="hover:underline">Property</Link>
          <a href="#">Luxury</a>
          <a href="#">Verified</a>
        </nav>
        <div className="flex gap-4 items-center">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="px-4 py-2 rounded-lg bg-green-700 text-white font-bold hover:bg-green-800 transition-colors">Login</Link>
              <Link to="/signup" className="px-4 py-2 rounded-lg border border-green-700 text-green-700 font-bold hover:bg-green-700 hover:text-white transition-colors">Sign Up</Link>
            </>
          ) : (
            <>
              <button className="text-xl">📍</button>
              <button className="text-xl">🔔</button>
              <button className="text-xl">👤</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
