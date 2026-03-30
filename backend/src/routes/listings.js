import express from 'express';
import Listing from '../models/Listing.js';

const router = express.Router();

// Get all listings
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find();
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get featured listings
router.get('/featured', async (req, res) => {
  try {
    const listings = await Listing.find({ isFeatured: true });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
