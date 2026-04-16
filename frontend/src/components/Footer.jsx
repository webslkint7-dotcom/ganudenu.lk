import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#1C1D22] text-white pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
        <div>
          <h3 className="text-[28px] font-extrabold tracking-tight text-white">ganudenu.lk</h3>
          <p className="text-[#A0A5AF] text-sm leading-6 mt-4">
            A modern classified marketplace for property, vehicles, electronics, and services across Sri Lanka.
          </p>
          <div className="flex items-center gap-2 mt-6">
            {['F', 'X', 'I', 'Y'].map((item) => (
              <span key={item} className="w-8 h-8 rounded-sm bg-white/10 hover:bg-[#0B1F5E] transition inline-flex items-center justify-center text-xs font-bold cursor-pointer">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-[0.12em] mb-4 text-white">Contact Details</h4>
          <ul className="space-y-2 text-sm text-[#A7ADB8]">
            <li>15 Flower Street, Colombo</li>
            <li>+94 71 234 5678</li>
            <li>admin@ganudenu.lk</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-[0.12em] mb-4 text-white">Quick Links</h4>
          <ul className="space-y-2 text-sm text-[#A7ADB8]">
            <li><Link to="/all-ads" className="hover:text-[#0B1F5E] transition">All Ads</Link></li>
            <li><Link to="/post-ad" className="hover:text-[#0B1F5E] transition">Add Post</Link></li>
            <li><Link to="/messages" className="hover:text-[#0B1F5E] transition">Messages</Link></li>
            <li><Link to="/contact" className="hover:text-[#0B1F5E] transition">Contact Us</Link></li>
            <li><Link to="/faq" className="hover:text-[#0B1F5E] transition">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-[0.12em] mb-4 text-white">Newsletter</h4>
          <p className="text-sm text-[#A7ADB8] mb-3">Get market updates and new listing alerts every week.</p>
          <form className="flex">
            <input
              type="email"
              placeholder="Your email"
              className="h-10 px-3 bg-white/10 border border-white/20 text-sm w-full focus:outline-none focus:border-[#0B1F5E]"
            />
            <button
              type="button"
              className="h-10 px-4 bg-[#0B1F5E] text-white text-sm font-semibold hover:bg-[#081742] transition"
            >
              Send
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#8A919D]">
        <p>Copyright 2026 ganudenu.lk. All rights reserved.</p>
        <div className="flex items-center gap-5">
          <Link to="/contact" className="hover:text-[#0B1F5E] transition">Contact</Link>
          <Link to="/faq" className="hover:text-[#0B1F5E] transition">Help</Link>
        </div>
      </div>
    </footer>
  );
}
