import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { fullname, email, phone, password, role } = req.body;

  if (!fullname || !email || !password) {
    return res.status(400).json({ message: 'Fullname, email, and password are required.' });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      const field = existingUser.email === email ? 'email' : 'phone';
      return res.status(400).json({ message: `A user with this ${field} already exists.` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      fullname,
      email,
      phone,
      password: hashedPassword,
      role: role === 'ADMIN' ? 'ADMIN' : 'USER'
    });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({
      token,
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        role: user.role,
      }
    });
  } catch (err) {
    console.error('SERVER: Registration Error:', err);
    res.status(500).json({ message: 'Internal Server Error during registration. Please try again later.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ message: 'Email/Phone and password are required.' });
  }

  try {
    const user = await User.findOne({ $or: [{ email: identifier }, { phone: identifier }] });
    if (!user) return res.status(400).json({ message: 'Invalid credentials. User not found.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials. Password mismatch.' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({
      token,
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        role: user.role,
      }
    });
  } catch (err) {
    console.error('SERVER: Login Error:', err);
    res.status(500).json({ message: 'Internal Server Error during login. Please try again later.' });
  }
});



router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

router.put('/me', auth, async (req, res) => {
  const { fullname, email, phone, bio, location } = req.body;

  try {
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== req.user._id.toString()) {
        return res.status(400).json({ message: 'A user with this email already exists.' });
      }
    }

    if (phone && phone !== req.user.phone) {
      const existingPhoneUser = await User.findOne({ phone });
      if (existingPhoneUser && existingPhoneUser._id.toString() !== req.user._id.toString()) {
        return res.status(400).json({ message: 'A user with this phone already exists.' });
      }
    }

    req.user.fullname = fullname ?? req.user.fullname;
    req.user.email = email ?? req.user.email;
    req.user.phone = phone ?? req.user.phone;
    req.user.bio = bio ?? req.user.bio;
    req.user.location = location ?? req.user.location;

    await req.user.save();

    res.json({
      _id: req.user._id,
      fullname: req.user.fullname,
      email: req.user.email,
      phone: req.user.phone,
      role: req.user.role,
      bio: req.user.bio,
      location: req.user.location,
      createdAt: req.user.createdAt,
    });
  } catch (err) {
    console.error('SERVER: Profile Update Error:', err);
    res.status(500).json({ message: 'Internal Server Error during profile update. Please try again later.' });
  }
});

router.put('/change-password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current password and new password are required.' });
  }

  if (String(newPassword).length < 8) {
    return res.status(400).json({ message: 'New password must be at least 8 characters long.' });
  }

  try {
    const userWithPassword = await User.findById(req.user._id);
    if (!userWithPassword) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const matches = await bcrypt.compare(currentPassword, userWithPassword.password);
    if (!matches) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    const sameAsCurrent = await bcrypt.compare(newPassword, userWithPassword.password);
    if (sameAsCurrent) {
      return res.status(400).json({ message: 'New password must be different from the current password.' });
    }

    userWithPassword.password = await bcrypt.hash(newPassword, 10);
    await userWithPassword.save();

    return res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    console.error('SERVER: Change Password Error:', err);
    return res.status(500).json({ message: 'Internal Server Error during password update. Please try again later.' });
  }
});

export default router;
