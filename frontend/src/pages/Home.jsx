import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API_URL from '../config';
import { resolveImageUrl } from '../utils/imageUrl';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [listings, setListings] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [activeBoostedIndex, setActiveBoostedIndex] = useState(0);

  useEffect(() => {
    axios.get(`${API_URL}/categories`).then(res => setCategories(res.data)).catch(console.error);
    axios.get(`${API_URL}/listings`).then(res => setListings(res.data)).catch(console.error);
    setIsAuthenticated(!!localStorage.getItem('token'));
  }, []);

  const getCategoryName = (listing) => {
    if (typeof listing?.category === 'string') return listing.category;
    return listing?.category?.name || 'Other';
  };

  const properties = listings.filter((item) => {
    const category = getCategoryName(item).toLowerCase();
    const type = (item.type || '').toLowerCase();
    return type === 'property' || category.includes('propert') || category.includes('land');
  });

  const vehicles = listings.filter((item) => {
    const category = getCategoryName(item).toLowerCase();
    const type = (item.type || '').toLowerCase();
    return type === 'vehicle' || category.includes('vehicle') || category.includes('car') || category.includes('bike') || category.includes('motor');
  });

  const visibleProperties = properties.slice(0, 5);
  const visibleVehicles = vehicles.slice(0, 5);
  const boostedListings = listings
    .filter((item) => item.isFeatured || (item.boostPackage && item.boostPackage !== 'Standard'))
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 10);

  useEffect(() => {
    if (boostedListings.length === 0) {
      setActiveBoostedIndex(0);
      return;
    }

    if (activeBoostedIndex >= boostedListings.length) {
      setActiveBoostedIndex(0);
    }
  }, [activeBoostedIndex, boostedListings.length]);

  useEffect(() => {
    if (boostedListings.length <= 1) return;

    const intervalId = setInterval(() => {
      setActiveBoostedIndex((prev) => (prev + 1) % boostedListings.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [boostedListings.length]);

  const popularLocationCounts = listings.reduce((acc, item) => {
    const key = (item.location || 'Sri Lanka').trim();
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const popularLocations = Object.entries(popularLocationCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const searchLink = `/all-ads?keyword=${encodeURIComponent(keyword)}&location=${encodeURIComponent(location)}`;

  const cardImageFallbacks = [
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=900&q=80'
  ];

  const locationImageFallbacks = [
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1d?auto=format&fit=crop&w=900&q=80'
  ];

  const locationImageMap = {
    colombo: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80',
    kandy: 'https://images.unsplash.com/photo-1509539796615-5ed58b07c3b6?auto=format&fit=crop&w=900&q=80',
    galle: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=80',
    negombo: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=80',
    jaffna: 'https://images.unsplash.com/photo-1465447142348-e9952c393450?auto=format&fit=crop&w=900&q=80',
    nuwaraeliya: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80',
    batticaloa: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=900&q=80',
    anuradhapura: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80',
    kurunegala: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=900&q=80',
    srilanka: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=900&q=80'
  };

  const getLocationImage = (name, idx) => {
    const normalized = String(name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    return locationImageMap[normalized] || locationImageFallbacks[idx % locationImageFallbacks.length];
  };

  const boostedBannerFallbacks = [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1549927681-0b673b8243ab?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80'
  ];

  const getBoostLabel = (item) => {
    if (item?.boostPackage === 'Elite') return 'Elite Boost';
    if (item?.boostPackage === 'Premium') return 'Premium Boost';
    return 'Boosted Ad';
  };

  const ListingStrip = ({ title, items, ribbonText, buttonText, bgClass, bgImage }) => (
    <section className="mb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[24px] md:text-[27px] font-extrabold text-[#212529]">{title}</h2>
          <Link to="/all-ads" className="text-sm font-semibold text-[#6C757D] hover:text-[#0B1F5E] transition">View All</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, idx) => {
            const categoryName = getCategoryName(item);
            const detailsLink = (item.type === 'VEHICLE' || categoryName.toLowerCase().includes('vehicle') || categoryName.toLowerCase().includes('car'))
              ? `/vehicle/${item._id}`
              : `/property/${item._id}`;

            return (
              <Link
                key={item._id || `${title}-${idx}`}
                to={detailsLink}
                className="bg-white border border-[#E8E8E8] rounded-[2px] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_18px_rgba(0,0,0,0.1)] transition"
              >
                <div className="relative h-56 bg-[#EBEEF2] overflow-hidden">
                  <img
                    src={resolveImageUrl(item.image) || cardImageFallbacks[idx % cardImageFallbacks.length]}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = cardImageFallbacks[idx % cardImageFallbacks.length];
                    }}
                  />
                  {idx === 0 && (
                    <span className="absolute top-2 left-2 bg-[#0B1F5E] text-white text-[11px] uppercase font-bold px-2.5 py-1 rounded">Featured</span>
                  )}
                </div>

                <div className="p-4">
                  <p className="text-[13px] font-semibold text-[#6F7885] mb-1">{categoryName}</p>
                  <h3 className="text-[16px] font-bold text-[#222] leading-6 line-clamp-2 min-h-[48px]">{item.title}</h3>
                  <p className="text-[14px] text-[#6F7885] mt-2">{item.location || 'Sri Lanka'}</p>
                  <p className="text-[#0B1F5E] font-extrabold text-[20px] mt-3">LKR {Number(item.price || 0).toLocaleString()}</p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className={`${bgClass} mt-6 rounded-sm min-h-[110px] sm:min-h-[128px] relative overflow-hidden text-white`}>
          {bgImage && (
            <img
              src={bgImage}
              alt="Section background"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/35"></div>

          <div className="relative z-10 h-full min-h-[110px] sm:min-h-[128px] flex items-center justify-between px-6 gap-4">
            <p className="text-xl md:text-2xl font-extrabold tracking-wide">{ribbonText}</p>
            <Link to="/all-ads" className="bg-white text-[#1A2A3A] text-sm font-bold px-5 py-2.5 rounded-sm hover:bg-[#F4F5F7] transition whitespace-nowrap">
              {buttonText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFF] text-[#1D1D1D]">
      <Navbar isAuthenticated={isAuthenticated} />

      <section className="bg-[#EEE9DF] pb-14 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(0,0,0,0.03) 25%, rgba(0,0,0,0.03) 26%, transparent 27%, transparent 74%, rgba(0,0,0,0.03) 75%, rgba(0,0,0,0.03) 76%, transparent 77%), linear-gradient(90deg, transparent 24%, rgba(0,0,0,0.03) 25%, rgba(0,0,0,0.03) 26%, transparent 27%, transparent 74%, rgba(0,0,0,0.03) 75%, rgba(0,0,0,0.03) 76%, transparent 77%), url("https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1600&q=80")',
            backgroundSize: '56px 56px, 56px 56px, cover',
            backgroundPosition: '0 0, 0 0, center',
            backgroundRepeat: 'repeat, repeat, no-repeat'
          }}
        ></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-20 text-center relative z-10">
          <p className="text-[#0B1F5E] font-semibold text-lg">Over {listings.length.toLocaleString()} active ads</p>
          <h1 className="text-[#24282D] font-extrabold text-4xl md:text-5xl leading-tight mt-3">
            Sri Lanka&apos;s Largest Classified Marketplace
          </h1>

          <div className="bg-white border border-[#E4E5E7] shadow-[0_14px_35px_rgba(0,0,0,0.12)] mt-10 p-5 rounded-sm text-left">
            <h2 className="text-lg font-bold text-[#333] mb-4">Classified Search</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Enter keywords"
                className="bg-[#F8F8F8] border border-[#E2E3E5] h-11 px-3 text-sm focus:outline-none focus:border-[#0B1F5E]"
              />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location"
                className="bg-[#F8F8F8] border border-[#E2E3E5] h-11 px-3 text-sm focus:outline-none focus:border-[#0B1F5E]"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mt-4">
              <button
                type="button"
                onClick={() => {
                  setKeyword('');
                  setLocation('');
                }}
                className="text-sm text-[#44A046] font-semibold hover:underline w-fit"
              >
                Reset Search
              </button>
              <div className="flex items-center gap-3">
                <Link to="/all-ads" className="text-sm text-[#0B1F5E] font-semibold hover:underline">Advanced Search</Link>
                <Link to={searchLink} className="bg-[#0B1F5E] text-white h-11 px-6 inline-flex items-center justify-center text-sm font-bold hover:bg-[#081742] transition">
                  Search Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="py-10">
        {boostedListings.length > 0 && (
          <section className="mb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[24px] md:text-[27px] font-extrabold text-[#212529]">Boosted Spotlight</h2>
                <Link to="/all-ads?boosted=true" className="text-sm font-semibold text-[#6C757D] hover:text-[#0B1F5E] transition">Show More</Link>
              </div>

              <div className="relative">
                {(() => {
                  const item = boostedListings[activeBoostedIndex];
                  const categoryName = getCategoryName(item);
                  const detailsLink = (item.type === 'VEHICLE' || categoryName.toLowerCase().includes('vehicle') || categoryName.toLowerCase().includes('car'))
                    ? `/vehicle/${item._id}`
                    : `/property/${item._id}`;

                  return (
                    <Link
                      key={item._id || `boosted-${activeBoostedIndex}`}
                      to={detailsLink}
                      className="relative h-64 sm:h-72 rounded-sm overflow-hidden group block"
                    >
                      <img
                        src={resolveImageUrl(item.image) || boostedBannerFallbacks[activeBoostedIndex % boostedBannerFallbacks.length]}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => {
                          e.currentTarget.src = boostedBannerFallbacks[activeBoostedIndex % boostedBannerFallbacks.length];
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent"></div>
                      <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-between text-white">
                        <div className="flex items-start justify-between gap-4">
                          <span className="bg-[#0B1F5E] text-white text-[11px] uppercase font-bold px-2.5 py-1 rounded tracking-wide">{getBoostLabel(item)}</span>
                          <span className="bg-white/20 text-white text-[11px] uppercase font-semibold px-2.5 py-1 rounded tracking-wide">{categoryName}</span>
                        </div>

                        <div>
                          <h3 className="text-2xl sm:text-[30px] font-extrabold text-white line-clamp-2 max-w-2xl">{item.title}</h3>
                          <p className="text-sm sm:text-base text-white mt-1">{item.location || 'Sri Lanka'}</p>
                          <p className="text-lg sm:text-xl font-extrabold text-white mt-2">LKR {Number(item.price || 0).toLocaleString()}</p>
                        </div>
                      </div>
                    </Link>
                  );
                })()}

                {boostedListings.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setActiveBoostedIndex((prev) => (prev - 1 + boostedListings.length) % boostedListings.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/45 text-white hover:bg-black/60 transition"
                      aria-label="Previous boosted ad"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveBoostedIndex((prev) => (prev + 1) % boostedListings.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/45 text-white hover:bg-black/60 transition"
                      aria-label="Next boosted ad"
                    >
                      ›
                    </button>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                      {boostedListings.map((_, idx) => (
                        <button
                          key={`boost-dot-${idx}`}
                          type="button"
                          onClick={() => setActiveBoostedIndex(idx)}
                          className={`w-2.5 h-2.5 rounded-full transition ${idx === activeBoostedIndex ? 'bg-white' : 'bg-white/45 hover:bg-white/75'}`}
                          aria-label={`Go to boosted slide ${idx + 1}`}
                        ></button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>
        )}

        <ListingStrip
          title="Real Estate Ads"
          items={visibleProperties}
          ribbonText="LOOKING FOR YOUR DREAM HOUSE?"
          buttonText="Purchase Now"
          bgClass="bg-gradient-to-r from-[#1C2D3A] via-[#243D4A] to-[#1C2D3A]"
          bgImage="https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1600&q=80"
        />

        <ListingStrip
          title="Vehicle Ads"
          items={visibleVehicles}
          ribbonText="BEST CARS FOR SALE TODAY"
          buttonText="Purchase Now"
          bgClass="bg-gradient-to-r from-[#212226] via-[#3D3F48] to-[#212226]"
          bgImage="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1600&q=80"
        />

        <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
          <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-sm border border-[#D9DEE8]">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[24px] font-extrabold text-[#2A2F34]">Popular Locations</h2>
              <Link to="/all-ads" className="text-sm text-[#6C757D] font-semibold hover:text-[#0B1F5E] transition">View All Locations</Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {popularLocations.map(([name, count], idx) => (
                <Link
                  key={name}
                  to={`/all-ads?location=${encodeURIComponent(name)}`}
                  className="group bg-white border border-[#E2E4E8] rounded-sm overflow-hidden block hover:border-[#0B1F5E] hover:shadow-[0_6px_18px_rgba(11,31,94,0.15)] transition"
                >
                  <div className="h-28 bg-[#CFD7DF]">
                    <img
                      src={getLocationImage(name, idx)}
                      alt={name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = locationImageFallbacks[idx % locationImageFallbacks.length];
                      }}
                    />
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <p className="font-bold text-[14px] text-[#2B3138] group-hover:text-[#0B1F5E]">{name}</p>
                    <span className="text-xs text-[#858D98]">{count} ads</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
          <div className="bg-white border border-[#D9DEE8] p-6 sm:p-8 rounded-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-[24px] font-extrabold text-[#2A2F34]">Browse by Category</h3>
                <p className="text-sm text-[#6C757D] mt-1">Choose a category to discover the latest listings quickly.</p>
              </div>
              <Link to="/all-ads" className="text-sm text-[#6C757D] font-semibold hover:text-[#0B1F5E] transition">View All Ads</Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories
                .filter((cat) => ['properties', 'vehicles'].includes((cat.name || '').toLowerCase()))
                .map((cat) => (
                <Link
                  key={cat._id || cat.name}
                  to={`/all-ads?category=${encodeURIComponent(cat.name)}`}
                  className="group bg-[#F8FAFF] border border-[#E2E6EF] rounded-sm p-5 hover:border-[#0B1F5E] hover:shadow-[0_8px_20px_rgba(11,31,94,0.15)] transition"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="w-10 h-10 bg-white border border-[#D9DEE8] text-[#0B1F5E] rounded-sm flex items-center justify-center text-lg font-bold">
                        {cat.name.toLowerCase().includes('propert') ? '🏠' : '🚗'}
                      </div>
                      <h4 className="text-[18px] font-extrabold text-[#2B3138] mt-3 group-hover:text-[#0B1F5E] transition">{cat.name}</h4>
                      <p className="text-sm text-[#6D7480] mt-1">{cat.name.toLowerCase().includes('propert') ? 'Houses, lands, and rental properties' : 'Cars, bikes, and other vehicles'}</p>
                    </div>
                    <span className="text-[#9AA1AC] group-hover:text-[#0B1F5E] transition text-lg">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
