import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
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

  const illustrationSvg = `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 420" fill="none">
      <rect width="520" height="420" rx="24" fill="#F7F7F9"/>
      <path d="M96 78h112v110H96z" fill="#fff" stroke="#ECEEF2"/>
      <path d="M118 96h70" stroke="#EFF1F4" stroke-width="10" stroke-linecap="round"/>
      <path d="M115 120h76" stroke="#EFF1F4" stroke-width="10" stroke-linecap="round"/>
      <path d="M118 144h50" stroke="#EFF1F4" stroke-width="10" stroke-linecap="round"/>
      <path d="M186 184c0-20 16-36 36-36h74c20 0 36 16 36 36v110H186V184Z" fill="#0B1F5E" opacity="0.08"/>
      <path d="M214 202c20-16 49-18 68-4 18 14 26 40 20 62-5 18-18 32-34 41-20 10-45 11-64 2-4-18-5-40 3-60 4-12 1-28 7-41Z" fill="#FF6A88"/>
      <path d="M244 160h60c23 0 42 19 42 42v94h-144v-94c0-23 19-42 42-42Z" fill="#22272D"/>
      <path d="M252 201c0 20 16 36 36 36s36-16 36-36v-9h-72v9Z" fill="#FFB8A7"/>
      <circle cx="288" cy="185" r="20" fill="#FFB8A7"/>
      <path d="M278 182c0 7 5 12 12 12" stroke="#22272D" stroke-width="4" stroke-linecap="round"/>
      <circle cx="295" cy="181" r="2.5" fill="#22272D"/>
      <path d="M268 155c8-12 22-18 36-16 13 2 24 11 28 23 4 14 1 29-8 40l-10 12-58-11 12-48Z" fill="#0B1F5E"/>
      <path d="M242 265c10 10 28 15 44 13 14-2 27-10 35-23" stroke="#22272D" stroke-width="12" stroke-linecap="round"/>
      <path d="M180 312h84c0-18-18-32-42-32s-42 14-42 32Z" fill="#0B1F5E"/>
      <path d="M160 276c-17 5-30 18-34 36" stroke="#22272D" stroke-width="12" stroke-linecap="round"/>
      <path d="M336 282c18 6 30 18 34 36" stroke="#22272D" stroke-width="12" stroke-linecap="round"/>
      <path d="M360 94l20 10 22-4-10 20 10 20-22-4-20 10 4-22-10-20 22 4-16-14Z" fill="#E4E7EC"/>
      <path d="M58 300l24 54-24 46-27-10 13-38-16-38 30-14Z" fill="#0B1F5E"/>
      <path d="M82 292h46" stroke="#CDD3DB" stroke-width="10" stroke-linecap="round"/>
      <path d="M404 256h34" stroke="#CDD3DB" stroke-width="10" stroke-linecap="round"/>
      <circle cx="420" cy="184" r="18" fill="#EEF1F4"/>
      <path d="M414 184h12" stroke="#CDD3DB" stroke-width="4" stroke-linecap="round"/>
      <path d="M420 178v12" stroke="#CDD3DB" stroke-width="4" stroke-linecap="round"/>
    </svg>
  `)}`;

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
    <div className="min-h-screen bg-[#F6F6F8] text-[#222]">
      <Navbar isAuthenticated={!!localStorage.getItem('token')} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 text-sm text-[#8E97A3] flex items-center gap-2">
        <Link to="/" className="hover:text-[#0B1F5E] transition">Home</Link>
        <span>/</span>
        <span className="text-[#5B6470]">Sign Up</span>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center min-h-[calc(100vh-180px)]">
          <section className="hidden lg:flex flex-col items-center justify-center text-center px-6">
            <div className="w-full max-w-[460px]">
              <img src={illustrationSvg} alt="Sign up illustration" className="w-full h-auto" />
            </div>

            <div className="max-w-xl mt-8">
              <h1 className="text-[28px] md:text-[34px] font-extrabold text-[#22272D] leading-tight">Sign Up To Your Account</h1>
              <p className="text-sm md:text-[15px] leading-6 text-[#7A808A] mt-4 max-w-lg mx-auto">
                Create your account to post ads, manage your listings, and start buying or selling on the marketplace.
              </p>
              <Link
                to="/login"
                className="inline-flex mt-6 bg-[#0B1F5E] text-white px-8 h-11 items-center justify-center text-sm font-bold hover:bg-[#081742] transition"
              >
                Sign In
              </Link>
            </div>
          </section>

          <section className="flex items-center justify-center">
            <div className="w-full max-w-[420px] bg-white shadow-[0_12px_30px_rgba(0,0,0,0.08)] border border-[#ECEDEF] p-6 sm:p-8">
              <h2 className="text-[26px] font-extrabold text-[#22272D] leading-tight">Sign Up to your account</h2>
              <p className="text-sm text-[#7C8490] leading-6 mt-3">
                Fill in your details below to create a new account.
              </p>

              {error && (
                <div className="mt-5 p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-semibold">
                  {error}
                </div>
              )}
              {success && (
                <div className="mt-5 p-3 bg-green-50 border border-green-100 text-green-700 text-xs font-semibold">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-5 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fullname" className="block text-[12px] text-[#444B55] mb-2">Name</label>
                    <input
                      id="fullname"
                      type="text"
                      value={fullname}
                      onChange={(e) => setFullname(e.target.value)}
                      placeholder="Enter your name"
                      required
                      className="w-full h-11 px-4 bg-[#FAFAFB] border border-[#E5E7EB] text-sm outline-none focus:border-[#0B1F5E]"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-[12px] text-[#444B55] mb-2">Contact Number</label>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+CountryCodePhoneNumber"
                      className="w-full h-11 px-4 bg-[#FAFAFB] border border-[#E5E7EB] text-sm outline-none focus:border-[#0B1F5E]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-[12px] text-[#444B55] mb-2">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full h-11 px-4 bg-[#FAFAFB] border border-[#E5E7EB] text-sm outline-none focus:border-[#0B1F5E]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="password" className="block text-[12px] text-[#444B55] mb-2">Password</label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Your password"
                        required
                        className="w-full h-11 px-4 pr-16 bg-[#FAFAFB] border border-[#E5E7EB] text-sm outline-none focus:border-[#0B1F5E]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0A5AF] hover:text-[#22272D] text-sm"
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirm-password" className="block text-[12px] text-[#444B55] mb-2">Confirm Password</label>
                    <div className="relative">
                      <input
                        id="confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                        required
                        className="w-full h-11 px-4 pr-16 bg-[#FAFAFB] border border-[#E5E7EB] text-sm outline-none focus:border-[#0B1F5E]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((value) => !value)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0A5AF] hover:text-[#22272D] text-sm"
                      >
                        {showConfirmPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>
                </div>

                <label className="flex items-center gap-2 text-sm text-[#444B55]">
                  <input type="checkbox" className="w-4 h-4 accent-[#0B1F5E]" />
                  I agree to Terms & Condition
                </label>

                <button
                  type="submit"
                  className="w-full h-11 bg-[#0B1F5E] text-white text-sm font-bold hover:bg-[#081742] transition"
                >
                  Register
                </button>
              </form>

              <p className="text-center text-sm text-[#6F7781] mt-6">
                Already have an account?{' '}
                <Link to="/login" className="text-[#0B1F5E] font-semibold hover:underline">Sign In</Link>
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
