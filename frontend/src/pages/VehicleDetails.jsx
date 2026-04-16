import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API from '../api';
import { resolveImageUrl } from '../utils/imageUrl';

function isVehicle(item) {
  const category = String(item?.category || '').toLowerCase();
  const type = String(item?.type || '').toLowerCase();
  return type === 'vehicle' || category.includes('vehic') || category.includes('car');
}

function normalizePhoneForTel(rawPhone) {
  const cleaned = String(rawPhone || '').replace(/[^\d+]/g, '');
  if (!cleaned) return '';
  if (cleaned.startsWith('+')) return cleaned;
  return `+${cleaned}`;
}

function normalizePhoneForWhatsApp(rawPhone) {
  const digits = String(rawPhone || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('94')) return digits;
  if (digits.startsWith('0')) return `94${digits.slice(1)}`;
  return digits;
}

export default function VehicleDetails() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [allListings, setAllListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [reviewText, setReviewText] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([API.get(`/listings/${id}`), API.get('/listings')])
      .then(([detailsRes, listingsRes]) => {
        const item = detailsRes.data;
        setListing(item);
        setSelectedImage(item?.image || '');
        setAllListings(listingsRes.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSending(true);
    try {
      const fullMessage = [`Ad: ${listing.title}`, `Price: LKR ${listing.price?.toLocaleString()}`, `Message:`, message.trim()].join('\n');
      await API.post('/messages', {
        receiver: listing.owner?._id || listing.owner,
        listing: listing._id,
        content: fullMessage
      });
      setMessage('');
      alert('Message sent successfully.');
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to send message. Please login and try again.');
    } finally {
      setSending(false);
    }
  };

  const similarAds = useMemo(() => {
    if (!listing) return [];
    return allListings.filter((item) => item._id !== listing._id && isVehicle(item)).slice(0, 5);
  }, [allListings, listing]);

  const nearbyAds = useMemo(() => {
    if (!listing) return [];
    const currentLocation = String(listing.location || '').toLowerCase();
    return allListings
      .filter((item) => item._id !== listing._id && isVehicle(item) && String(item.location || '').toLowerCase().includes(currentLocation))
      .slice(0, 5);
  }, [allListings, listing]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFF] flex flex-col">
        <Navbar isAuthenticated={!!localStorage.getItem('token')} />
        <div className="flex-1 flex items-center justify-center text-sm text-[#6D7480]">Loading vehicle details...</div>
        <Footer />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-[#F8FAFF] flex flex-col">
        <Navbar isAuthenticated={!!localStorage.getItem('token')} />
        <div className="flex-1 flex items-center justify-center text-sm text-red-600">Vehicle not found.</div>
        <Footer />
      </div>
    );
  }

  const vehicle = listing.vehicleDetails || {};
  const images = listing.images?.length ? listing.images : [listing.image].filter(Boolean);
  const activeImage = selectedImage || images[0] || '';
  const sellerPhoneRaw = listing.owner?.phone || '';
  const telPhone = normalizePhoneForTel(sellerPhoneRaw);
  const whatsappPhone = normalizePhoneForWhatsApp(sellerPhoneRaw);
  const whatsappMessage = encodeURIComponent(`Hi, I am interested in your ad: ${listing.title}`);
  const callHref = telPhone ? `tel:${telPhone}` : '';
  const whatsappHref = whatsappPhone ? `https://wa.me/${whatsappPhone}?text=${whatsappMessage}` : '';

  return (
    <div className="min-h-screen bg-[#F8FAFF] text-[#1F2328]">
      <Navbar isAuthenticated={!!localStorage.getItem('token')} />

      <section className="bg-white border-b border-[#ECEEF1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 text-sm text-[#8A9099]">
          <div className="flex flex-wrap items-center gap-2">
            <Link to="/" className="hover:text-[#0B1F5E] transition">Home</Link>
            <span>/</span>
            <Link to="/all-ads" className="hover:text-[#0B1F5E] transition">Classified Ads</Link>
            <span>/</span>
            <span className="text-[#434A54] line-clamp-1">{listing.title}</span>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)_300px] gap-4 lg:gap-6 items-start">
          <aside className="hidden lg:block bg-white border border-[#E7E9ED] rounded-sm p-4 sticky top-28">
            <h3 className="text-sm font-bold text-[#2B3036] mb-3">Overview</h3>
            <div className="space-y-2 text-sm">
              {['General Info', 'Description', 'Location', 'Write a Review'].map((item) => (
                <div key={item} className="h-9 px-3 border border-[#EEF0F3] bg-[#F9FAFB] text-[#6D7480] flex items-center">{item}</div>
              ))}
            </div>
          </aside>

          <section className="space-y-4">
            <div className="bg-white border border-[#E7E9ED] rounded-sm overflow-hidden">
              <div className="h-[280px] sm:h-[420px] bg-[#E9EDF2]">
                <img src={resolveImageUrl(activeImage)} alt={listing.title} className="w-full h-full object-cover" />
              </div>

              {images.length > 1 && (
                <div className="p-3 border-t border-[#EEF0F3] flex gap-2 overflow-x-auto">
                  {images.map((img, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`w-20 h-16 border ${activeImage === img ? 'border-[#0B1F5E]' : 'border-[#E7E9ED]'} overflow-hidden flex-shrink-0`}
                    >
                      <img src={resolveImageUrl(img)} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              <div className="p-4 sm:p-5 border-t border-[#EEF0F3]">
                <h1 className="text-[28px] font-extrabold text-[#2B3036] leading-tight">{listing.title}</h1>
                <p className="text-sm text-[#6D7480] mt-2">{listing.location || 'Sri Lanka'} • Posted on {new Date(listing.createdAt).toLocaleDateString()}</p>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div className="bg-[#F7F8FA] border border-[#E7E9ED] p-3">
                    <p className="text-[11px] text-[#9AA1AC] uppercase tracking-[0.14em] font-semibold">Make</p>
                    <p className="text-sm font-bold text-[#2B3036]">{vehicle.make || '-'}</p>
                  </div>
                  <div className="bg-[#F7F8FA] border border-[#E7E9ED] p-3">
                    <p className="text-[11px] text-[#9AA1AC] uppercase tracking-[0.14em] font-semibold">Model</p>
                    <p className="text-sm font-bold text-[#2B3036]">{vehicle.model || '-'}</p>
                  </div>
                  <div className="bg-[#F7F8FA] border border-[#E7E9ED] p-3">
                    <p className="text-[11px] text-[#9AA1AC] uppercase tracking-[0.14em] font-semibold">Year</p>
                    <p className="text-sm font-bold text-[#2B3036]">{vehicle.year || '-'}</p>
                  </div>
                  <div className="bg-[#F7F8FA] border border-[#E7E9ED] p-3">
                    <p className="text-[11px] text-[#9AA1AC] uppercase tracking-[0.14em] font-semibold">Mileage</p>
                    <p className="text-sm font-bold text-[#2B3036]">{vehicle.mileage ? `${Number(vehicle.mileage).toLocaleString()} km` : '-'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#24455C] h-20 rounded-sm text-white px-6 flex items-center justify-between">
              <p className="text-xl font-extrabold tracking-wide">SMARTPHONE LATEST PHONE</p>
              <span className="bg-white text-[#24455C] text-sm font-bold px-4 py-2">Purchase Now</span>
            </div>

            <div className="bg-white border border-[#E7E9ED] rounded-sm p-5">
              <h2 className="text-xl font-bold text-[#2B3036] mb-3">Description</h2>
              <p className="text-[#5E6672] leading-7 whitespace-pre-line">{listing.description || 'No description provided.'}</p>

              <h3 className="text-lg font-bold text-[#2B3036] mt-6 mb-3">Vehicle Features</h3>
              <ul className="space-y-2 text-[#5E6672]">
                {(vehicle.features?.length ? vehicle.features : listing.features || []).map((feature, idx) => (
                  <li key={`${feature}-${idx}`} className="flex items-start gap-2"><span className="text-[#0B1F5E] mt-1">•</span><span>{feature}</span></li>
                ))}
              </ul>
            </div>

            <div className="bg-[#24455C] h-20 rounded-sm text-white px-6 flex items-center justify-between">
              <p className="text-xl font-extrabold tracking-wide">SMARTPHONE LATEST PHONE</p>
              <span className="bg-white text-[#24455C] text-sm font-bold px-4 py-2">Purchase Now</span>
            </div>

            <div className="bg-white border border-[#E7E9ED] rounded-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold text-[#2B3036]">Location</h2>
                <span className="text-sm text-[#8A9099]">{listing.location || 'Sri Lanka'}</span>
              </div>
              <div className="h-56 bg-[#EEF1F5] border border-[#E2E6EB] flex items-center justify-center text-[#808894] text-sm">
                Map preview area
              </div>
            </div>

            <div className="bg-white border border-[#E7E9ED] rounded-sm p-5">
              <h2 className="text-xl font-bold text-[#2B3036] mb-3">Write a Review</h2>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={4}
                placeholder="Your comments..."
                className="w-full bg-[#F7F8FA] border border-[#E7E9ED] px-4 py-3 text-sm outline-none focus:border-[#0B1F5E] resize-none"
              />
              <button type="button" className="mt-3 h-10 px-5 bg-[#0B1F5E] text-white text-sm font-bold hover:bg-[#081742] transition">Submit Review</button>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="bg-white border border-[#E7E9ED] rounded-sm p-5 sticky top-28">
              <p className="text-3xl font-extrabold text-[#2B3036]">LKR {Number(listing.price || 0).toLocaleString()}</p>
              <div className="mt-4 border-t border-[#EEF0F3] pt-4 flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-[#E8EDF3] flex items-center justify-center text-[#2B3036] font-bold text-lg">
                  {listing.owner?.fullname?.[0] || 'U'}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#2B3036]">{listing.owner?.fullname || 'Seller'}</p>
                  <p className="text-xs text-[#8A9099]">Member since {new Date(listing.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <form onSubmit={handleSendMessage} className="mt-4 space-y-2">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  placeholder="Type message to seller..."
                  className="w-full bg-[#F7F8FA] border border-[#E7E9ED] px-3 py-2 text-sm outline-none focus:border-[#0B1F5E] resize-none"
                  required
                />
                <button type="submit" disabled={sending} className="w-full h-10 bg-[#111827] text-white text-sm font-semibold hover:bg-black transition disabled:opacity-60">
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </form>

              <div className="mt-4 space-y-2">
                <a
                  href={callHref || undefined}
                  onClick={(e) => {
                    if (!callHref) {
                      e.preventDefault();
                      alert('Seller phone number is not available for this ad.');
                    }
                  }}
                  className={`block h-10 text-white text-sm font-semibold px-3 flex items-center ${callHref ? 'bg-[#3B5998] hover:opacity-90' : 'bg-[#AEB8C9] cursor-not-allowed'}`}
                >
                  Call Seller
                </a>
                <a
                  href={whatsappHref || undefined}
                  target={whatsappHref ? '_blank' : undefined}
                  rel={whatsappHref ? 'noreferrer' : undefined}
                  onClick={(e) => {
                    if (!whatsappHref) {
                      e.preventDefault();
                      alert('Seller phone number is not available for this ad.');
                    }
                  }}
                  className={`block h-10 text-white text-sm font-semibold px-3 flex items-center ${whatsappHref ? 'bg-[#44A046] hover:opacity-90' : 'bg-[#A8BEA9] cursor-not-allowed'}`}
                >
                  WhatsApp Seller
                </a>
              </div>
            </div>

            <div className="bg-white border border-[#E7E9ED] rounded-sm p-4">
              <h3 className="text-sm font-bold text-[#2B3036] mb-2">Safety Tips For Deal</h3>
              <ol className="list-decimal pl-4 space-y-1 text-xs text-[#6D7480]">
                <li>Use a safe location to meet seller.</li>
                <li>Avoid cash transactions.</li>
                <li>Beware of unrealistic offers.</li>
              </ol>
            </div>

            <div className="bg-white border border-[#E7E9ED] rounded-sm p-4">
              <h3 className="text-sm font-bold text-[#2B3036] mb-3">Nearby Ads</h3>
              <div className="space-y-3">
                {nearbyAds.length === 0 && <p className="text-xs text-[#8A9099]">No nearby ads.</p>}
                {nearbyAds.map((item) => (
                  <Link key={item._id} to={`/vehicle/${item._id}`} className="flex gap-2 group">
                    <img src={resolveImageUrl(item.image)} alt={item.title} className="w-16 h-14 object-cover border border-[#E7E9ED]" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#2B3036] line-clamp-2 group-hover:text-[#0B1F5E] transition">{item.title}</p>
                      <p className="text-[11px] text-[#0B1F5E] font-bold mt-1">LKR {Number(item.price || 0).toLocaleString()}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-[#2B3036]">Similar Ads</h2>
            <Link to="/all-ads" className="text-sm text-[#6D7480] font-semibold hover:text-[#0B1F5E] transition">View All</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {similarAds.map((item) => (
              <Link key={item._id} to={`/vehicle/${item._id}`} className="bg-white border border-[#E7E9ED] rounded-sm overflow-hidden hover:shadow-[0_8px_18px_rgba(0,0,0,0.08)] transition">
                <div className="h-36 bg-[#EBEEF2]">
                  <img src={resolveImageUrl(item.image)} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <p className="text-[11px] text-[#8A8F99]">Vehicle</p>
                  <h3 className="text-[14px] font-bold text-[#222] line-clamp-2 min-h-[40px]">{item.title}</h3>
                  <p className="text-[11px] text-[#9197A3] mt-2">{item.location || 'Sri Lanka'}</p>
                  <p className="text-[#0B1F5E] font-extrabold text-[14px] mt-2">LKR {Number(item.price || 0).toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
