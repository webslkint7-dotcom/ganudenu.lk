import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Category from './src/models/Category.js';
import Listing from './src/models/Listing.js';
import User from './src/models/User.js';

dotenv.config();

const categories = [
  { name: 'Vehicles', description: 'Luxury, Vintage, & Daily Drivers', icon: '🚗' },
  { name: 'Properties', description: 'Estates, Villas & Lofts', icon: '🏠' },
];

const listings = [
  {
    title: '2024 Midnight Edition SUV',
    description: 'Mint Condition, 2 hours ago',
    price: 142000,
    image: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=800&q=80',
    category: 'Vehicles',
    subcategory: 'SUV',
    location: 'Monaco, Côte d’Azur',
    badges: ['VERIFIED'],
    features: ['Mint Condition', '2 hours ago'],
    isFeatured: true,
  },
  {
    title: 'The Skyline Penthouse',
    description: '3 Bed, 2 Bath',
    price: 2450000,
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80',
    category: 'Properties',
    subcategory: 'Apartment',
    location: 'Dubai, UAE',
    badges: ['LUXURY APARTMENT'],
    features: ['3 Bed', '2 Bath'],
    isFeatured: true,
  },
  {
    title: '1967 Chrome Series Coupe',
    description: 'Mint Condition, 62k Miles',
    price: 89000,
    image: 'https://images.unsplash.com/photo-1511918984145-48de785d4c4e?auto=format&fit=crop&w=800&q=80',
    category: 'Vehicles',
    subcategory: 'Car',
    location: 'London, UK',
    badges: ['VINTAGE COLLECTION'],
    features: ['Mint Condition', '62k Miles'],
    isFeatured: false,
  },
  {
    title: 'Nordic Mirror Cabin',
    description: 'Nature View, 120 sqm',
    price: 560000,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    category: 'Properties',
    subcategory: 'House',
    location: 'Storfjord, Norway',
    badges: ['EXCLUSIVE RETREAT'],
    features: ['Nature View', '120 sqm'],
    isFeatured: false,
  },
];

const adminUser = {
  fullname: 'Platform Admin',
  email: 'admin@editorial.com',
  password: 'admin123',
  role: 'ADMIN',
};

async function seed() {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  await Category.deleteMany();
  await Listing.deleteMany();
  await Category.insertMany(categories);
  await Listing.insertMany(listings);
  const hashedPassword = await bcrypt.hash(adminUser.password, 10);
  await User.findOneAndUpdate(
    { email: adminUser.email },
    { ...adminUser, password: hashedPassword },
    { upsert: true, new: true }
  );
  console.log('Dummy data inserted!');
  mongoose.disconnect();
}

seed();
