import express from 'express';
import Message from '../models/Message.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Send a message
router.post('/', auth, async (req, res) => {
  const { receiver, listing, content } = req.body;
  try {
    const message = new Message({
      sender: req.user.id,
      receiver,
      listing,
      content
    });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user messages (inbox)
router.get('/', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }]
    })
    .populate('sender', 'fullname email')
    .populate('receiver', 'fullname email')
    .populate('listing', 'title price')
    .sort('-createdAt');
    
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get thread with a specific user
router.get('/thread/:userId', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user.id }
      ]
    })
    .populate('sender', 'fullname')
    .populate('receiver', 'fullname')
    .sort('createdAt');
    
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mark messages as read
router.put('/read/:senderId', auth, async (req, res) => {
  try {
    await Message.updateMany(
      { sender: req.params.senderId, receiver: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ message: 'Messages marked as read' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
