import express from 'express';
import Category from '../models/Category.js';
import Listing from '../models/Listing.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    // 1. Clear existing (Optional - only for fresh start)
    // await Category.deleteMany({});
    // await Listing.deleteMany({});

    // 2. Seed Categories
    const categoriesList = [
      { name: 'Properties', icon: '🏠', description: 'Curated homes and estates.' },
      { name: 'Vehicles', icon: '🏎️', description: 'Bespoke automotive engineering.' },
      { name: 'Land', icon: '🌳', description: 'Strategic heritage terrain.' },
      { name: 'Art', icon: '🖼️', description: 'Masterpieces for private collection.' }
    ];

    for (const cat of categoriesList) {
      await Category.findOneAndUpdate({ name: cat.name }, cat, { upsert: true });
    }

    // 3. Create Admin/Test Users
    const curatorHash = await bcrypt.hash('password123', 10);
    const adminHash = await bcrypt.hash('admin123', 10);

    const testUser = await User.findOneAndUpdate(
      { email: 'curator@editorial.com' },
      { fullname: 'The Head Curator', email: 'curator@editorial.com', password: curatorHash, role: 'USER' },
      { upsert: true, new: true }
    );

    await User.findOneAndUpdate(
      { email: 'admin@editorial.com' },
      { fullname: 'Platform Admin', email: 'admin@editorial.com', password: adminHash, role: 'ADMIN' },
      { upsert: true, new: true }
    );

    // 4. Seed one Approved Listing
    const testListing = {
      title: 'Modernist Glass Villa',
      description: 'A masterpiece of contemporary architecture with panoramic vistas and sustainable smart integration.',
      price: 12500000,
      category: 'Properties',
      type: 'PROPERTY',
      location: 'Geneva, Switzerland',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=2071',
      status: 'APPROVED',
      owner: testUser._id,
      isFeatured: true,
      propertyDetails: {
        beds: 5,
        baths: 6,
        sqft: 8500,
        amenities: ['Private Pier', 'Wine Cellar', 'Solar Grid'],
        yearBuilt: 2022
      }
    };

    await Listing.findOneAndUpdate({ title: testListing.title }, testListing, { upsert: true });

    res.json({ message: 'Marketplace Seeded Successfully', adminUser: 'admin@editorial.com / admin123', testUser: 'curator@editorial.com / password123' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
