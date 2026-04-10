import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { identifier, password });
      localStorage.setItem('token', res.data.token);
      if (res.data.user?.role) {
        localStorage.setItem('role', res.data.user.role);
      }
      navigate(res.data.user?.role === 'ADMIN' ? '/admin' : '/');
    } catch (err) {
      if (!err.response) {
        setError('Marketplace connection unavailable. Please check your network or try again later.');
      } else {
        setError(err.response?.data?.message || 'Authentication failed. Please verify your credentials.');
      }
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row font-sans bg-white">
      {/* Left Side: Dark Navy Editorial Identity */}
      <section className="relative hidden md:flex md:w-1/2 lg:w-3/5 h-full min-h-screen overflow-hidden bg-slate-900">
        <img
          alt="Luxury Property"
          className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale"
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
        <div className="relative z-10 flex flex-col justify-between h-full w-full p-20 text-white">
          <div className="flex items-center gap-2">
            <span className="font-black text-4xl tracking-tighter uppercase">The Editorial.</span>
          </div>
          <div className="max-w-xl">
            <h1 className="font-black text-5xl lg:text-7xl tracking-tighter mb-8 leading-none uppercase">
              Curating the world's most <span className="text-blue-500 text-shadow-glow">extraordinary</span> assets.
            </h1>
            <p className="text-white/50 text-xl font-medium leading-relaxed max-w-lg mb-12">
              Access an exclusive marketplace where every listing is a masterpiece. From heritage estates to bespoke automotive engineering.
            </p>
            <div className="flex gap-12 border-t border-white/5 pt-12">
              <div>
                <p className="font-black text-4xl text-blue-500 mb-1">12k+</p>
                <p className="text-xs uppercase tracking-[0.3em] font-black text-white/30">Verified Ads</p>
              </div>
              <div>
                <p className="font-black text-4xl text-blue-500 mb-1">4.9/5</p>
                <p className="text-xs uppercase tracking-[0.3em] font-black text-white/30">Trust Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Right Side: Login Form */}
      <section className="flex-1 flex flex-col justify-center items-center p-8 md:p-12 lg:p-24 bg-white relative">
        {/* Mobile Header */}
        <div className="md:hidden w-full mb-12 text-center">
           <span className="font-black text-3xl tracking-tighter text-slate-900 uppercase">THE EDITORIAL.</span>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-12 text-center md:text-left">
            <h2 className="font-black text-4xl text-slate-900 mb-3 tracking-tighter uppercase">Welcome Back</h2>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Sign in to manage your collection.</p>
          </div>

          {/* Form */}
          {error && <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs font-black rounded-xl border border-red-100 uppercase tracking-widest">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1" htmlFor="identifier">Email or Mobile Number</label>
                <input
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 text-slate-900 placeholder:text-slate-300 font-bold transition-all outline-none"
                  id="identifier"
                  name="identifier"
                  placeholder="name@mail.com or +123456789"
                  type="text"
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400" htmlFor="password">Password</label>
                  <a className="text-xs font-black text-blue-900 hover:text-blue-700 transition uppercase tracking-widest" href="#">Forgot?</a>
                </div>
                <input
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 text-slate-900 placeholder:text-slate-300 font-bold transition-all outline-none"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-3 px-1">
              <input className="w-5 h-5 rounded-lg border-slate-200 text-blue-900 focus:ring-blue-900/20" id="remember" type="checkbox" />
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 cursor-pointer" htmlFor="remember">Keep me signed in</label>
            </div>

            <button type="submit" className="w-full bg-slate-900 hover:bg-blue-900 text-white font-black py-5 rounded-2xl uppercase tracking-[0.2em] text-sm shadow-2xl transition-all active:scale-[0.98]">
              Sign In to Marketplace
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-12">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-[0.4em] font-black text-slate-300">
              <span className="bg-white px-6">Security First</span>
            </div>
          </div>

          <div className="text-center pt-4">
             <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
               New to Editorial?{' '}
               <Link className="text-blue-900 font-black hover:text-blue-700 transition" to="/signup">Join Now</Link>
             </p>
          </div>
        </div>

        {/* Decorative Element */}
        <div className="absolute bottom-10 right-10 pointer-events-none opacity-[0.03] select-none hidden lg:block">
           <span className="font-black text-[12rem] uppercase leading-none tracking-tighter text-slate-900">EDTL</span>
        </div>
      </section>
    </main>
  );
}
