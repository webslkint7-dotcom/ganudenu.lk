import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  phone: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
  bio: { type: String, default: '' },
  location: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
