import express from 'express';
import jwt from 'jsonwebtoken';
import Listing from '../models/Listing.js';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';
import { saveBase64Image } from '../utils/fileUpload.js';

const router = express.Router();

function inferListingType({ type, category, propertyDetails, vehicleDetails }) {
  const normalizedCategory = String(category || '').toLowerCase();
  const hasPropertyDetails = Boolean(
    propertyDetails &&
      (
        propertyDetails.beds ||
        propertyDetails.baths ||
        propertyDetails.sqft ||
        (Array.isArray(propertyDetails.amenities) && propertyDetails.amenities.length > 0) ||
        propertyDetails.yearBuilt
      )
  );
  const hasVehicleDetails = Boolean(
    vehicleDetails &&
      (
        vehicleDetails.make ||
        vehicleDetails.model ||
        vehicleDetails.year ||
        vehicleDetails.mileage
      )
  );

  if (type === 'PROPERTY') return 'PROPERTY';
  if (type === 'VEHICLE') return 'VEHICLE';

  if (normalizedCategory.includes('propert') || normalizedCategory.includes('residential') || normalizedCategory.includes('land') || hasPropertyDetails) {
    return 'PROPERTY';
  }

  if (normalizedCategory.includes('vehicle') || hasVehicleDetails) {
    return 'VEHICLE';
  }

  return 'OTHER';
}

// Get all listings with filters
router.get('/', async (req, res) => {
  const { category, subcategory, type, minPrice, maxPrice, location, all } = req.query;
  let query = { status: 'APPROVED' };

  if (String(all) === 'true') {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('role');

      if (!user || user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Not authorized' });
      }

      query = {};
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  }

  if (category) query.category = category;
  if (subcategory) query.subcategory = subcategory;
  if (type) query.type = type;
  if (location) query.location = new RegExp(location, 'i');
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  try {
    const listings = await Listing.find(query)
      .sort({ isFeatured: -1, createdAt: -1 })
      .populate('owner', 'fullname phone');
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get featured listings
router.get('/featured', async (req, res) => {
  try {
    const listings = await Listing.find({ isFeatured: true, status: 'APPROVED' }).limit(5);
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get the authenticated user's listings
router.get('/mine', auth, async (req, res) => {
  try {
    const listings = await Listing.find({ owner: req.user.id }).sort({ createdAt: -1 }).populate('owner', 'fullname email phone');
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get listing by ID
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('owner', 'fullname email phone');
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new listing
router.post('/', auth, async (req, res) => {
  try {
    const listingType = inferListingType(req.body);
    // Process images: move from Base64 to Local Files
    let mainImagePath = req.body.image;
    let galleryImages = req.body.images || [];

    if (mainImagePath && mainImagePath.startsWith('data:image')) {
      const savedPath = saveBase64Image(mainImagePath);
      if (savedPath) mainImagePath = savedPath;
    }

    if (galleryImages.length > 0) {
      galleryImages = galleryImages.map(img => {
        if (img && img.startsWith('data:image')) {
          const saved = saveBase64Image(img);
          return saved || img;
        }
        return img;
      });
    }

    const newListing = new Listing({
      ...req.body,
      image: mainImagePath,
      images: galleryImages,
      owner: req.user.id,
      type: listingType,
      status: 'APPROVED'
    });
    const listing = await newListing.save();
    res.status(201).json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update listing (for editing or moderation)
router.put('/:id', auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    // Check ownership or admin status (assuming admin roles later)
    if (listing.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedListing);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
