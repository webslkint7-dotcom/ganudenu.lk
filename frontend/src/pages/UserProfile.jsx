import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API from '../api';
import { resolveImageUrl } from '../utils/imageUrl';

const initialProfile = {
  fullname: '',
  email: '',
  phone: '',
  bio: '',
  location: ''
};

export default function UserProfile() {
  const [profile, setProfile] = useState(initialProfile);
  const [originalProfile, setOriginalProfile] = useState(initialProfile);
  const [listings, setListings] = useState([]);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [securityMessage, setSecurityMessage] = useState('');
  const [securityError, setSecurityError] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const activeTab = searchParams.get('tab') === 'dashboard' ? 'dashboard' : 'profile';

  useEffect(() => {
    setLoading(true);
    Promise.all([API.get('/auth/me'), API.get('/listings/mine')])
      .then(([userRes, listingsRes]) => {
        const nextProfile = {
          fullname: userRes.data.fullname || '',
          email: userRes.data.email || '',
          phone: userRes.data.phone || '',
          bio: userRes.data.bio || '',
          location: userRes.data.location || ''
        };

        setProfile(nextProfile);
        setOriginalProfile(nextProfile);
        setListings(listingsRes.data || []);
        setError('');
      })
      .catch(() => {
        navigate('/login');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  function setTab(tab) {
    const next = new URLSearchParams(searchParams);
    if (tab === 'dashboard') {
      next.set('tab', 'dashboard');
    } else {
      next.delete('tab');
    }
    setSearchParams(next);
  }

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
        phone: res.data.phone || '',
        bio: res.data.bio || '',
        location: res.data.location || ''
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

  function handlePasswordFieldChange(e) {
    setPasswordForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handlePasswordChange(e) {
    e.preventDefault();
    setSecurityMessage('');
    setSecurityError('');

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setSecurityError('Please fill in all password fields.');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setSecurityError('New password must be at least 8 characters long.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setSecurityError('New password and confirm password do not match.');
      return;
    }

    setChangingPassword(true);
    try {
      const res = await API.put('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setSecurityMessage(res.data?.message || 'Password updated successfully.');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
    } catch (err) {
      setSecurityError(err.response?.data?.message || 'Unable to change password. Please try again.');
    } finally {
      setChangingPassword(false);
    }
  }

  function resolveListingRoute(item) {
    const normalizedType = String(item.type || '').toLowerCase();
    const normalizedCategory = String(item.category || '').toLowerCase();
    const hasPropertyDetails = Boolean(item.propertyDetails?.beds || item.propertyDetails?.baths || item.propertyDetails?.sqft);
    const hasVehicleDetails = Boolean(item.vehicleDetails?.make || item.vehicleDetails?.model || item.vehicleDetails?.year || item.vehicleDetails?.mileage);

    if (normalizedType === 'property' || normalizedCategory.includes('propert') || normalizedCategory.includes('land') || hasPropertyDetails) {
      return `/property/${item._id}`;
    }

    if (normalizedType === 'vehicle' || normalizedCategory.includes('vehicle') || hasVehicleDetails) {
      return `/vehicle/${item._id}`;
    }

    return `/property/${item._id}`;
  }

  const initials = profile.fullname
    ? profile.fullname
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase()
    : 'U';

  const portfolioSpotlightListing = listings.find((item) => item.isFeatured) || listings[0] || null;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFF] text-[#1F2328] flex flex-col">
        <Navbar isAuthenticated={!!localStorage.getItem('token')} />
        <div className="flex-1 flex items-center justify-center text-sm text-[#6D7480]">Loading profile...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFF] text-[#1F2328] flex flex-col">
      <Navbar isAuthenticated={!!localStorage.getItem('token')} />

      <section className="bg-white border-b border-[#ECEEF1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 text-sm text-[#8A9099]">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => navigate('/')} className="hover:text-[#0B1F5E] transition">Home</button>
            <span>/</span>
            <span className="text-[#434A54]">{activeTab === 'dashboard' ? 'Dashboard' : 'My Profile'}</span>
          </div>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        <section className="mb-6 bg-[#FFFFFF] border border-[#D9DEE8] rounded-sm p-6 sm:p-8">
          <h1 className="text-[30px] sm:text-[38px] font-extrabold text-[#262B31]">{activeTab === 'dashboard' ? 'Account Dashboard' : 'Account Profile'}</h1>
          <p className="text-[#6D7480] mt-2 max-w-3xl leading-7">
            {activeTab === 'dashboard'
              ? 'Track your listing activity and manage your ads from this dashboard section.'
              : 'Manage your account details, contact information, and public profile settings.'}
          </p>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-[280px_minmax(0,1fr)_300px] gap-6">
          <aside className="space-y-4">
            <div className="bg-white border border-[#E7E9ED] rounded-sm p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <div className="w-14 h-14 rounded-full bg-[#111827] text-white flex items-center justify-center text-lg font-bold mb-3">{initials}</div>
              <p className="font-bold text-[#2B3036] text-lg">{profile.fullname || 'Marketplace Member'}</p>
              <p className="text-sm text-[#6D7480] mt-1">{profile.location || 'Location not set'}</p>
            </div>

            <div className="bg-white border border-[#E7E9ED] rounded-sm p-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <button type="button" onClick={() => navigate('/')} className="w-full text-left h-10 px-3 text-sm font-semibold text-[#505863] hover:bg-[#F7F8FA]">Marketplace</button>
              <button type="button" onClick={() => setTab('dashboard')} className={`w-full text-left h-10 px-3 text-sm font-semibold ${activeTab === 'dashboard' ? 'bg-[#EAF0FF] text-[#0B1F5E]' : 'text-[#505863] hover:bg-[#F7F8FA]'}`}>Dashboard</button>
              <button type="button" onClick={() => navigate('/messaging')} className="w-full text-left h-10 px-3 text-sm font-semibold text-[#505863] hover:bg-[#F7F8FA]">Messages</button>
              <button type="button" onClick={() => setTab('profile')} className={`w-full text-left h-10 px-3 text-sm font-semibold ${activeTab === 'profile' ? 'bg-[#EAF0FF] text-[#0B1F5E]' : 'text-[#505863] hover:bg-[#F7F8FA]'}`}>Profile Settings</button>
            </div>

            <button onClick={handleLogout} className="w-full h-11 bg-[#111827] text-white text-sm font-bold hover:bg-[#000000] transition">
              Logout
            </button>
          </aside>

          <section>
            {activeTab === 'profile' ? (
              <div className="bg-white border border-[#E7E9ED] rounded-sm p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                  <h2 className="text-2xl font-extrabold text-[#2B3036]">Personal Details</h2>
                  {!editing ? (
                    <button type="button" className="h-10 px-5 bg-[#0B1F5E] text-white text-sm font-bold hover:bg-[#081742] transition" onClick={() => setEditing(true)}>
                      Edit Profile
                    </button>
                  ) : null}
                </div>

                {error && <div className="mb-4 rounded-sm bg-red-50 border border-red-100 text-red-600 px-4 py-3 text-sm">{error}</div>}
                {message && <div className="mb-4 rounded-sm bg-green-50 border border-green-100 text-green-700 px-4 py-3 text-sm">{message}</div>}

                <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#434A54] mb-2" htmlFor="fullname">Full Name</label>
                    <input id="fullname" name="fullname" value={profile.fullname} onChange={handleChange} className="w-full h-11 bg-[#F7F8FA] border border-[#E7E9ED] px-4 text-sm outline-none focus:border-[#0B1F5E]" disabled={!editing} />
                  </div>
                  <div>
                    <label className="block text-sm text-[#434A54] mb-2" htmlFor="email">Email Address</label>
                    <input id="email" name="email" value={profile.email} onChange={handleChange} className="w-full h-11 bg-[#F7F8FA] border border-[#E7E9ED] px-4 text-sm outline-none focus:border-[#0B1F5E]" disabled={!editing} />
                  </div>
                  <div>
                    <label className="block text-sm text-[#434A54] mb-2" htmlFor="phone">Phone Number</label>
                    <input id="phone" name="phone" value={profile.phone} onChange={handleChange} className="w-full h-11 bg-[#F7F8FA] border border-[#E7E9ED] px-4 text-sm outline-none focus:border-[#0B1F5E]" disabled={!editing} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-[#434A54] mb-2" htmlFor="bio">Bio</label>
                    <textarea id="bio" name="bio" value={profile.bio} onChange={handleChange} className="w-full min-h-[100px] bg-[#F7F8FA] border border-[#E7E9ED] px-4 py-3 text-sm outline-none focus:border-[#0B1F5E] resize-none" disabled={!editing} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-[#434A54] mb-2" htmlFor="location">Location</label>
                    <input id="location" name="location" value={profile.location} onChange={handleChange} className="w-full h-11 bg-[#F7F8FA] border border-[#E7E9ED] px-4 text-sm outline-none focus:border-[#0B1F5E]" disabled={!editing} />
                  </div>

                  {editing ? (
                    <div className="md:col-span-2 flex justify-end gap-3 mt-1">
                      <button type="button" className="h-10 px-5 bg-[#F2F4F7] text-[#505863] text-sm font-bold hover:bg-[#E8EBEF] transition" onClick={handleDiscard} disabled={saving}>
                        Discard
                      </button>
                      <button type="button" className="h-10 px-5 bg-[#0B1F5E] text-white text-sm font-bold hover:bg-[#081742] transition disabled:opacity-60" onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  ) : null}
                </form>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white border border-[#E7E9ED] rounded-sm p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[#9AA1AC] font-semibold">Total Listing Value</p>
                    <p className="text-2xl font-extrabold text-[#0B1F5E] mt-2">LKR {listings.reduce((acc, curr) => acc + (curr.price || 0), 0).toLocaleString()}</p>
                  </div>
                  <div className="bg-white border border-[#E7E9ED] rounded-sm p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[#9AA1AC] font-semibold">Active Listings</p>
                    <p className="text-2xl font-extrabold text-[#2B3036] mt-2">{listings.length}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {listings.map((item) => (
                    <div key={item._id} className="bg-white border border-[#E7E9ED] rounded-sm overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                      <div className="relative h-40 bg-[#EFF2F5]">
                        <img src={resolveImageUrl(item.image)} alt={item.title} className="w-full h-full object-cover" />
                        <span className={`absolute top-3 left-3 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${item.status === 'APPROVED' ? 'bg-[#44A046] text-white' : 'bg-[#F5B82E] text-[#3F320B]'}`}>
                          {item.status}
                        </span>
                      </div>
                      <div className="p-4">
                        <p className="text-[11px] uppercase tracking-[0.14em] text-[#9AA1AC] font-semibold">{item.type || 'Listing'}</p>
                        <h3 className="font-bold text-[#2B3036] line-clamp-1 mt-1">{item.title}</h3>
                        <p className="text-[#0B1F5E] font-extrabold text-lg mt-2">LKR {item.price?.toLocaleString()}</p>

                        <div className="flex gap-2 mt-4">
                          <Link to={`/edit-listing/${item._id}`} className="flex-1 h-10 bg-[#F7F8FA] border border-[#E7E9ED] text-[#505863] text-sm font-semibold inline-flex items-center justify-center hover:border-[#D9DDE3] transition">
                            Manage
                          </Link>
                          <Link to={resolveListingRoute(item)} className="flex-1 h-10 bg-[#111827] text-white text-sm font-semibold inline-flex items-center justify-center hover:bg-[#000000] transition">
                            View
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}

                  {listings.length === 0 && (
                    <div className="md:col-span-2 bg-white border border-[#E7E9ED] rounded-sm p-10 text-center text-[#8A9099]">
                      <div className="text-5xl mb-4">📦</div>
                      <h3 className="text-xl font-bold text-[#2B3036]">No listings yet</h3>
                      <p className="text-sm mt-2 mb-5">Create your first ad to see dashboard data here.</p>
                      <Link to="/post-ad" className="h-10 px-5 bg-[#0B1F5E] text-white text-sm font-bold inline-flex items-center hover:bg-[#081742] transition">
                        Post Your First Ad
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>

          <aside className="space-y-4">
            <div className="bg-white border border-[#E7E9ED] rounded-sm p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <h3 className="text-lg font-bold text-[#2B3036] mb-3">Account Security</h3>
              {securityError && <div className="mb-3 rounded-sm bg-red-50 border border-red-100 text-red-600 px-3 py-2 text-xs">{securityError}</div>}
              {securityMessage && <div className="mb-3 rounded-sm bg-green-50 border border-green-100 text-green-700 px-3 py-2 text-xs">{securityMessage}</div>}

              <div className="space-y-3 text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordForm((prev) => !prev);
                    setSecurityError('');
                    setSecurityMessage('');
                  }}
                  className="w-full text-left h-10 px-3 bg-[#F7F8FA] border border-[#E7E9ED] text-[#505863] hover:border-[#D9DDE3]"
                >
                  {showPasswordForm ? 'Cancel Password Update' : 'Reset Password'}
                </button>

                {showPasswordForm && (
                  <form onSubmit={handlePasswordChange} className="space-y-2">
                    <input
                      name="currentPassword"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordFieldChange}
                      placeholder="Current password"
                      className="w-full h-10 px-3 bg-[#F7F8FA] border border-[#E7E9ED] text-[#505863] outline-none focus:border-[#0B1F5E]"
                    />
                    <input
                      name="newPassword"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordFieldChange}
                      placeholder="New password"
                      className="w-full h-10 px-3 bg-[#F7F8FA] border border-[#E7E9ED] text-[#505863] outline-none focus:border-[#0B1F5E]"
                    />
                    <input
                      name="confirmPassword"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordFieldChange}
                      placeholder="Confirm new password"
                      className="w-full h-10 px-3 bg-[#F7F8FA] border border-[#E7E9ED] text-[#505863] outline-none focus:border-[#0B1F5E]"
                    />
                    <button
                      type="submit"
                      disabled={changingPassword}
                      className="w-full h-10 bg-[#111827] text-white text-sm font-semibold hover:bg-[#000000] transition disabled:opacity-60"
                    >
                      {changingPassword ? 'Updating...' : 'Update Password'}
                    </button>
                  </form>
                )}
              </div>
            </div>

            <div className="bg-white border border-[#E7E9ED] rounded-sm overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <img
                src={resolveImageUrl(portfolioSpotlightListing?.image)}
                alt={portfolioSpotlightListing?.title || 'Portfolio spotlight'}
                className="w-full h-36 object-cover"
              />
              <div className="p-4">
                <p className="text-[11px] uppercase tracking-[0.14em] text-[#9AA1AC] font-semibold mb-1">Portfolio Spotlight</p>
                <h4 className="font-bold text-[#2B3036] line-clamp-1">
                  {portfolioSpotlightListing?.title || 'No listing yet'}
                </h4>
                <p className="text-sm text-[#6D7480] mt-1">
                  {portfolioSpotlightListing ? 'Most-viewed listing in your portfolio.' : 'Create your first listing to show portfolio insights.'}
                </p>
                {portfolioSpotlightListing && (
                  <Link
                    to={resolveListingRoute(portfolioSpotlightListing)}
                    className="inline-flex mt-3 text-sm font-semibold text-[#0B1F5E] hover:text-[#081742] transition"
                  >
                    View listing →
                  </Link>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
