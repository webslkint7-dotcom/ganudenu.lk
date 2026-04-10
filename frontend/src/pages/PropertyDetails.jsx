import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API from '../api';
import { resolveImageUrl } from '../utils/imageUrl';

export default function PropertyDetails() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    API.get(`/listings/${id}`)
      .then(res => {
        setListing(res.data);
        setSelectedImage(res.data.image); // Initialize with hero image
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const fullMessage = `[Ref: ${listing.title}]\n\n${message}`;
      await API.post('/messages', {
        receiver: listing.owner?._id || listing.owner,
        listing: listing._id,
        content: fullMessage
      });
      alert('Message sent successfully!');
      setMessage('');
    } catch (err) {
      alert(err.response?.data?.message || 'Error sending message. Please ensure you are logged in.');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-slate-50 text-slate-900 font-black">ANALYZING ASSET DATA...</div>;
  if (!listing) return <div className="flex items-center justify-center min-h-screen font-black text-red-500 bg-slate-50 uppercase tracking-widest">Listing Not Found</div>;

  const property = listing.propertyDetails || {};
  const allImages = listing.images && listing.images.length > 0 ? listing.images : [listing.image];
  
  // Safely parse technical documents from floorplans field
  const documents = property.floorplans ? property.floorplans.map(docString => {
    try {
      return JSON.parse(docString);
    } catch (e) {
      return { name: 'Technical Document', data: docString };
    }
  }) : [];

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans pb-20">
      <Navbar isAuthenticated={!!localStorage.getItem('token')} />

      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-6 pt-12 animate-fadeIn">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Visuals & Gallery */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl h-[600px] border-8 border-white group">
              <img src={resolveImageUrl(selectedImage)} alt={listing.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute top-8 left-8 flex gap-3">
                <span className="bg-slate-900 text-white px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-xl backdrop-blur-md">Premium Asset</span>
                <span className="bg-blue-700 text-white px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-xl">Verified Curator</span>
              </div>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {allImages.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setSelectedImage(img)}
                  className={`relative flex-shrink-0 w-32 h-24 rounded-2xl overflow-hidden border-4 transition-all
                  ${selectedImage === img ? 'border-blue-700 scale-105 shadow-lg' : 'border-white opacity-60 hover:opacity-100 shadow-sm'}`}>
                  <img src={resolveImageUrl(img)} className="w-full h-full object-cover" alt={`Gallery ${i}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-8 lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
               <div className="text-blue-700 font-black text-xs uppercase tracking-[0.3em] mb-3">{listing.location}</div>
               <h1 className="text-4xl font-black leading-tight mb-6 text-slate-900 uppercase tracking-tighter">{listing.title}</h1>
               <div className="text-3xl font-black text-slate-900 mb-8 flex items-baseline gap-2">
                 <span className="text-blue-700 text-sm">LKR</span>
                 {listing.price?.toLocaleString()}
                 {listing.offerType === 'Rent' && (
                   <span className="text-slate-400 text-sm font-bold ml-1">/ {listing.rentPeriod || 'Month'}</span>
                 )}
               </div>
               
               {listing.offerType === 'Rent' && listing.securityDeposit && (
                 <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
                   <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Security Deposit</span>
                   <span className="text-sm font-black text-slate-900">LKR {listing.securityDeposit.toLocaleString()}</span>
                 </div>
               )}
               
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Bedrooms</div>
                    <div className="text-xl font-black text-slate-900">{property.beds || '—'}</div>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Bathrooms</div>
                    <div className="text-xl font-black text-slate-900">{property.baths || '—'}</div>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Area Sqft</div>
                    <div className="text-xl font-black text-slate-900">{property.sqft?.toLocaleString() || '—'}</div>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Status</div>
                    <div className="text-sm font-black text-blue-700 uppercase">{listing.status}</div>
                  </div>
               </div>
            </div>

            <div className="bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
               <div className="relative z-10">
                <h3 className="font-black text-xl mb-2 uppercase tracking-tight italic">Direct Inquiry</h3>
                <p className="text-slate-400 text-xs mb-8 font-medium">Coordinate with verified curator <span className="text-white border-b border-blue-700">{listing.owner?.fullname || 'the owner'}</span>.</p>
                <form onSubmit={handleSendMessage} className="space-y-6">
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] p-6 text-sm placeholder-white/20 focus:bg-white/10 focus:border-blue-700 outline-none transition-all resize-none shadow-inner" placeholder="Enter your message regarding the trade..." rows="3" required></textarea>
                  <button type="submit" disabled={sending} className="w-full bg-blue-700 text-white font-black py-5 rounded-[1.5rem] hover:bg-blue-600 active:scale-95 transition-all text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-900/50">
                    {sending ? 'COMMUNICATING...' : 'Secure Inquiry →'}
                  </button>
                </form>
                <Link to="/messaging" className="block text-center mt-6 text-xs font-black text-slate-500 uppercase tracking-widest hover:text-white transition">View All Communications</Link>
               </div>
               <div className="absolute top-0 right-0 w-48 h-48 bg-blue-700/10 rounded-full -mr-24 -mt-24 blur-3xl group-hover:bg-blue-700/20 transition-all duration-700"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Breakdown */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-24">
        <div className="space-y-12">
          <div>
            <h2 className="text-3xl font-black mb-8 uppercase tracking-tighter text-slate-900 border-l-8 border-blue-700 pl-6">The Story</h2>
            <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line font-medium">{listing.description}</p>
          </div>
          {property.additionalFeatures && (
            <div className="bg-blue-50 p-10 rounded-[2.5rem] border border-blue-100">
               <h3 className="text-xs font-black text-blue-950 uppercase tracking-[0.3em] mb-6">Additional Specifications</h3>
               <p className="text-blue-900/70 font-bold leading-relaxed whitespace-pre-line">{property.additionalFeatures}</p>
            </div>
          )}
        </div>

        <div className="space-y-16">
          <div>
            <h2 className="text-3xl font-black mb-8 uppercase tracking-tighter text-slate-900 border-l-8 border-blue-700 pl-6">Asset Amenities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
              {(property.amenities?.length ? property.amenities : listing.features?.length ? listing.features : []).map(a => (
                <div key={a} className="flex items-center gap-4 group bg-white p-4 rounded-2xl border border-slate-50 shadow-sm hover:border-blue-700 transition">
                   <span className="w-2.5 h-2.5 bg-blue-700 rounded-full shadow-lg shadow-blue-700/40"></span>
                   <span className="font-black text-slate-900 text-xs uppercase tracking-widest">{a.replace('other', 'Custom Amenity')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* DYNAMIC TECHNICAL DOCUMENTS SECTION */}
          <div>
            <h2 className="text-3xl font-black mb-8 uppercase tracking-tighter text-slate-900 border-l-8 border-blue-700 pl-6">Technical Documents</h2>
            <div className="space-y-4">
               {documents.length > 0 ? (
                 documents.map((doc, idx) => (
                   <a 
                    key={idx} 
                    href={doc.data} 
                    download={doc.name} 
                    className="flex items-center justify-between bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm hover:border-blue-700 hover:shadow-md transition-all group"
                   >
                     <div className="flex items-center gap-4">
                        <span className="text-3xl group-hover:scale-110 transition">📂</span>
                        <div>
                           <div className="text-xs font-black text-slate-900 uppercase truncate max-w-[250px]">{doc.name}</div>
                           <div className="text-[10px] font-black text-blue-700 uppercase tracking-widest mt-1">Verified Document</div>
                        </div>
                     </div>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-700">Download →</span>
                   </a>
                 ))
               ) : (
                 <div className="bg-slate-50 rounded-[1.5rem] p-10 text-center border-2 border-dashed border-slate-200">
                    <div className="text-4xl mb-4 grayscale opacity-20">📐</div>
                    <div className="font-black text-slate-400 uppercase tracking-widest text-[10px]">No Technical Documents Provided</div>
                    <p className="text-[10px] text-slate-400 mt-2">Documents like floorplans are available upon private request.</p>
                 </div>
               )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="bg-slate-900 rounded-[3rem] py-20 px-10 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-black text-white mb-6 uppercase tracking-tighter">Looking for more?</h2>
            <p className="text-slate-400 mb-12 max-w-2xl mx-auto font-medium">Connect with our advisory for exclusive access.</p>
            <button className="bg-white text-slate-900 font-black px-12 py-5 rounded-2xl hover:bg-slate-100 transition-all uppercase tracking-widest text-xs shadow-xl active:scale-95">Consult Advisory</button>
          </div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-700/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
        </div>
      </section>

      <Footer />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
