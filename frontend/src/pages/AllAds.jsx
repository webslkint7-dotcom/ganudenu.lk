import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API from '../api';
import { resolveImageUrl } from '../utils/imageUrl';
import { SRI_LANKA_DISTRICTS } from '../utils/locations';

const CATEGORY_OPTIONS = ['All', 'Properties', 'Vehicles'];
const OFFER_OPTIONS = ['All', 'Sale', 'Rent', 'Wanted', 'Other'];

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80'
];

function normalizeText(value) {
  return String(value || '').toLowerCase();
}

function getCategoryName(item) {
  if (typeof item?.category === 'string') return item.category;
  return item?.category?.name || '';
}

function isProperty(item) {
  const category = normalizeText(getCategoryName(item));
  const type = normalizeText(item?.type);
  return category.includes('propert') || type === 'property';
}

function isVehicle(item) {
  const category = normalizeText(getCategoryName(item));
  const type = normalizeText(item?.type);
  return category.includes('vehic') || category.includes('car') || type === 'vehicle';
}

export default function AllAds() {
  const PAGE_SIZE = 8;
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || searchParams.get('keyword') || '');
  const [locationFilter, setLocationFilter] = useState(searchParams.get('location') || 'All');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || 'All');
  const [boostedOnly, setBoostedOnly] = useState(searchParams.get('boosted') === 'true');
  const [featuredOnly, setFeaturedOnly] = useState(searchParams.get('featured') === 'true');
  const [regularOnly, setRegularOnly] = useState(searchParams.get('regular') === 'true');
  const [offerFilter, setOfferFilter] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    API.get('/listings')
      .then((res) => setListings(res.data || []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category') || 'All';
    const normalizedCategory = CATEGORY_OPTIONS.includes(categoryFromUrl) ? categoryFromUrl : 'All';
    setCategoryFilter(normalizedCategory);
    const boostedParam = searchParams.get('boosted') === 'true';
    const featuredParam = searchParams.get('featured') === 'true';
    const regularParam = searchParams.get('regular') === 'true';

    if (boostedParam) {
      setBoostedOnly(true);
      setFeaturedOnly(false);
      setRegularOnly(false);
    } else if (featuredParam) {
      setBoostedOnly(false);
      setFeaturedOnly(true);
      setRegularOnly(false);
    } else if (regularParam) {
      setBoostedOnly(false);
      setFeaturedOnly(false);
      setRegularOnly(true);
    } else {
      setBoostedOnly(false);
      setFeaturedOnly(false);
      setRegularOnly(false);
    }
  }, [searchParams]);

  const syncedCategory = categoryFilter || 'All';

  const filteredListings = useMemo(() => {
    const items = listings.filter((item) => {
      const itemCategory = getCategoryName(item);
      const itemOffer = normalizeText(item?.offerType);
      const itemLocation = normalizeText(item?.location);
      const itemTitle = normalizeText(item?.title);

      const matchesInventory = isProperty(item) || isVehicle(item);
      const isBoosted = item.isFeatured || (item.boostPackage && item.boostPackage !== 'Standard');
      const isRegular = !item.isFeatured && (!item.boostPackage || item.boostPackage === 'Standard');

      const matchesStatus = boostedOnly
        ? isBoosted
        : featuredOnly
          ? item.isFeatured
          : regularOnly
            ? isRegular
            : true;

      const matchesCategory = syncedCategory === 'All' || itemCategory.toLowerCase().includes(syncedCategory.toLowerCase().slice(0, -1));
      const matchesOffer = offerFilter === 'All' || itemOffer === offerFilter.toLowerCase();
      const matchesLocation = locationFilter === 'All' || itemLocation.includes(locationFilter.toLowerCase());
      const matchesSearch = searchQuery.trim() === '' || itemTitle.includes(searchQuery.toLowerCase());
      const matchesMin = minPrice === '' || Number(item.price || 0) >= Number(minPrice);
      const matchesMax = maxPrice === '' || Number(item.price || 0) <= Number(maxPrice);

      return matchesInventory && matchesStatus && matchesCategory && matchesOffer && matchesLocation && matchesSearch && matchesMin && matchesMax;
    });

    const sorted = [...items];
    if (sortBy === 'price-asc') sorted.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    if (sortBy === 'price-desc') sorted.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    if (sortBy === 'newest') sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    return sorted;
  }, [boostedOnly, categoryFilter, featuredOnly, listings, locationFilter, maxPrice, minPrice, offerFilter, regularOnly, searchQuery, sortBy, syncedCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredListings.length / PAGE_SIZE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedListings = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredListings.slice(start, start + PAGE_SIZE);
  }, [currentPage, filteredListings]);

  const paginationPages = useMemo(() => {
    const maxVisible = 3;

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    const pages = [];
    for (let page = start; page <= end; page += 1) {
      pages.push(page);
    }

    return pages;
  }, [currentPage, totalPages]);

  const showingStart = filteredListings.length === 0 ? 0 : ((currentPage - 1) * PAGE_SIZE) + 1;
  const showingEnd = showingStart === 0 ? 0 : showingStart + paginatedListings.length - 1;

  const updateCategory = (value) => {
    setCategoryFilter(value);
    const next = new URLSearchParams(searchParams);
    if (value === 'All') next.delete('category'); else next.set('category', value);
    setSearchParams(next);
  };

  const setAdStatus = (status) => {
    const next = new URLSearchParams(searchParams);

    next.delete('boosted');
    next.delete('featured');
    next.delete('regular');

    if (status === 'boosted') {
      setBoostedOnly(true);
      setFeaturedOnly(false);
      setRegularOnly(false);
      next.set('boosted', 'true');
    } else if (status === 'featured') {
      setBoostedOnly(false);
      setFeaturedOnly(true);
      setRegularOnly(false);
      next.set('featured', 'true');
    } else if (status === 'regular') {
      setBoostedOnly(false);
      setFeaturedOnly(false);
      setRegularOnly(true);
      next.set('regular', 'true');
    } else {
      setBoostedOnly(false);
      setFeaturedOnly(false);
      setRegularOnly(false);
    }

    setSearchParams(next);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setLocationFilter('All');
    setCategoryFilter('All');
    setBoostedOnly(false);
    setFeaturedOnly(false);
    setRegularOnly(false);
    setOfferFilter('All');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
    setCurrentPage(1);
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-[#F8FAFF] text-[#1F2328]">
      <Navbar isAuthenticated={!!localStorage.getItem('token')} />

      <section className="bg-white border-b border-[#ECEEF1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 text-sm text-[#8A9099]">
          <div className="flex items-center gap-2">
            <Link to="/" className="hover:text-[#0B1F5E] transition">Home</Link>
            <span>/</span>
            <span className="text-[#434A54]">Search</span>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="mb-4 bg-white border border-[#E7E9ED] px-4 sm:px-5 py-4">
          <h1 className="text-[24px] sm:text-[28px] font-extrabold text-[#2B3036]">Classified Listings</h1>
          <p className="text-sm text-[#6D7480] mt-1">Browse the latest property and vehicle ads from across Sri Lanka.</p>
          {(boostedOnly || featuredOnly || regularOnly) && (
            <p className="text-xs font-semibold text-[#0B1F5E] mt-2">
              Showing {boostedOnly ? 'boosted' : featuredOnly ? 'featured' : 'regular'} ads only
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-6 items-start">
          <aside className="space-y-4 lg:sticky lg:top-28">
            <div className="bg-white border border-[#E7E9ED] rounded-sm shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="px-4 py-3 border-b border-[#EEF0F3] flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#2B3036]">Title Search</h3>
                <span className="text-[#A0A5AF] text-xs">⌃</span>
              </div>
              <div className="p-4 flex gap-2">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search"
                  className="h-10 flex-1 bg-[#F7F8FA] border border-[#E7E9ED] px-3 text-sm outline-none focus:border-[#0B1F5E]"
                />
                <button className="h-10 w-11 bg-[#0B1F5E] text-white font-bold">⌕</button>
              </div>
            </div>

            <div className="bg-white border border-[#E7E9ED] rounded-sm shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="px-4 py-3 border-b border-[#EEF0F3] flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#2B3036]">Search by Categories</h3>
                <span className="text-[#A0A5AF] text-xs">⌃</span>
              </div>
              <div className="p-3 space-y-2">
                {CATEGORY_OPTIONS.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => updateCategory(cat)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm border transition ${categoryFilter === cat ? 'bg-[#EAF0FF] border-[#0B1F5E] text-[#0B1F5E]' : 'bg-white border-[#EEF0F3] text-[#505863] hover:border-[#D9DDE3]'}`}
                  >
                    <span className="font-semibold">{cat}</span>
                    <span className="text-xs text-[#A1A7B1]">{cat === 'All' ? listings.length : listings.filter((item) => (cat === 'Properties' ? isProperty(item) : isVehicle(item))).length}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white border border-[#E7E9ED] rounded-sm shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="px-4 py-3 border-b border-[#EEF0F3] flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#2B3036]">Location</h3>
                <span className="text-[#A0A5AF] text-xs">⌃</span>
              </div>
              <div className="p-4">
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full h-10 bg-[#F7F8FA] border border-[#E7E9ED] px-3 text-sm outline-none focus:border-[#0B1F5E]"
                >
                  <option value="All">All Locations</option>
                  {SRI_LANKA_DISTRICTS.map((district) => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-white border border-[#E7E9ED] rounded-sm shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="px-4 py-3 border-b border-[#EEF0F3] flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#2B3036]">Price</h3>
                <span className="text-[#A0A5AF] text-xs">⌃</span>
              </div>
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="0"
                    className="h-10 bg-[#F7F8FA] border border-[#E7E9ED] px-3 text-sm outline-none focus:border-[#0B1F5E]"
                  />
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="1000000"
                    className="h-10 bg-[#F7F8FA] border border-[#E7E9ED] px-3 text-sm outline-none focus:border-[#0B1F5E]"
                  />
                </div>
                <button onClick={clearFilters} className="w-full h-11 bg-[#0B1F5E] text-white text-sm font-bold hover:bg-[#081742] transition">
                  Search Now
                </button>
              </div>
            </div>

            <div className="bg-white border border-[#E7E9ED] rounded-sm shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="px-4 py-3 border-b border-[#EEF0F3] flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#2B3036]">Offer Type</h3>
                <span className="text-[#A0A5AF] text-xs">⌃</span>
              </div>
              <div className="p-3 grid grid-cols-2 gap-2">
                {OFFER_OPTIONS.map((offer) => (
                  <button
                    key={offer}
                    onClick={() => setOfferFilter(offer)}
                    className={`h-10 text-xs font-semibold border transition ${offerFilter === offer ? 'bg-[#111827] text-white border-[#111827]' : 'bg-white border-[#EEF0F3] text-[#505863] hover:border-[#D9DDE3]'}`}
                  >
                    {offer}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white border border-[#E7E9ED] rounded-sm shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="px-4 py-3 border-b border-[#EEF0F3] flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#2B3036]">Ad Status</h3>
                <span className="text-[#A0A5AF] text-xs">⌃</span>
              </div>
              <div className="p-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAdStatus('all')}
                  className={`h-10 text-xs font-semibold border transition ${!boostedOnly && !featuredOnly && !regularOnly ? 'bg-[#111827] text-white border-[#111827]' : 'bg-white border-[#EEF0F3] text-[#505863] hover:border-[#D9DDE3]'}`}
                >
                  All Ads
                </button>
                <button
                  type="button"
                  onClick={() => setAdStatus('featured')}
                  className={`h-10 text-xs font-semibold border transition ${featuredOnly ? 'bg-[#EAF0FF] text-[#0B1F5E] border-[#0B1F5E]' : 'bg-white border-[#EEF0F3] text-[#505863] hover:border-[#D9DDE3]'}`}
                >
                  Featured
                </button>
                <button
                  type="button"
                  onClick={() => setAdStatus('boosted')}
                  className={`h-10 text-xs font-semibold border transition ${boostedOnly ? 'bg-[#EAF0FF] text-[#0B1F5E] border-[#0B1F5E]' : 'bg-white border-[#EEF0F3] text-[#505863] hover:border-[#D9DDE3]'}`}
                >
                  Boosted
                </button>
                <button
                  type="button"
                  onClick={() => setAdStatus('regular')}
                  className={`h-10 text-xs font-semibold border transition ${regularOnly ? 'bg-[#EAF0FF] text-[#0B1F5E] border-[#0B1F5E]' : 'bg-white border-[#EEF0F3] text-[#505863] hover:border-[#D9DDE3]'}`}
                >
                  Regular
                </button>
              </div>
            </div>
          </aside>

          <main>
            <div className="bg-white border border-[#E7E9ED] px-4 sm:px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
              <div>
                <p className="text-[13px] font-semibold text-[#444B55]">{filteredListings.length} Ad(s) Found</p>
                <button onClick={clearFilters} className="text-[12px] text-[#8A9099] hover:text-[#0B1F5E] transition mt-1">Reset Search</button>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-10 bg-[#F7F8FA] border border-[#E7E9ED] px-3 text-sm outline-none focus:border-[#0B1F5E] min-w-48"
                >
                  <option value="newest">Newest To Oldest</option>
                  <option value="price-asc">Price: Low To High</option>
                  <option value="price-desc">Price: High To Low</option>
                </select>
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`hidden sm:flex border h-10 w-10 items-center justify-center transition ${viewMode === 'grid' ? 'border-[#0B1F5E] text-[#0B1F5E] bg-[#EAF0FF]' : 'border-[#E7E9ED] bg-white text-[#A0A5AF] hover:text-[#0B1F5E]'}`}
                  aria-label="Grid view"
                  title="Grid view"
                >
                  ▦
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`hidden sm:flex border h-10 w-10 items-center justify-center transition ${viewMode === 'list' ? 'border-[#0B1F5E] text-[#0B1F5E] bg-[#EAF0FF]' : 'border-[#E7E9ED] bg-white text-[#A0A5AF] hover:text-[#0B1F5E]'}`}
                  aria-label="List view"
                  title="List view"
                >
                  ☰
                </button>
              </div>
            </div>

            <div className="bg-white border border-[#E7E9ED] px-4 sm:px-5 py-3 mb-4 text-sm text-[#6D7480] flex flex-wrap gap-2">
              <span className="font-semibold text-[#2B3036]">Category:</span>
              <span className="px-2 py-1 bg-[#F7F8FA] border border-[#E7E9ED]">{categoryFilter}</span>
              <span className="px-2 py-1 bg-[#F7F8FA] border border-[#E7E9ED]">{locationFilter === 'All' ? 'Any Location' : locationFilter}</span>
              {boostedOnly && <span className="px-2 py-1 bg-[#EAF0FF] border border-[#0B1F5E] text-[#0B1F5E]">Boosted Only</span>}
              {featuredOnly && <span className="px-2 py-1 bg-[#EAF0FF] border border-[#0B1F5E] text-[#0B1F5E]">Featured Only</span>}
              {regularOnly && <span className="px-2 py-1 bg-[#EAF0FF] border border-[#0B1F5E] text-[#0B1F5E]">Regular Only</span>}
              {searchQuery && <span className="px-2 py-1 bg-[#F7F8FA] border border-[#E7E9ED]">Search: {searchQuery}</span>}
            </div>

            <section className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#262B31]">Featured Ads</h2>
                <div className="hidden sm:flex items-center gap-2">
                  <button className="w-9 h-9 border border-[#E7E9ED] bg-white text-[#A0A5AF] hover:text-[#0B1F5E] transition">‹</button>
                  <button className="w-9 h-9 border border-[#E7E9ED] bg-white text-[#A0A5AF] hover:text-[#0B1F5E] transition">›</button>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="h-[420px] bg-white border border-[#E7E9ED] animate-pulse" />
                  ))}
                </div>
              ) : filteredListings.length === 0 ? (
                <div className="bg-white border border-[#E7E9ED] p-10 text-center text-[#6D7480]">
                  No listings match your filters.
                </div>
              ) : (
                viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {paginatedListings.map((item, index) => {
                      const imageIndex = ((currentPage - 1) * PAGE_SIZE) + index;
                      const categoryName = getCategoryName(item);
                      const detailsLink = isVehicle(item) ? `/vehicle/${item._id}` : `/property/${item._id}`;
                      const image = resolveImageUrl(item.image) || FALLBACK_IMAGES[imageIndex % FALLBACK_IMAGES.length];

                      return (
                        <Link
                          key={item._id}
                          to={detailsLink}
                          className="group bg-white border border-[#E7E9ED] overflow-hidden hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] transition"
                        >
                          <div className="relative h-56 bg-[#EEF1F4] overflow-hidden">
                            <img
                              src={image}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => {
                                e.currentTarget.src = FALLBACK_IMAGES[imageIndex % FALLBACK_IMAGES.length];
                              }}
                            />
                            <span className="absolute top-3 left-3 bg-[#0B1F5E] text-white text-[11px] font-bold px-2.5 py-1 uppercase tracking-wide">
                              {isVehicle(item) ? 'Vehicle' : 'Property'}
                            </span>
                          </div>

                          <div className="p-4">
                            <p className="text-[13px] text-[#6F7885] uppercase tracking-wide font-semibold mb-1">{categoryName || 'Listing'}</p>
                            <h3 className="font-bold text-[16px] text-[#23272D] leading-6 line-clamp-2 min-h-[48px] group-hover:text-[#0B1F5E] transition">
                              {item.title}
                            </h3>
                            <p className="text-[15px] text-[#6F7885] mt-2">{item.location || 'Sri Lanka'}</p>
                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#EEF0F3]">
                              <div>
                                <p className="text-[10px] uppercase tracking-[0.16em] text-[#A0A5AF] font-semibold">Price</p>
                                <p className="text-[#0B1F5E] font-extrabold text-xl">LKR {Number(item.price || 0).toLocaleString()}</p>
                              </div>
                              <span className="w-9 h-9 flex items-center justify-center border border-[#E7E9ED] text-[#A0A5AF] group-hover:border-[#0B1F5E] group-hover:text-[#0B1F5E] transition">→</span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {paginatedListings.map((item, index) => {
                      const imageIndex = ((currentPage - 1) * PAGE_SIZE) + index;
                      const categoryName = getCategoryName(item);
                      const detailsLink = isVehicle(item) ? `/vehicle/${item._id}` : `/property/${item._id}`;
                      const image = resolveImageUrl(item.image) || FALLBACK_IMAGES[imageIndex % FALLBACK_IMAGES.length];

                      return (
                        <Link
                          key={item._id}
                          to={detailsLink}
                          className="group bg-white border border-[#E7E9ED] overflow-hidden hover:shadow-[0_8px_18px_rgba(0,0,0,0.08)] transition flex flex-col sm:flex-row"
                        >
                          <div className="relative sm:w-64 md:w-72 h-48 sm:h-auto bg-[#EEF1F4] overflow-hidden flex-shrink-0">
                            <img
                              src={image}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => {
                                e.currentTarget.src = FALLBACK_IMAGES[imageIndex % FALLBACK_IMAGES.length];
                              }}
                            />
                            <span className="absolute top-3 left-3 bg-[#0B1F5E] text-white text-[11px] font-bold px-2.5 py-1 uppercase tracking-wide">
                              {isVehicle(item) ? 'Vehicle' : 'Property'}
                            </span>
                          </div>

                          <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                            <div>
                              <p className="text-[13px] text-[#6F7885] uppercase tracking-wide font-semibold mb-1">{categoryName || 'Listing'}</p>
                              <h3 className="font-bold text-[17px] text-[#23272D] leading-6 line-clamp-2 group-hover:text-[#0B1F5E] transition">
                                {item.title}
                              </h3>
                              <p className="text-[15px] text-[#6F7885] mt-2">{item.location || 'Sri Lanka'}</p>
                              <p className="text-sm text-[#6D7480] mt-2 line-clamp-2">{item.description || 'View full listing details for more information.'}</p>
                            </div>

                            <div className="mt-4 pt-3 border-t border-[#EEF0F3] flex items-center justify-between">
                              <div>
                                <p className="text-[10px] uppercase tracking-[0.16em] text-[#A0A5AF] font-semibold">Price</p>
                                <p className="text-[#0B1F5E] font-extrabold text-xl">LKR {Number(item.price || 0).toLocaleString()}</p>
                              </div>
                              <span className="h-10 px-4 inline-flex items-center justify-center border border-[#E7E9ED] text-[#505863] text-sm font-semibold group-hover:border-[#0B1F5E] group-hover:text-[#0B1F5E] transition">
                                View Details
                              </span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )
              )}
            </section>

            <div className="mt-6 bg-white border border-[#E7E9ED] px-4 sm:px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-sm text-[#6D7480]">
                {filteredListings.length === 0 ? (
                  <>Showing <span className="font-bold text-[#262B31]">0</span> ads</>
                ) : filteredListings.length <= PAGE_SIZE ? (
                  <>Showing all <span className="font-bold text-[#262B31]">{filteredListings.length}</span> ads</>
                ) : (
                  <>Showing <span className="font-bold text-[#262B31]">{showingStart}</span> to <span className="font-bold text-[#262B31]">{showingEnd}</span> of <span className="font-bold text-[#262B31]">{filteredListings.length}</span> ads</>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={`w-10 h-10 border transition ${currentPage === 1 ? 'border-[#E7E9ED] bg-[#F7F8FA] text-[#C2C8D1] cursor-not-allowed' : 'border-[#E7E9ED] bg-white text-[#A0A5AF] hover:text-[#0B1F5E]'}`}
                >
                  «
                </button>

                {paginationPages.map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 border transition ${currentPage === page ? 'bg-[#111827] text-white border-[#111827] font-bold' : 'border-[#E7E9ED] bg-white text-[#A0A5AF] hover:text-[#0B1F5E]'}`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages || filteredListings.length === 0}
                  className={`w-10 h-10 border transition ${currentPage === totalPages || filteredListings.length === 0 ? 'border-[#E7E9ED] bg-[#F7F8FA] text-[#C2C8D1] cursor-not-allowed' : 'border-[#E7E9ED] bg-white text-[#A0A5AF] hover:text-[#0B1F5E]'}`}
                >
                  »
                </button>
              </div>
            </div>
          </main>
        </div>
      </section>

      <Footer />
    </div>
  );
}