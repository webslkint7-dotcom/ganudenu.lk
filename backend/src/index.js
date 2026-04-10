import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import authRoutes from './routes/auth.js';
import listingsRoutes from './routes/listings.js';
import categoriesRoutes from './routes/categories.js';
import messagesRoutes from './routes/messages.js';
import seedRoutes from './routes/seed.js';


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static uploads
const uploadsDir = path.resolve('uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/seed', seedRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'OK', port: PORT }));

// Global error handler for JSON parser and other errors
app.use((err, req, res, next) => {
  console.error('Express Global Error:', err.message);
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ message: 'The image you uploaded is too large. Please select a smaller file.' });
  }
  res.status(err.status || 500).json({ message: err.message || 'Server error occurred.' });
});

const connectDB = async () => {
  const atlasURI = process.env.MONGO_URI;
  const localURI = process.env.LOCAL_MONGO_URI || 'mongodb://localhost:27017/editorial_db';

  console.log('--- SERVER STARTUP INITIATED ---');

  try {
    console.log('STEP 1: Attempting to connect to MongoDB ATLAS...');
    await mongoose.connect(atlasURI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000 
    });
    console.log('SUCCESS: Connected to MongoDB ATLAS');
  } catch (err) {
    console.warn('WARNING: MongoDB ATLAS connection failed (Possible IP Whitelist issue).');
    console.log('STEP 2: Attempting to connect to LOCAL MongoDB...');
    
    try {
      await mongoose.connect(localURI, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 3000 
      });
      console.log('SUCCESS: Connected to LOCAL MongoDB');
    } catch (localErr) {
      console.error('CRITICAL: All MongoDB connection attempts failed.');
      console.error('Error Details:', localErr.message);
      console.log('\n--- ACTION REQUIRED ---');
      console.log('1. Ensure Local MongoDB service is running (mongod).');
      console.log('2. OR Whitelist your IP in Atlas: https://cloud.mongodb.com/');
      process.exit(1);
    }
  }

  app.listen(PORT, () => {
    console.log(`READY: Server is listening on port ${PORT}`);
    console.log(`URL: http://localhost:${PORT}`);
  });
};

connectDB();
