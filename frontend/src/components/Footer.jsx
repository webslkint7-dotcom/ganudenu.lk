import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-navy pt-24 pb-12 text-white border-t-8 border-navy-light">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
        <div>
          <div className="mb-8">
            <span className="text-3xl font-black text-blue-500 tracking-tighter">THE</span>
            <span className="text-3xl font-black text-white tracking-tighter uppercase">EDITORIAL</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed mb-8 opacity-70 font-medium">
            The world's largest classified listing marketplace where performance meets luxury. Join millions of users today.
          </p>
          <div className="flex gap-4">
            {['f', 't', 'i', 'y'].map(s => (
              <div key={s} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-700 transition cursor-pointer font-black text-xs">{s.toUpperCase()}</div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-8 bg-navy-light/30 inline-block px-4 py-2 rounded-lg text-white">How to Sell Fast</h4>
          <ul className="space-y-3 text-slate-400 text-sm font-black uppercase tracking-widest leading-loose">
            <li className="hover:text-blue-400 cursor-pointer transition">Selling Tips</li>
            <li className="hover:text-blue-400 cursor-pointer transition">Membership</li>
            <li className="hover:text-blue-400 cursor-pointer transition">Banner Advertising</li>
            <li className="hover:text-blue-400 cursor-pointer transition">Promote Your Ad</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-8 bg-navy-light/30 inline-block px-4 py-2 rounded-lg text-white">Information</h4>
          <ul className="space-y-3 text-slate-400 text-sm font-black uppercase tracking-widest leading-loose">
            <li className="hover:text-blue-400 cursor-pointer transition">Company Contact</li>
            <li className="hover:text-blue-400 cursor-pointer transition">Blog & Articles</li>
            <li className="hover:text-blue-400 cursor-pointer transition">Terms of Service</li>
            <li className="hover:text-blue-400 cursor-pointer transition">Privacy Policy</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-8 bg-navy-light/30 inline-block px-4 py-2 rounded-lg text-white">Help & Support</h4>
          <ul className="space-y-3 text-slate-400 text-sm font-black uppercase tracking-widest leading-loose">
            <li className="hover:text-blue-400 cursor-pointer transition">Live Chat</li>
            <li><Link to="/faq" className="hover:text-blue-400 transition">FAQ</Link></li>
            <li className="hover:text-blue-400 cursor-pointer transition">How to Stay Safe</li>
            <li><Link to="/contact" className="hover:text-blue-400 transition">Contact Us</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-xs font-black text-slate-500 tracking-[0.3em] uppercase">© Copyright 2024 Editorial. All rights reserved.</p>
        <div className="flex gap-4 grayscale opacity-20">
          <div className="w-12 h-6 bg-white/20 rounded"></div>
          <div className="w-12 h-6 bg-white/20 rounded"></div>
          <div className="w-12 h-6 bg-white/20 rounded"></div>
        </div>
      </div>
    </footer>
  );
}
