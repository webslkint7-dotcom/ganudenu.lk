import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans">
      <Navbar isAuthenticated={!!localStorage.getItem('token')} />

      {/* Hero Header */}
      <section className="bg-slate-900 text-white pt-32 pb-48 px-6 text-center relative overflow-hidden">
        <div className="relative z-10 animate-fadeIn">
          <h1 className="text-6xl font-black uppercase tracking-tighter mb-4">Connect With Us</h1>
          <p className="text-blue-400 font-bold uppercase tracking-[0.4em] text-xs">Verified Global Advisory & Support</p>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#f8fafc] to-transparent"></div>
      </section>

      <main className="max-w-7xl mx-auto px-6 -mt-32 relative z-10 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Contact Information Side */}
          <div className="space-y-8">
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 group hover:border-blue-700 transition-all">
              <div className="text-4xl mb-6">📍</div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Primary Headquarters</h3>
              <p className="text-slate-900 font-black text-lg">No. 120/A, Curated Lane,<br />Colombo 00700, Sri Lanka</p>
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 group hover:border-blue-700 transition-all">
              <div className="text-4xl mb-6">📞</div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Advisory Hotline</h3>
              <p className="text-slate-900 font-black text-lg">+94 77 123 4567<br />+94 11 987 6543</p>
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 group hover:border-blue-700 transition-all">
              <div className="text-4xl mb-6">✉️</div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Digital Correspondence</h3>
              <p className="text-slate-900 font-black text-lg">support@curated.lk<br />advisory@curated.lk</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[3rem] p-12 shadow-2xl border border-slate-50 relative overflow-hidden">
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-8 border-l-8 border-blue-700 pl-6">Send a Secure Message</h2>
              
              {submitted ? (
                <div className="bg-green-50 text-green-700 p-12 rounded-[2rem] text-center space-y-4 animate-in fade-in scale-in-95 duration-500">
                   <div className="text-5xl">🛡️</div>
                   <h3 className="text-2xl font-black uppercase">Transmission Received</h3>
                   <p className="font-medium">Our advisory team will reach out to you within 24 business hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-black text-slate-900 outline-none focus:border-blue-700 transition"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Email Repository</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-black text-slate-900 outline-none focus:border-blue-700 transition"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Inquiry Subject</label>
                    <input 
                      type="text" 
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-black text-slate-900 outline-none focus:border-blue-700 transition"
                      placeholder="e.g. Premium Asset Verification"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Professional Inquiry Content</label>
                    <textarea 
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      rows={6}
                      className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-6 py-6 font-medium text-slate-900 outline-none focus:border-blue-700 transition resize-none"
                      placeholder="Describe your inquiry in detail..."
                    ></textarea>
                  </div>

                  <button type="submit" className="w-full bg-slate-900 text-white font-black py-6 rounded-[2rem] hover:bg-black transition-all uppercase tracking-[0.2em] text-xs shadow-2xl active:scale-95">
                    Transmit Secure Message →
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* FAQ Section Trigger */}
        <section className="mt-24 bg-slate-900 rounded-[3rem] p-16 text-center text-white relative overflow-hidden">
           <div className="relative z-10">
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Looking for Instant Answers?</h2>
              <p className="text-slate-400 font-medium mb-10 max-w-xl mx-auto">Our digital orientation guide provides immediate responses to common operational inquiries.</p>
              <Link to="/faq" className="bg-blue-700 hover:bg-blue-600 px-12 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition shadow-xl inline-block">Explore FAQ Hub</Link>
           </div>
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-700/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        </section>
      </main>

      <Footer />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />
    </div>
  );
}
