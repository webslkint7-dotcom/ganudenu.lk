import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './src/models/Category.js';
import Listing from './src/models/Listing.js';

dotenv.config();

const categories = [
  { name: 'Vehicles', description: 'Luxury, Vintage, & Daily Drivers', icon: '🚗' },
  { name: 'Residential', description: 'Estates, Villas & Lofts', icon: '🏠' },
  { name: 'Luxury Assets', description: 'Watches, Yachts, & Fine Art', icon: '💎' },
  { name: 'Verified Sellers', description: 'High-Trust Trade Circle', icon: '✅' },
];

const listings = [
  {
    title: '2024 Midnight Edition SUV',
    description: 'Mint Condition, 2 hours ago',
    price: 142000,
    image: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=800&q=80',
    category: 'Vehicles',
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
    category: 'Residential',
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
    category: 'Residential',
    location: 'Storfjord, Norway',
    badges: ['EXCLUSIVE RETREAT'],
    features: ['Nature View', '120 sqm'],
    isFeatured: false,
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  await Category.deleteMany();
  await Listing.deleteMany();
  await Category.insertMany(categories);
  await Listing.insertMany(listings);
  console.log('Dummy data inserted!');
  mongoose.disconnect();
}

seed();
