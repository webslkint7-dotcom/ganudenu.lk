import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API_URL from '../config';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!identifier.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const illustrationSvg = `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 420" fill="none">
      <rect width="520" height="420" rx="24" fill="#F7F7F9"/>
      <path d="M118 70h168a18 18 0 0 1 18 18v232a18 18 0 0 1-18 18H118a18 18 0 0 1-18-18V88a18 18 0 0 1 18-18Z" fill="#fff"/>
      <path d="M121 103h162" stroke="#F0F1F4" stroke-width="10" stroke-linecap="round"/>
      <rect x="150" y="138" width="104" height="16" rx="8" fill="#E9EBF0"/>
      <rect x="150" y="172" width="82" height="10" rx="5" fill="#EEF0F4"/>
      <rect x="150" y="196" width="116" height="10" rx="5" fill="#EEF0F4"/>
      <rect x="150" y="228" width="118" height="28" rx="8" fill="#0B1F5E"/>
      <circle cx="182" cy="154" r="18" fill="#0B1F5E" opacity="0.12"/>
      <circle cx="182" cy="154" r="11" fill="#0B1F5E"/>
      <path d="M214 327c38-25 59-68 53-112-3-26-17-49-40-63-29-18-66-17-94 2-28 19-44 51-41 85 4 43 36 77 79 88l43 0Z" fill="#455A64"/>
      <path d="M199 272c-8 20-9 38-3 57h49c3-17 6-31 12-44l-58-13Z" fill="#0B1F5E"/>
      <path d="M204 166c13-12 31-16 47-9 15 7 25 22 27 39 3 22-7 44-16 60-11 20-27 36-46 45-22 10-49 11-69 1 3-20 7-39 14-58 10-26 22-61 43-78Z" fill="#FFB8A7"/>
      <circle cx="239" cy="182" r="8" fill="#263238"/>
      <path d="M216 205c10 10 29 12 42 2" stroke="#263238" stroke-width="5" stroke-linecap="round"/>
      <path d="M174 246c-18 8-37 27-43 49" stroke="#263238" stroke-width="12" stroke-linecap="round"/>
      <path d="M268 242c18 8 29 22 34 43" stroke="#263238" stroke-width="12" stroke-linecap="round"/>
      <path d="M127 292c-22 0-36 13-36 28h84c0-17-17-28-48-28Z" fill="#0B1F5E"/>
      <path d="M289 115h52l18 9v15h-70v-24Z" fill="#EFF1F5"/>
      <circle cx="336" cy="142" r="16" fill="#111827"/>
      <path d="M327 142h18" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
      <path d="M336 133v18" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
      <path d="M384 92c31 0 56 25 56 56s-25 56-56 56-56-25-56-56 25-56 56-56Z" fill="#FFF" opacity="0.7"/>
      <path d="M382 112l9 20 22 3-16 15 4 22-19-10-19 10 4-22-16-15 22-3 9-20Z" fill="#E3E6EB"/>
      <path d="M78 110l25 58-25 74-29-10 19-64-21-48 36-10Z" fill="#455A64"/>
      <path d="M106 102l28 63-26 70" stroke="#CDD3DB" stroke-width="10" stroke-linecap="round"/>
    </svg>
  `)}`;

  return (
    <div className="min-h-screen bg-[#F6F6F8] text-[#222]">
      <Navbar isAuthenticated={!!localStorage.getItem('token')} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 text-sm text-[#8E97A3] flex items-center gap-2">
        <Link to="/" className="hover:text-[#0B1F5E] transition">Home</Link>
        <span>/</span>
        <span className="text-[#5B6470]">Sign In</span>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center min-h-[calc(100vh-180px)]">
          <section className="hidden lg:flex flex-col items-center justify-center text-center px-6">
            <div className="w-full max-w-[460px]">
              <img src={illustrationSvg} alt="Sign in illustration" className="w-full h-auto" />
            </div>

            <div className="max-w-xl mt-8">
              <h1 className="text-[28px] md:text-[34px] font-extrabold text-[#22272D] leading-tight">Sign In To Your Account</h1>
              <p className="text-sm md:text-[15px] leading-6 text-[#7A808A] mt-4 max-w-lg mx-auto">
                Access your account to manage listings, messages, saved ads, and post new vehicles or properties.
              </p>
              <Link
                to="/signup"
                className="inline-flex mt-6 bg-[#0B1F5E] text-white px-8 h-11 items-center justify-center text-sm font-bold hover:bg-[#081742] transition"
              >
                Sign Up
              </Link>
            </div>
          </section>

          <section className="flex items-center justify-center">
            <div className="w-full max-w-[420px] bg-white shadow-[0_12px_30px_rgba(0,0,0,0.08)] border border-[#ECEDEF] p-6 sm:p-8">
              <h2 className="text-[26px] font-extrabold text-[#22272D] leading-tight">Welcome Back, Please Sign in Account</h2>
              <p className="text-sm text-[#7C8490] leading-6 mt-3">
                Log in to continue managing your ads and account settings.
              </p>

              {error && (
                <div className="mt-5 p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-semibold">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-5 space-y-5">
                <div>
                  <label htmlFor="identifier" className="block text-[12px] text-[#444B55] mb-2">Email or Phone</label>
                  <input
                    id="identifier"
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter your email or phone number"
                    disabled={loading}
                    required
                    className="w-full h-11 px-4 bg-[#FAFAFB] border border-[#E5E7EB] text-sm outline-none focus:border-[#0B1F5E] disabled:opacity-60"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-[12px] text-[#444B55] mb-2">Password</label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Your password"
                      disabled={loading}
                      required
                      className="w-full h-11 px-4 pr-20 bg-[#FAFAFB] border border-[#E5E7EB] text-sm outline-none focus:border-[#0B1F5E] disabled:opacity-60"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      disabled={loading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0A5AF] hover:text-[#22272D] text-sm disabled:opacity-60"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 text-sm">
                  <label className="flex items-center gap-2 text-[#444B55]">
                    <input type="checkbox" className="w-4 h-4 accent-[#0B1F5E]" disabled={loading} />
                    Remember Me
                  </label>
                  <a href="#" className="text-[#0B1F5E] hover:underline text-xs">Forget Password</a>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-[#0B1F5E] text-white text-sm font-bold hover:bg-[#081742] transition disabled:bg-[#243B8A] disabled:cursor-not-allowed"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <p className="text-center text-sm text-[#6F7781] mt-6">
                Don't have an account?{' '}
                <Link to="/signup" className="text-[#0B1F5E] font-semibold hover:underline">Sign Up</Link>
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
