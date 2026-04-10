import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';

export default function SignUp() {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Password strength logic
  function getPasswordStrength(pw) {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (pw.length >= 12) score++;
    return score;
  }

  const strength = getPasswordStrength(password);
  let strengthLabel = '';
  let strengthColor = 'text-gray-400';
  if (password.length === 0) {
    strengthLabel = '';
  } else if (strength <= 2) {
    strengthLabel = 'Weak Password';
    strengthColor = 'text-red-500';
  } else if (strength === 3 || strength === 4) {
    strengthLabel = 'Medium Password';
    strengthColor = 'text-blue-500';
  } else if (strength >= 5) {
    strengthLabel = 'Strong Password';
    strengthColor = 'text-blue-900';
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please ensure both passwords are identical.');
      return;
    }

    try {
      await axios.post(`${API_URL}/auth/register`, { fullname, email, phone, password });
      setSuccess('Profile verification successful! Authenticating...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      if (!err.response) {
        setError('Marketplace connection unavailable. Please check your network or try again later.');
      } else {
        setError(err.response?.data?.message || 'Verification failed. Please review your details.');
      }
    }
  };

  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-2 font-sans bg-white">
      {/* Left Column: Dark Navy Editorial Impact */}
      <section className="relative hidden md:flex flex-col justify-end p-16 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img
            alt="Luxury Estate"
            className="w-full h-full object-cover opacity-40 grayscale"
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        </div>
        <div className="relative z-10 space-y-8">
          <div className="inline-block px-4 py-2 bg-white/5 backdrop-blur-md rounded-lg border border-white/10">
            <span className="text-white font-black text-xs tracking-[0.3em] uppercase">Est. 2024</span>
          </div>
          <h1 className="font-black text-6xl text-white leading-none tracking-tighter max-w-xl uppercase mb-8">
            Join the World's Most <span className="text-blue-500">Extraordinary</span> Marketplace.
          </h1>
          <div className="flex flex-wrap gap-4 pt-4">
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-4 rounded-2xl">
              <span className="text-blue-500 text-2xl">★</span>
              <div className="flex flex-col">
                <span className="text-white font-black text-lg leading-none">12k+</span>
                <span className="text-white/40 text-[11px] uppercase tracking-widest font-black">Verified Ads</span>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-4 rounded-2xl">
              <span className="text-blue-500 text-2xl">🛡️</span>
              <div className="flex flex-col">
                <span className="text-white font-black text-lg leading-none">Global</span>
                <span className="text-white/40 text-[11px] uppercase tracking-widest font-black">Secure Trade</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-12 left-12 z-10">
           <span className="font-black text-3xl text-white tracking-tighter">THE EDITORIAL.</span>
        </div>
      </section>

      {/* Right Column: Sign Up Form */}
      <section className="bg-white flex items-center justify-center p-8 md:p-24 relative overflow-y-auto">
        <div className="w-full max-w-md space-y-10">
          <div className="text-center md:text-left">
            <h2 className="font-black text-4xl text-slate-900 tracking-tighter uppercase mb-2">Create Account</h2>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Join our premium community today.</p>
          </div>

          {error && <div className="p-4 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100 uppercase tracking-wider">{error}</div>}
          {success && <div className="p-4 bg-blue-50 text-blue-900 text-xs font-bold rounded-xl border border-blue-100 uppercase tracking-wider">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1" htmlFor="fullname">Full Name</label>
                <input
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 text-slate-900 placeholder:text-slate-300 font-bold transition-all outline-none"
                  id="fullname"
                  placeholder="John Doe"
                  type="text"
                  value={fullname}
                  onChange={e => setFullname(e.target.value)}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1" htmlFor="email">Email</label>
                  <input
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 text-slate-900 placeholder:text-slate-300 font-bold transition-all outline-none"
                    id="email"
                    placeholder="name@mail.com"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1" htmlFor="password">Password</label>
                  <input
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 text-slate-900 placeholder:text-slate-300 font-bold transition-all outline-none"
                    id="phone"
                    placeholder="+1 234 567 890"
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1" htmlFor="password">Password</label>
                <div className="relative">
                  <input
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 text-slate-900 placeholder:text-slate-300 font-bold transition-all outline-none"
                    id="password"
                    placeholder="••••••••"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-900 transition"
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? '👁️' : '🕶️'}
                  </button>
                </div>
                <div className="flex gap-1 pt-2 px-1">
                   <div className={`h-1 flex-grow rounded-full ${strength > 0 ? (strength <= 2 ? 'bg-red-400' : strength <= 4 ? 'bg-blue-400' : 'bg-blue-900') : 'bg-slate-100'}`}></div>
                   <div className={`h-1 flex-grow rounded-full ${strength > 1 ? (strength <= 2 ? 'bg-red-400' : strength <= 4 ? 'bg-blue-400' : 'bg-blue-900') : 'bg-slate-100'}`}></div>
                   <div className={`h-1 flex-grow rounded-full ${strength > 2 ? (strength <= 4 ? 'bg-blue-400' : 'bg-blue-900') : 'bg-slate-100'}`}></div>
                   <div className={`h-1 flex-grow rounded-full ${strength > 4 ? 'bg-blue-900' : 'bg-slate-100'}`}></div>
                </div>
                {strengthLabel && <p className={`text-[9px] font-black uppercase tracking-widest mt-1 ${strengthColor}`}>{strengthLabel}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1" htmlFor="confirm-password">Confirm Password</label>
                <input
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 text-slate-900 placeholder:text-slate-300 font-bold transition-all outline-none"
                  id="confirm-password"
                  placeholder="••••••••"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-slate-900 hover:bg-blue-900 text-white font-black py-5 rounded-2xl uppercase tracking-[0.2em] text-sm shadow-xl transition-all active:scale-95">
               Create Secure Account
            </button>

            <p className="text-xs text-center text-slate-400 font-bold uppercase tracking-widest px-8 leading-loose">
              By joining, you agree to our{' '}
              <a className="text-blue-900 hover:underline" href="#">Terms</a> &{' '}
              <a className="text-blue-900 hover:underline" href="#">Privacy Policy</a>.
            </p>
          </form>

          <div className="pt-8 border-t border-slate-50 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Already a member?{' '}
              <Link className="text-blue-900 font-black hover:text-blue-700 transition" to="/login">Sign In</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
