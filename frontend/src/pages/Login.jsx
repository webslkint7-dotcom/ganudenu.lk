import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row font-sans">
      {/* Left Side: Editorial Image & Brand Identity */}
      <section className="relative hidden md:flex md:w-1/2 lg:w-3/5 h-full min-h-screen overflow-hidden">
        <img
          alt="Luxury Property"
          className="absolute inset-0 w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnmPuC5xRx0Wb-Q2vN3mqnrZN5LV1_z_mnEYCoLWxGwvTAhM699vgRx_BJpwtZ9vhLZXeWCc6sLZPQYHl-vVQZYUKsiLZsSgi_C7w9fM3JPD8dL9Z4xjQudl8o_US-ENY0DeWzbWfKUMQcdYv8BxV2ABBu9p3lfBz_Gnfu3IDXSz94SaRcBSI02Vu6EvKEaMFtq-5d872CtztJ0Doju6HMrS0XC0ga9EIf7RL1GHnhDFnCuBcLI45euNhVN02frVKFg8cq7qxwjYrM"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        <div className="relative z-10 flex flex-col justify-between h-full w-full p-16 text-white">
          <div className="flex items-center gap-2">
            <span className="font-black text-3xl tracking-tighter">The Editorial</span>
          </div>
          <div className="max-w-xl">
            <h1 className="font-bold text-5xl lg:text-6xl tracking-tight mb-6 leading-tight">
              Curating the world's most <span className="text-yellow-300">extraordinary</span> assets.
            </h1>
            <p className="text-white/80 text-lg font-light leading-relaxed">
              Access an exclusive marketplace where every listing is a masterpiece. From heritage estates to bespoke automotive engineering.
            </p>
            <div className="mt-12 flex gap-8 border-t border-white/20 pt-8">
              <div>
                <p className="font-bold text-2xl">12k+</p>
                <p className="text-xs uppercase tracking-widest text-white/60">Verified Listings</p>
              </div>
              <div>
                <p className="font-bold text-2xl">4.9/5</p>
                <p className="text-xs uppercase tracking-widest text-white/60">Trust Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Right Side: Login Form */}
      <section className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 lg:p-20 bg-gray-50">
        {/* Mobile Brand Header */}
        <div className="md:hidden w-full mb-12 flex justify-center">
          <span className="font-black text-2xl tracking-tighter text-green-700">The Editorial</span>
        </div>
        <div className="w-full max-w-md">
          <div className="mb-10 text-center md:text-left">
            <h2 className="font-bold text-3xl text-gray-900 mb-2 tracking-tight">Welcome Back</h2>
            <p className="text-gray-500 font-medium">Please enter your details to access your account.</p>
          </div>
          {/* Tabs (Login / Sign Up) */}
          <div className="flex p-1 bg-gray-100 rounded-xl mb-8">
            <button className="flex-1 py-2.5 text-sm font-semibold rounded-lg bg-white shadow-sm text-green-700 transition-all">
              Login
            </button>
            <Link to="/signup" className="flex-1 py-2.5 text-sm font-semibold rounded-lg text-gray-500 hover:text-gray-900 text-center transition-all">
              Sign Up
            </Link>
          </div>
          {/* Form */}
          {error && <div className="mb-4 text-red-500">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 ml-1" htmlFor="email">Email Address</label>
              <input
                className="w-full px-4 py-3.5 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-green-700/40 text-gray-900 placeholder:text-gray-400 font-medium transition-all"
                id="email"
                name="email"
                placeholder="name@company.com"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500" htmlFor="password">Password</label>
                <a className="text-xs font-semibold text-green-700 hover:text-green-800 transition-colors" href="#">Forgot Password?</a>
              </div>
              <input
                className="w-full px-4 py-3.5 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-green-700/40 text-gray-900 placeholder:text-gray-400 font-medium transition-all"
                id="password"
                name="password"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center gap-3 px-1">
              <input className="w-4 h-4 rounded border-gray-300 text-green-700 focus:ring-green-700/20" id="remember" type="checkbox" />
              <label className="text-sm font-medium text-gray-500" htmlFor="remember">Keep me signed in for 30 days</label>
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-green-700 to-green-500 py-4 rounded-lg text-white font-bold tracking-tight shadow-lg hover:opacity-95 active:scale-[0.98] transition-all">
              Sign In to Marketplace
            </button>
          </form>
          {/* Divider */}
          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest">
              <span className="bg-gray-50 px-4 text-gray-400 font-bold">Or continue with</span>
            </div>
          </div>
          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-4">
            <button type="button" className="flex items-center justify-center gap-3 py-3 px-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-all active:scale-[0.98]">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path></svg>
              <span className="text-sm font-semibold text-gray-900">Google</span>
            </button>
            <button type="button" className="flex items-center justify-center gap-3 py-3 px-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-all active:scale-[0.98]">
              <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 24 24"><path d="M17.05 20.28c-.96 0-2.04-.6-3.23-.6-1.2 0-2.09.58-3.21.58-2.3 0-5.06-4.04-5.06-7.85 0-3.69 2.37-5.63 4.65-5.63 1.2 0 2.18.66 3.12.66.86 0 2.06-.7 3.39-.7 1.48 0 2.62.63 3.36 1.7-2.86 1.4-2.4 5.33.43 6.44-1.25 2.76-2.8 5.4-3.45 5.4zm-4.38-16.14c0-2.02 1.66-3.71 3.54-3.71.21 0 .42.02.58.05-.09 2.15-1.68 3.96-3.56 3.96-.2 0-.42-.02-.56-.05v-.25z"></path></svg>
              <span className="text-sm font-semibold text-gray-900">Apple</span>
            </button>
          </div>
          {/* Footer Links */}
          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap justify-center gap-6">
            <a className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-green-700 transition-colors" href="#">Privacy Policy</a>
            <a className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-green-700 transition-colors" href="#">Terms of Service</a>
            <a className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-green-700 transition-colors" href="#">Help Center</a>
          </div>
        </div>
      </section>
    </main>
  );
}
