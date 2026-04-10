import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../api';

const initialProfile = {
  fullname: '',
  email: '',
  bio: '',
  location: '',
};

export default function UserProfile() {
  const [profile, setProfile] = useState(initialProfile);
  const [originalProfile, setOriginalProfile] = useState(initialProfile);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    API.get('/auth/me')
      .then(res => {
        const nextProfile = {
          fullname: res.data.fullname || '',
          email: res.data.email || '',
          bio: res.data.bio || '',
          location: res.data.location || '',
        };

        setProfile(nextProfile);
        setOriginalProfile(nextProfile);
        setError('');
      })
      .catch(() => {
        // If not authenticated, redirect to login
        navigate('/login');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  function handleChange(e) {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  }

  async function handleSave() {
    setSaving(true);
    setError('');
    setMessage('');

    try {
      const res = await API.put('/auth/me', profile);
      const savedProfile = {
        fullname: res.data.fullname || '',
        email: res.data.email || '',
        bio: res.data.bio || '',
        location: res.data.location || '',
      };

      setProfile(savedProfile);
      setOriginalProfile(savedProfile);
      setEditing(false);
      setMessage('Profile updated successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save profile changes.');
    } finally {
      setSaving(false);
    }
  }

  function handleDiscard() {
    setProfile(originalProfile);
    setEditing(false);
    setError('');
    setMessage('');
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  }

  const initials = profile.fullname
    ? profile.fullname
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(part => part[0])
        .join('')
        .toUpperCase()
    : 'U';

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading your profile...</div>;
  }

  return (
    <div className="bg-[#fafbfa] min-h-screen font-sans">
      <Navbar isAuthenticated={!!localStorage.getItem('token')} />
      <div className="max-w-7xl mx-auto flex gap-8 py-10 px-6">
        {/* Sidebar */}
        <aside className="w-64 shrink-0">
          <div className="bg-white rounded-xl shadow p-6 mb-6 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-green-900 flex items-center justify-center text-white text-2xl font-black mb-2">{initials}</div>
            <div className="font-bold text-green-900">{profile.fullname || 'Logged-in Member'}</div>
            <div className="text-xs text-green-700 mb-2">{profile.location || 'Profile ready for setup'}</div>
          </div>
          <nav className="flex flex-col gap-2 text-zinc-700 font-semibold text-base">
            <button type="button" onClick={() => navigate('/')} className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-green-50 transition text-left"><span>🏠</span> Marketplace</button>
            <button type="button" onClick={() => navigate('/dashboard')} className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-green-50 transition text-left"><span>💾</span> Dashboard</button>
            <button type="button" onClick={() => navigate('/messaging')} className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-green-50 transition text-left"><span>💬</span> Messages</button>
            <button type="button" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-green-50 transition text-left"><span>🔔</span> Notifications</button>
            <button type="button" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 text-green-900 text-left"><span>⚙️</span> Settings</button>
          </nav>
          <button className="w-full bg-green-700 text-white font-bold py-3 rounded-lg shadow hover:bg-green-800 transition mt-8">Post Listing</button>
          <button onClick={handleLogout} className="w-full mt-4 bg-zinc-100 text-zinc-700 font-bold py-3 rounded-lg shadow hover:bg-zinc-200 transition">Logout</button>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <h1 className="text-4xl font-black mb-2">Account Profile</h1>
          <div className="text-zinc-500 mb-8">Manage your personal presence, track listing performance, and verify your curated authority across the marketplace.</div>

          {/* Stats and Curator Status */}
          <div className="flex gap-8 mb-8">
            <div className="bg-white rounded-xl shadow p-8 flex-1">
              <div className="text-xs font-bold text-green-700 mb-2">TOTAL IMPACT</div>
              <div className="text-5xl font-black mb-2">248k <span className="text-lg font-normal text-zinc-400">Views</span></div>
              <div className="flex gap-3 mb-2">
                <span className="bg-green-100 text-green-900 px-3 py-1 rounded-full text-xs font-bold">12 Active Listings</span>
                <span className="bg-yellow-100 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">Top 5% Curator</span>
              </div>
            </div>
            <div className="bg-green-700 text-white rounded-xl shadow p-8 w-80 flex flex-col justify-between">
              <div className="font-bold text-lg mb-2">Verified Curator Status</div>
              <div className="text-sm mb-4">Renewing in 4.2 days. You’ve maintained a 4.9 star rating for 12 consecutive months.</div>
            </div>
          </div>

          {/* Personal Details */}
          <div className="bg-white rounded-xl shadow p-8 mb-8">
            <div className="font-black text-xl mb-4">Personal Details</div>
            {error && <div className="mb-4 rounded-lg bg-red-50 text-red-700 px-4 py-3 text-sm">{error}</div>}
            {message && <div className="mb-4 rounded-lg bg-green-50 text-green-700 px-4 py-3 text-sm">{message}</div>}
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold mb-1">Full Name</label>
                <input name="fullname" value={profile.fullname} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" disabled={!editing} />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Email Address</label>
                <input name="email" value={profile.email} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" disabled={!editing} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold mb-1">Public Bio</label>
                <textarea name="bio" value={profile.bio} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 min-h-[60px]" disabled={!editing} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold mb-1">Location</label>
                <input name="location" value={profile.location} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" disabled={!editing} />
              </div>
              <div className="md:col-span-2 flex justify-end gap-4 mt-2">
                {editing ? (
                  <>
                    <button type="button" className="px-4 py-2 rounded-lg bg-zinc-100 text-zinc-700 font-bold" onClick={handleDiscard} disabled={saving}>Discard</button>
                    <button type="button" className="px-4 py-2 rounded-lg bg-green-700 text-white font-bold disabled:opacity-60" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
                  </>
                ) : (
                  <button type="button" className="px-4 py-2 rounded-lg bg-green-700 text-white font-bold" onClick={() => setEditing(true)}>Edit</button>
                )}
              </div>
            </form>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-80 shrink-0 flex flex-col gap-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="font-bold mb-2">Account Security</div>
            <div className="flex flex-col gap-2 text-sm">
              <a href="#" className="flex justify-between items-center py-1 border-b">Change Password <span>›</span></a>
              <div className="flex justify-between items-center py-1 border-b">Two-Factor Auth <span className="text-green-700 font-bold">ENABLED</span></div>
              <a href="#" className="flex justify-between items-center py-1">Download Data <span>⬇️</span></a>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <img src="https://images.unsplash.com/photo-1465101178521-c1a9136a3b99" alt="1968 E-Type Jag" className="w-full h-32 object-cover" />
            <div className="p-4">
              <div className="text-xs font-bold text-green-700 mb-1">FEATURED LISTING</div>
              <div className="font-black">1968 E-Type Jag</div>
              <div className="text-xs text-zinc-500">Most viewed in your portfolio</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
