import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API from '../api';
import { SRI_LANKA_DISTRICTS } from '../utils/locations';

export default function PostAd() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Custom states for "Other/Manual" inputs
  const [manualBeds, setManualBeds] = useState(false);
  const [manualBaths, setManualBaths] = useState(false);

  // Boost States
  const [selectedBoost, setSelectedBoost] = useState('Standard');
  const [addons, setAddons] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    userType: 'Owner',
    offerType: 'Sale',
    propertyType: 'House',
    location: '',
    street: '',
    title: '',
    description: '',
    price: '',
    currency: 'LKR',
    rentPeriod: 'Monthly',
    securityDeposit: '',
    category: 'Properties',
    type: 'PROPERTY',
    image: '', 
    images: [], 
    propertyDetails: {
      beds: '2',
      baths: '1',
      floors: '1',
      sqft: '',
      yearBuilt: '',
      amenities: [],
      additionalFeatures: '',
      documents: [] 
    },
    vehicleDetails: {
      make: '',
      model: '',
      year: '',
      mileage: '',
      fuelType: 'Petrol',
      transmission: 'Manual',
      features: []
    }
  });

  const categories = ['Properties', 'Vehicles'];
  const userTypes = ['Owner', 'Agent', 'Developer', 'Business'];
  const offerTypes = ['Sale', 'Rent', 'Wanted', 'Businesses For Sale', 'Professionals'];
  
  const propertyTypes = [
    { name: 'Villas & Estates', icon: '🏛️' },
    { name: 'Luxury Penthouses', icon: '🏢' },
    { name: 'Modern Lofts', icon: '🏠' },
    { name: 'Nordic Cabins', icon: '🏡' },
    { name: 'Apartments', icon: '🏬' },
    { name: 'Lands', icon: '🏞️' }
  ];

  const vehicleTypes = [
    { name: 'Luxury Cars', icon: '🏎️' },
    { name: 'Vintage Collections', icon: '🕰️' },
    { name: 'Daily Drivers', icon: '🚗' },
    { name: 'Motorcycles', icon: '🏍️' },
    { name: 'SUVs', icon: '🚘' },
    { name: 'Vans', icon: '🚐' }
  ];

  const propertyAmenities = [
    { id: 'ac', label: 'AC Rooms', icon: '❄️' },
    { id: 'pool', label: 'Swimming Pool', icon: '🏊' },
    { id: 'garden', label: 'Lawn Garden', icon: '🌳' },
    { id: 'security', label: '24 Hour Security', icon: '🛡️' },
    { id: 'water', label: 'Main line water', icon: '🚰' },
    { id: 'hotwater', label: 'Hot Water', icon: '🔥' },
    { id: 'beach', label: 'Beachfront view', icon: '🏖️' },
    { id: 'garage', label: 'Garage', icon: '🚗' },
    { id: 'other', label: 'Other', icon: '✨' }
  ];

  const vehicleAmenities = [
    { id: 'carplay', label: 'Apple CarPlay', icon: '📱' },
    { id: 'sunroof', label: 'Sunroof', icon: '☀️' },
    { id: 'leather', label: 'Leather Seats', icon: '🛋️' },
    { id: 'camera', label: 'Reverse Camera', icon: '📹' },
    { id: 'sensors', label: 'Parking Sensors', icon: '📡' },
    { id: 'alloy', label: 'Alloy Wheels', icon: '🎡' },
    { id: 'autopilot', label: 'Adaptive Cruise', icon: '🚀' },
    { id: 'other', label: 'Other Features', icon: '✨' }
  ];

  // Boost Packages Detail
  const boostPackages = [
    { id: 'Standard', name: 'Standard Listing', price: 0, icon: '📄', features: ['Basic Search Placement', '7 Image Limit', 'Standard Support'] },
    { id: 'Premium', name: 'Premium Boost', price: 1750, icon: '🚀', features: ['Top of Category Search', '25 Image Limit', 'Premium Highlight', 'Direct WhatsApp Link'] },
    { id: 'Elite', name: 'Elite Verified', price: 4500, icon: '🏆', features: ['Home Page Featured', 'Unlimited Media', 'Verified Badge', 'Social Media Promo', 'Professional Video Help'] }
  ];

  const optionalAddons = [
    { id: 'urgent', name: 'Urgent Sale Badge', price: 850, icon: '🔥' },
    { id: 'social', name: 'Social Media Blast', price: 1250, icon: '🌐' },
    { id: 'photo', name: 'Pro Photography Call', price: 2500, icon: '📸' }
  ];

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [navigate]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value }
    }));
  };

  const toggleFeature = (id, parent) => {
    const field = parent === 'propertyDetails' ? 'amenities' : 'features';
    const current = [...formData[parent][field]];
    const index = current.indexOf(id);
    if (index > -1) current.splice(index, 1);
    else current.push(id);
    handleNestedChange(parent, field, current);
  };

  const toggleAddon = (id) => {
    setAddons(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  const calculateTotal = () => {
    const packagePrice = boostPackages.find(p => p.id === selectedBoost)?.price || 0;
    const addonsPrice = addons.reduce((acc, curr) => acc + (optionalAddons.find(a => a.id === curr)?.price || 0), 0);
    return packagePrice + addonsPrice;
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setFormData(prev => {
          const newImages = [...prev.images, reader.result];
          return { ...prev, images: newImages, image: newImages[0] };
        });
      };
    });
  };

  const removeImage = (index) => {
    setFormData(prev => {
      const newImages = prev.images.filter((_, i) => i !== index);
      return { ...prev, images: newImages, image: newImages.length > 0 ? newImages[0] : '' };
    });
  };

  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          propertyDetails: {
            ...prev.propertyDetails,
            documents: [...prev.propertyDetails.documents, { name: file.name, data: reader.result }]
          }
        }));
      };
    });
  };

  const removeDocument = (index) => {
    setFormData(prev => ({
      ...prev,
      propertyDetails: {
        ...prev.propertyDetails,
        documents: prev.propertyDetails.documents.filter((_, i) => i !== index)
      }
    }));
  };

  const validateStep = (s) => {
    setError('');
    if (s === 1) {
      if (!formData.location || !formData.street || !formData.category || !formData.propertyType) {
        setError('Please select a category, location, and street address.');
        return false;
      }
    } else if (s === 2) {
      if (!formData.price || !formData.title || !formData.description) {
        setError('Please provide a price, title, and detailed description.');
        return false;
      }
      if (formData.type === 'PROPERTY') {
        const { beds, baths, sqft } = formData.propertyDetails;
        if (!beds || !baths || !sqft) {
          setError('Please provide room counts and total area for the property.');
          return false;
        }
      } else {
        const { make, model, year, mileage } = formData.vehicleDetails;
        if (!make || !model || !year || !mileage) {
          setError('Please provide all vehicle specifications (Make, Model, Year, Mileage).');
          return false;
        }
      }
    } else if (s === 3) {
      if (formData.images.length === 0) {
        setError('At least one photo is required to post an advertisement.');
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  /**
   * Optimizes images to ensure they stay under the 16MB (17M limit) 
   * by maintaining a max resolution of 1600px and 0.8 quality.
   */
  const optimizeImage = (base64) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1600;
        const MAX_HEIGHT = 1600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
    });
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) return;
    
    setLoading(true);
    setPaymentProcessing(true);
    setError('');
    
    try {
      // Optimize all images before sending to prevent 16MB/17M Buffer Offset Error
      const optimizedImages = await Promise.all(formData.images.map(img => optimizeImage(img)));

      const payload = {
        ...formData,
        subcategory: formData.propertyType,
        images: optimizedImages,
        image: optimizedImages[0] || '',
        price: Number(formData.price),
        isFeatured: selectedBoost !== 'Standard', // Paid boosts mark as featured immediately
        boostPackage: selectedBoost,
        boostAddons: addons,
        propertyDetails: formData.type === 'PROPERTY' ? {
          ...formData.propertyDetails,
          beds: Number(formData.propertyDetails.beds),
          baths: Number(formData.propertyDetails.baths),
          sqft: Number(formData.propertyDetails.sqft),
          floorplans: formData.propertyDetails.documents.map(d => JSON.stringify(d))
        } : undefined,
        vehicleDetails: formData.type === 'VEHICLE' ? {
          ...formData.vehicleDetails,
          year: Number(formData.vehicleDetails.year),
          mileage: Number(formData.vehicleDetails.mileage)
        } : undefined
      };

      await API.post('/listings', payload);
      setSuccess('Ad posted successfully! All premium features activated.');
      setPaymentProcessing(false);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Error publishing ad. The total file size might be too large.');
      setPaymentProcessing(false);
    } finally {
      setLoading(false);
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-12 gap-4">
      {[1, 2, 3, 4].map((s) => (
        <React.Fragment key={s}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all shadow-md
            ${step >= s ? 'bg-[#0B1F5E] text-white' : 'bg-white text-slate-300 border border-slate-200'}`}>
            {s}
          </div>
          {s < 4 && <div className={`h-1 w-12 rounded-full ${step > s ? 'bg-[#0B1F5E]' : 'bg-slate-100'}`}></div>}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="bg-[#F8FAFF] min-h-screen font-sans pb-20 text-[#1F2328]">
      <Navbar isAuthenticated={true} />

      <section className="bg-white border-b border-[#ECEEF1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 text-sm text-[#8A9099]">
          <div className="flex items-center gap-2">
            <Link to="/" className="hover:text-[#0B1F5E] transition">Home</Link>
            <span>/</span>
            <span className="text-[#434A54]">Post Ad</span>
          </div>
        </div>
      </section>
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
        <section className="mb-6 bg-[#FFFFFF] border border-[#D9DEE8] rounded-sm p-6 sm:p-8 text-center">
          <h1 className="text-[30px] sm:text-[38px] font-extrabold text-[#262B31]">Submit Your Ad</h1>
          <p className="text-[#6D7480] mt-2 capitalize">{formData.category.toLowerCase()} listing flow with premium promotion packages.</p>
        </section>

        <StepIndicator />

        {paymentProcessing ? (
           <div className="max-w-xl mx-auto bg-white rounded-sm p-16 text-center shadow-2xl border border-[#E7E9ED] animate-in fade-in zoom-in-95 duration-700">
             <div className="relative w-24 h-24 mx-auto mb-8">
               <div className="absolute inset-0 border-8 border-slate-100 rounded-full"></div>
               <div className="absolute inset-0 border-8 border-[#0B1F5E] rounded-full border-t-transparent animate-spin"></div>
               <div className="absolute inset-0 flex items-center justify-center text-3xl">🛡️</div>
             </div>
             <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">Verifying Transaction</h2>
             <p className="text-slate-500 font-medium">Please wait while we secure your payment and finalize your premium listing placement...</p>
           </div>
        ) : (
          <div className="space-y-8">
            
            {/* STEP 1: Category & Identification */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white rounded-sm p-8 sm:p-10 shadow-sm border border-[#E7E9ED] space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <section className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-4">1. Principal Category</label>
                        <div className="flex gap-3">
                           {categories.map(cat => (
                            <button key={cat} onClick={() => { handleInputChange('category', cat); handleInputChange('type', cat === 'Properties' ? 'PROPERTY' : 'VEHICLE'); handleInputChange('propertyType', cat === 'Properties' ? 'House' : 'Car'); }} className={`flex-1 px-8 py-5 rounded-xl text-xs font-black uppercase tracking-widest border-2 transition-all ${formData.category === cat ? 'bg-[#0B1F5E] text-white border-[#0B1F5E] shadow-xl scale-105' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'}`}>{cat}</button>
                           ))}
                        </div>
                     </section>
                     <section className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-4">2. Listing Identity</label>
                      <div className="flex flex-wrap gap-3">
                        {userTypes.map(type => (
                          <button key={type} onClick={() => handleInputChange('userType', type)} className={`px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest border-2 transition-all ${formData.userType === type ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'}`}>{type}</button>
                        ))}
                      </div>
                    </section>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <section className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-4">3. Transaction Mode</label>
                      <div className="flex flex-wrap gap-2">
                         {offerTypes.slice(0, 3).map(type => (
                            <button key={type} onClick={() => handleInputChange('offerType', type)} className={`flex-1 px-4 py-4 rounded-xl text-xs font-black uppercase tracking-widest border-2 transition-all ${formData.offerType === type ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'}`}>{type}</button>
                         ))}
                      </div>
                     </section>
                     <section className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-4">4. Geographical Data</label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                          <select 
                            value={formData.location} 
                            onChange={(e) => handleInputChange('location', e.target.value)} 
                            className="w-full bg-white border-2 border-slate-300 rounded-xl px-4 py-4 font-black text-xs outline-none focus:border-[#0B1F5E] focus:ring-4 focus:ring-[#0B1F5E]/10 appearance-none cursor-pointer"
                          >
                            <option value="">Select District</option>
                            {SRI_LANKA_DISTRICTS.map(district => (
                              <option key={district} value={district}>{district}</option>
                            ))}
                          </select>
                        </div>
                        <input value={formData.street} onChange={(e) => handleInputChange('street', e.target.value)} className="w-full bg-white border-2 border-slate-300 rounded-xl px-4 py-4 font-black text-xs outline-none focus:border-[#0B1F5E] focus:ring-4 focus:ring-[#0B1F5E]/10" placeholder="Street / Town" />
                      </div>
                     </section>
                  </div>

                  <section>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Select Sub Category *</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      {(formData.category === 'Properties' ? propertyTypes : vehicleTypes).map(pt => (
                        <button key={pt.name} onClick={() => handleInputChange('propertyType', pt.name)} className={`p-6 rounded-[1.5rem] border-2 flex flex-col items-center gap-3 transition-all ${formData.propertyType === pt.name ? 'bg-blue-50 border-blue-900 text-blue-900 scale-105 shadow-md' : 'bg-white border-slate-50 text-slate-400 hover:border-slate-200 shadow-sm'}`}>
                          <span className="text-3xl">{pt.icon}</span>
                          <span className="text-xs font-black uppercase tracking-widest text-center leading-tight">{pt.name}</span>
                        </button>
                      ))}
                    </div>
                  </section>

                  <div className="pt-8 border-t border-slate-50 flex flex-col items-end gap-4">
                     {error && step === 1 && <p className="text-red-500 text-xs font-black uppercase tracking-widest">{error}</p>}
                     <button onClick={nextStep} className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition shadow-xl active:scale-95">Continue to Details</button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Details & Content */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                <div className="bg-white rounded-sm p-8 sm:p-10 shadow-sm border border-[#E7E9ED] space-y-10">
                   {formData.type === 'PROPERTY' ? (
                     <div className="space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <section>
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Bedrooms *</label>
                            <div className="flex flex-wrap gap-2">
                               {[1, 2, 3, 4, 5].map(val => (
                                 <button key={val} onClick={() => { handleNestedChange('propertyDetails', 'beds', val); setManualBeds(false); }} className={`h-12 w-12 rounded-xl font-black text-sm border-2 transition-all ${!manualBeds && formData.propertyDetails.beds == val ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}>{val}</button>
                               ))}
                               <button onClick={() => setManualBeds(true)} className={`h-12 px-4 rounded-xl font-black text-[10px] border-2 transition-all ${manualBeds ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}>5+</button>
                            </div>
                            {manualBeds && <input type="number" placeholder="Count" value={formData.propertyDetails.beds} onChange={(e) => handleNestedChange('propertyDetails', 'beds', e.target.value)} className="mt-4 w-32 bg-white border-2 border-slate-300 rounded-xl px-4 py-3 font-black text-sm outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-500/5" />}
                          </section>
                          <section>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Bathrooms</label>
                            <div className="flex flex-wrap gap-2">
                               {[1, 2, 3, 4, 5].map(val => (
                                 <button key={val} onClick={() => { handleNestedChange('propertyDetails', 'baths', val); setManualBaths(false); }} className={`h-12 w-12 rounded-xl font-black text-sm border-2 transition-all ${!manualBaths && formData.propertyDetails.baths == val ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}>{val}</button>
                               ))}
                               <button onClick={() => setManualBaths(true)} className={`h-12 px-4 rounded-xl font-black text-[10px] border-2 transition-all ${manualBaths ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}>5+</button>
                            </div>
                            {manualBaths && <input type="number" placeholder="Count" value={formData.propertyDetails.baths} onChange={(e) => handleNestedChange('propertyDetails', 'baths', e.target.value)} className="mt-4 w-32 bg-white border-2 border-slate-300 rounded-xl px-4 py-3 font-black text-sm outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-500/5" />}
                          </section>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                             <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Area (Sqft) *</label>
                             <input type="number" placeholder="Total Area" value={formData.propertyDetails.sqft} onChange={(e) => handleNestedChange('propertyDetails', 'sqft', e.target.value)} className="w-full bg-white border-2 border-slate-300 rounded-xl px-4 py-4 font-black outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-500/5 transition-all" />
                          </div>
                        </div>
                     </div>
                   ) : (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-2">
                           <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Manufacturer</label>
                           <input placeholder="Ex: Toyota" value={formData.vehicleDetails.make} onChange={(e) => handleNestedChange('vehicleDetails', 'make', e.target.value)} className="w-full bg-white border-2 border-slate-300 rounded-xl px-4 py-4 font-black outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-500/5 transition-all" />
                        </div>
                        <div className="space-y-2">
                           <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Vehicle Model</label>
                           <input placeholder="Ex: Land Cruiser" value={formData.vehicleDetails.model} onChange={(e) => handleNestedChange('vehicleDetails', 'model', e.target.value)} className="w-full bg-white border-2 border-slate-300 rounded-xl px-4 py-4 font-black outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-500/5 transition-all" />
                        </div>
                        <div className="space-y-2">
                           <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Year</label>
                           <input type="number" placeholder="YYYY" value={formData.vehicleDetails.year} onChange={(e) => handleNestedChange('vehicleDetails', 'year', e.target.value)} className="w-full bg-white border-2 border-slate-300 rounded-xl px-4 py-4 font-black outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-500/5 transition-all" />
                        </div>
                        <div className="space-y-2">
                           <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Mileage (km)</label>
                           <input type="number" placeholder="Ex: 45000" value={formData.vehicleDetails.mileage} onChange={(e) => handleNestedChange('vehicleDetails', 'mileage', e.target.value)} className="w-full bg-white border-2 border-slate-300 rounded-xl px-4 py-4 font-black outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-500/5 transition-all" />
                        </div>
                     </div>
                   )}
                </div>

                {/* Pricing & Rent Section */}
                <div className="bg-white rounded-sm p-8 sm:p-10 shadow-sm border border-[#E7E9ED] space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                  <h3 className="text-xl font-black text-slate-900 uppercase">Pricing Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="space-y-4">
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">
                        {formData.offerType === 'Rent' ? 'Rent Amount' : 'Sale Price'} *
                      </label>
                      <div className="relative">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-[#0B1F5E] text-xs">LKR</span>
                        <input type="number" placeholder="Enter Amount" value={formData.price} onChange={(e) => handleInputChange('price', e.target.value)} className="w-full bg-white border-2 border-slate-300 rounded-xl pl-14 pr-4 py-4 font-black text-slate-900 focus:border-[#0B1F5E] outline-none transition-all shadow-sm" />
                      </div>
                    </div>

                    {formData.offerType === 'Rent' && (
                      <>
                        <div className="space-y-4">
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Rent Period</label>
                          <select 
                            value={formData.rentPeriod} 
                            onChange={(e) => handleInputChange('rentPeriod', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-4 font-black text-slate-900 outline-none appearance-none cursor-pointer focus:border-navy transition-all"
                          >
                            {['Monthly', 'Weekly', 'Daily', 'Yearly'].map(p => <option key={p} value={p}>{p}</option>)}
                          </select>
                        </div>

                        <div className="space-y-4">
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Security Deposit (LKR)</label>
                          <input type="number" placeholder="Optional" value={formData.securityDeposit} onChange={(e) => handleInputChange('securityDeposit', e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-4 font-black text-slate-900 focus:border-navy outline-none" />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-slate-100 space-y-6">
                   <h3 className="text-xl font-black text-slate-900 uppercase">Ad Content</h3>
                   <input value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-4 font-black outline-none focus:border-[#0B1F5E]" placeholder="Headline" />
                   <textarea value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} rows={5} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-4 font-medium outline-none focus:border-[#0B1F5E] resize-none" placeholder="Description..." />
                </div>

                 <div className="flex flex-col gap-4 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                  {error && step === 2 && <p className="text-red-500 text-xs font-black uppercase tracking-widest text-center">{error}</p>}
                  <div className="flex justify-between items-center w-full">
                    <button onClick={() => setStep(1)} className="text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-slate-900 transition">Back</button>
                    <button onClick={nextStep} className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-black transition shadow-xl">Continue to Media</button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Media & Documents */}
            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                <div className="bg-white rounded-sm p-8 sm:p-10 shadow-sm border border-[#E7E9ED] space-y-10">
                  <h3 className="text-xl font-black text-slate-900 uppercase">Gallery & Documentation</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                     {formData.images.map((img, idx) => (
                       <div key={idx} className="relative aspect-square rounded-[1.5rem] overflow-hidden border border-slate-100 bg-slate-50 shadow-sm group">
                          <img src={img} className="w-full h-full object-cover" />
                          <button onClick={() => removeImage(idx)} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">Remove</button>
                       </div>
                     ))}
                     <div className="relative aspect-square rounded-[1.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center group hover:border-blue-900 transition-colors cursor-pointer bg-slate-50/50 text-slate-300">
                        <div className="text-3xl mb-2">➕</div>
                        <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                     </div>
                  </div>
                </div>

                 <div className="flex flex-col gap-4 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                  {error && step === 3 && <p className="text-red-500 text-xs font-black uppercase tracking-widest text-center">{error}</p>}
                  <div className="flex justify-between items-center w-full">
                    <button onClick={() => setStep(2)} className="text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-slate-900 transition font-black">Back to Listings</button>
                    <button onClick={nextStep} className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-black transition">Continue to Promotion</button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Boost & Complete (The Monetization Phase) */}
            {step === 4 && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-12">
                <div className="text-center max-w-2xl mx-auto space-y-4">
                  <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Choose Your Package</h2>
                  <p className="text-slate-500 font-medium">Get the most out of your advertisement with our premium promotion options. Select a plan to continue.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {boostPackages.map(pkg => (
                    <div 
                      key={pkg.id} 
                      onClick={() => setSelectedBoost(pkg.id)}
                      className={`relative bg-white rounded-sm p-10 border-2 transition-all duration-500 cursor-pointer flex flex-col group
                      ${selectedBoost === pkg.id ? 'border-[#0B1F5E] shadow-2xl scale-[1.03] z-10' : 'border-slate-100 hover:border-slate-200 shadow-sm opacity-80 hover:opacity-100'}`}
                    >
                      <div className="flex justify-between items-start mb-8">
                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl shadow-sm ${selectedBoost === pkg.id ? 'bg-[#EAF0FF]' : 'bg-slate-50'}`}>
                          {pkg.icon}
                        </div>
                        {pkg.id === 'Elite' && (
                          <span className="bg-[#0B1F5E] text-white text-[8px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-lg">Popular</span>
                        )}
                      </div>

                      <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">{pkg.name}</h3>
                      <div className="mb-8">
                        <span className="text-3xl font-black text-slate-900">LKR {pkg.price.toLocaleString()}</span>
                        <span className="text-slate-400 text-xs font-bold uppercase tracking-widest ml-2">/ one time</span>
                      </div>

                      <div className="flex-1 space-y-4 mb-10">
                        {pkg.features.map(f => (
                          <div key={f} className="flex items-center gap-3">
                            <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${selectedBoost === pkg.id ? 'bg-[#0B1F5E] text-white' : 'bg-slate-100 text-slate-400'}`}>✓</span>
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{f}</span>
                          </div>
                        ))}
                      </div>

                      <div className={`w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all text-center
                        ${selectedBoost === pkg.id ? 'bg-[#EAF0FF] text-[#0B1F5E]' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                        {selectedBoost === pkg.id ? 'Selected' : 'Select Plan'}
                      </div>

                      {selectedBoost === pkg.id && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0B1F5E] text-white text-[8px] font-black whitespace-nowrap px-6 py-2 rounded-full uppercase tracking-[0.3em] shadow-xl">
                          Active Choice
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Final Checkout Bar */}
                <div className="bg-white rounded-sm p-10 shadow-2xl border-2 border-[#E7E9ED] mt-20 flex flex-col lg:flex-row items-center justify-between gap-12 group">
                  <div className="space-y-6 flex-1">
                    <div className="flex items-center gap-3">
                       <span className="w-2 h-2 rounded-full bg-blue-700"></span>
                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Checkout Verification</h4>
                    </div>
                    <div className="flex flex-wrap gap-4">
                       <div className="bg-slate-50 px-8 py-5 rounded-3xl border border-slate-100 flex flex-col">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Boost Plan</span>
                          <span className="text-sm font-black text-slate-900 uppercase">{boostPackages.find(p => p.id === selectedBoost)?.name}</span>
                       </div>
                       {addons.map(aId => {
                          const a = optionalAddons.find(itm => itm.id === aId);
                          return (
                            <div key={aId} className="bg-blue-50 px-8 py-5 rounded-3xl border border-blue-100 flex flex-col">
                               <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest mb-1">Addon</span>
                               <span className="text-sm font-black text-blue-900 uppercase">{a.name}</span>
                            </div>
                          );
                       })}
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-12">
                     <div className="text-center md:text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Total Payable Amount</p>
                        <h2 className="text-6xl font-black text-slate-900 tracking-tighter">LKR {calculateTotal().toLocaleString()}</h2>
                     </div>
                     <button 
                       onClick={handleSubmit} 
                       disabled={loading}
                       className="bg-blue-700 text-white px-16 py-8 rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.4em] hover:bg-blue-600 transition shadow-2xl shadow-blue-700/20 active:scale-95 flex items-center gap-4"
                     >
                        {loading ? 'Processing...' : 'Complete & Publish Ad'}
                        <span className="text-xl">→</span>
                     </button>
                  </div>
                </div>

                <div className="flex justify-center pt-8">
                   <button onClick={() => setStep(3)} className="text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-slate-900 transition flex items-center gap-3">
                      <span className="text-lg">←</span> Back to Information & Media
                   </button>
                </div>
              </div>
            )}

            {error && <div className="bg-red-50 text-red-600 p-6 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest text-center shadow-inner mt-8">{error}</div>}
            {success && <div className="bg-green-50 text-green-700 p-6 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest text-center shadow-inner mt-8">{success}</div>}

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

