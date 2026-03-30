import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';


export default function SignUp() {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
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
    strengthColor = 'text-yellow-500';
  } else if (strength >= 5) {
    strengthLabel = 'Strong Password';
    strengthColor = 'text-green-700';
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/auth/register', { fullname, email, password });
      setSuccess('Registration successful! Please log in.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-2 font-sans">
      {/* Left Column: Editorial Impact */}
      <section className="relative hidden md:flex flex-col justify-end p-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            alt="Luxury Estate"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3NDNoUiNU1t9WluTWQVvqZybriR8e1vnZjJjL0lkx6M4yZe62SRe7Htq13mwLbKQb6CS94a5Wj969dtIfoP_SYVAUkJGxQIl5ewV4Xvp2p7Wv9D89MIPmZAgbZx39srBTEaMT2TgOj8ynb_Ho4e076l68mMaVqBziCDi5lHxiFdrYfu76ouIM5yQuNdbkPK8qaZrmZnWc1Npe1FpFoP8qYWS0svq-pAMwJhyGG35k5L1aZy_NqQ3VG7fBBKjoUnBuFUDsFJLN2B0S"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-green-900/90 via-green-900/20 to-transparent"></div>
        </div>
        <div className="relative z-10 space-y-8">
          <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/10">
            <span className="text-white font-bold text-xs tracking-[0.2em] uppercase">Est. 2024</span>
          </div>
          <h1 className="font-black text-6xl text-white leading-[1.1] tracking-tight max-w-xl">
            Join the World's Most <span className="text-green-200">Extraordinary</span> Marketplace.
          </h1>
          <div className="flex flex-wrap gap-4 pt-4">
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 px-5 py-3 rounded-xl">
              <span className="material-symbols-outlined text-yellow-300" style={{fontVariationSettings: '"FILL" 1'}}>verified</span>
              <div className="flex flex-col">
                <span className="text-white font-bold text-sm leading-none">12k+</span>
                <span className="text-white/60 text-[10px] uppercase tracking-wider font-semibold">Verified Listings</span>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 px-5 py-3 rounded-xl">
              <span className="material-symbols-outlined text-yellow-300" style={{fontVariationSettings: '"FILL" 1'}}>shield_person</span>
              <div className="flex flex-col">
                <span className="text-white font-bold text-sm leading-none">Global</span>
                <span className="text-white/60 text-[10px] uppercase tracking-wider font-semibold">Verified Sellers Only</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-12 left-12 z-10">
          <span className="font-black text-2xl text-white uppercase tracking-widest">The Editorial</span>
        </div>
      </section>
      {/* Right Column: Sign Up Form */}
      <section className="bg-white flex items-center justify-center p-8 md:p-24 relative overflow-y-auto">
        <div className="w-full max-w-md space-y-10">
          <div className="space-y-2">
            <h2 className="font-bold text-3xl text-gray-900 tracking-tight">Create your account</h2>
            <p className="text-gray-500 font-medium">Access curated collections and exclusive auctions.</p>
          </div>
          {/* Social Sign-up */}
          <div className="grid grid-cols-2 gap-4">
            <button type="button" className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-all active:scale-95 min-w-0">
              <img alt="Google" className="w-5 h-5" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" />
              <span className="text-base font-semibold text-gray-900">Google</span>
            </button>
            <button type="button" className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-all active:scale-95 min-w-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.365 1.43c0 1.14-.93 2.07-2.07 2.07-1.14 0-2.07-.93-2.07-2.07C12.225.29 13.155-.64 14.295-.64c1.14 0 2.07.93 2.07 2.07zm6.09 6.09c0 1.14-.93 2.07-2.07 2.07-1.14 0-2.07-.93-2.07-2.07 0-1.14.93-2.07 2.07-2.07 1.14 0 2.07.93 2.07 2.07zm-6.09 6.09c0 1.14-.93 2.07-2.07 2.07-1.14 0-2.07-.93-2.07-2.07 0-1.14.93-2.07 2.07-2.07 1.14 0 2.07.93 2.07 2.07zm6.09 6.09c0 1.14-.93 2.07-2.07 2.07-1.14 0-2.07-.93-2.07-2.07 0-1.14.93-2.07 2.07-2.07 1.14 0 2.07.93 2.07 2.07z" fill="#000"/>
              </svg>
              <span className="text-base font-semibold text-gray-900">Apple</span>
            </button>
          </div>
          <div className="relative flex items-center gap-4">
            <div className="flex-grow h-px bg-gray-200"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Or with email</span>
            <div className="flex-grow h-px bg-gray-200"></div>
          </div>
          {/* Form */}
          {error && <div className="mb-4 text-red-500">{error}</div>}
          {success && <div className="mb-4 text-green-600">{success}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 px-1" htmlFor="fullname">Full Name</label>
                <input
                  className="w-full px-5 py-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-green-700/40 text-gray-900 placeholder:text-gray-400 font-medium transition-all"
                  id="fullname"
                  name="fullname"
                  placeholder="Alexander Sterling"
                  type="text"
                  value={fullname}
                  onChange={e => setFullname(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 px-1" htmlFor="email">Email Address</label>
                <input
                  className="w-full px-5 py-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-green-700/40 text-gray-900 placeholder:text-gray-400 font-medium transition-all"
                  id="email"
                  name="email"
                  placeholder="alexander@editorial.com"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 px-1" htmlFor="password">Password</label>
                <div className="relative">
                  <input
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-green-700/40 text-gray-900 placeholder:text-gray-400 font-medium transition-all"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <span
                    className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 cursor-pointer select-none"
                    onClick={() => setShowPassword((v) => !v)}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </div>
                {/* Strength Meter (dynamic) */}
                <div className="flex gap-1 pt-1 px-1">
                  <div className={`h-1 flex-grow rounded-full ${strength > 0 ? (strength <= 2 ? 'bg-red-500' : strength <= 4 ? 'bg-yellow-500' : 'bg-green-700') : 'bg-gray-200'}`}></div>
                  <div className={`h-1 flex-grow rounded-full ${strength > 1 ? (strength <= 2 ? 'bg-red-500' : strength <= 4 ? 'bg-yellow-500' : 'bg-green-700') : 'bg-gray-200'}`}></div>
                  <div className={`h-1 flex-grow rounded-full ${strength > 2 ? (strength <= 4 ? 'bg-yellow-500' : 'bg-green-700') : 'bg-gray-200'}`}></div>
                  <div className={`h-1 flex-grow rounded-full ${strength > 4 ? 'bg-green-700' : 'bg-gray-200'}`}></div>
                </div>
                {strengthLabel && (
                  <p className={`text-[10px] font-bold px-1 uppercase tracking-tighter ${strengthColor}`}>{strengthLabel}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 px-1" htmlFor="confirm-password">Confirm Password</label>
                <div className="relative">
                  <input
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-green-700/40 text-gray-900 placeholder:text-gray-400 font-medium transition-all"
                    id="confirm-password"
                    name="confirm-password"
                    placeholder="••••••••"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                  />
                  <span
                    className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 cursor-pointer select-none"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    title={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </div>
              </div>
            </div>
            <div className="pt-2">
              <button type="submit" className="w-full bg-gradient-to-r from-green-700 to-green-500 py-4 rounded-xl text-white font-bold text-base tracking-tight shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-200">
                Create Account
              </button>
            </div>
            <p className="text-[11px] text-center leading-relaxed text-gray-400 font-medium px-4">
              By signing up, you agree to our{' '}
              <a className="text-green-700 font-bold hover:underline" href="#">Terms of Service</a> and{' '}
              <a className="text-green-700 font-bold hover:underline" href="#">Privacy Policy</a>.
            </p>
          </form>
          <div className="pt-8 border-t border-gray-200 flex justify-center">
            <p className="text-sm font-medium text-gray-500">
              Already have an account?{' '}
              <Link className="text-green-700 font-bold hover:text-green-800 transition-colors" to="/login">Log In</Link>
            </p>
          </div>
        </div>
        {/* Decorative Element */}
        <div className="absolute bottom-8 right-8 pointer-events-none opacity-5 select-none">
          <span className="font-black text-8xl uppercase leading-none tracking-tighter text-gray-900">EDTL</span>
        </div>
      </section>
    </main>
  );
}
