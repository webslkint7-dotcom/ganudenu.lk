import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String },
  images: [{ type: String }],
  category: { type: String, required: true },
  subcategory: { type: String },
  type: { type: String, enum: ['PROPERTY', 'VEHICLE', 'OTHER'], default: 'OTHER' },
  location: { type: String },
  badges: [{ type: String }],
  features: [{ type: String }],
  isFeatured: { type: Boolean, default: false },
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  offerType: { type: String, enum: ['Sale', 'Rent', 'Wanted', 'Other'], default: 'Sale' },
  rentPeriod: { type: String, enum: ['Monthly', 'Weekly', 'Daily', 'Yearly'], default: 'Monthly' },
  securityDeposit: { type: Number },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Property Specifics
  propertyDetails: {
    beds: { type: Number },
    baths: { type: Number },
    sqft: { type: Number },
    amenities: [{ type: String }],
    floorplans: [{ type: String }],
    yearBuilt: { type: Number },
  },

  // Vehicle Specifics
  vehicleDetails: {
    make: { type: String },
    model: { type: String },
    year: { type: Number },
    mileage: { type: Number },
    fuelType: { type: String },
    transmission: { type: String },
    historyLog: [{ 
      date: { type: Date },
      event: { type: String },
      description: { type: String }
    }],
  },
  
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Listing', listingSchema);
