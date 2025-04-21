import express from 'express';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Charity from '../models/Charity.js';
import User from '../models/User.js';

const router = express.Router();

// Auth middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token, authorization denied' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token is not valid' });
  }
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/charity';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    
    cb(new Error('Only images are allowed'));
  }
});

// Get all charity campaigns
router.get('/', async (req, res) => {
  try {
    const { category, status, search } = req.query;
    
    // Build filter query
    const filter = {};
    
    if (category) {
      filter.category = category;
    }
    
    if (status) {
      filter.status = status;
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const campaigns = await Charity.find(filter)
      .populate('organizer', 'name email profilePicture')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: campaigns.length,
      data: campaigns
    });
  } catch (error) {
    console.error('Error getting campaigns:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get single charity campaign
router.get('/:id', async (req, res) => {
  try {
    const campaign = await Charity.findById(req.params.id)
      .populate('organizer', 'name email profilePicture')
      .populate('donors.user', 'name profilePicture');
    
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }
    
    res.status(200).json({
      success: true,
      data: campaign
    });
  } catch (error) {
    console.error('Error getting campaign:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Create a new charity campaign
router.post('/', auth, upload.array('images', 5), async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      targetAmount,
      endDate,
      village,
      district,
      state,
      beneficiaries
    } = req.body;
    
    // Process uploaded images
    const imageFiles = req.files || [];
    const images = imageFiles.map(file => `/uploads/charity/${file.filename}`);
    
    const campaign = new Charity({
      title,
      description,
      category,
      targetAmount,
      endDate,
      location: {
        village,
        district,
        state
      },
      organizer: req.user._id,
      beneficiaries,
      images
    });
    
    await campaign.save();
    
    res.status(201).json({
      success: true,
      data: campaign
    });
  } catch (error) {
    console.error('Create campaign error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Update a charity campaign
router.put('/:id', auth, async (req, res) => {
  try {
    let campaign = await Charity.findById(req.params.id);
    
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }
    
    // Check if user is the organizer
    if (campaign.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this campaign' });
    }
    
    // Update campaign
    const updateData = req.body;
    
    if (updateData.location) {
      updateData.location = {
        village: updateData.village || campaign.location.village,
        district: updateData.district || campaign.location.district,
        state: updateData.state || campaign.location.state
      };
    }
    
    campaign = await Charity.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: campaign
    });
  } catch (error) {
    console.error('Update campaign error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Donate to a campaign
router.post('/:id/donate', auth, async (req, res) => {
  try {
    const { amount, message, anonymous } = req.body;
    
    const campaign = await Charity.findById(req.params.id);
    
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }
    
    // Add donation
    campaign.donors.push({
      user: req.user._id,
      amount,
      message,
      anonymous: anonymous || false
    });
    
    // Update raised amount
    campaign.raisedAmount += Number(amount);
    
    // If target reached, update status
    if (campaign.raisedAmount >= campaign.targetAmount) {
      campaign.status = 'completed';
    }
    
    await campaign.save();
    
    res.status(200).json({
      success: true,
      data: campaign
    });
  } catch (error) {
    console.error('Donation error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Add an update to a campaign
router.post('/:id/update', auth, upload.array('images', 3), async (req, res) => {
  try {
    const { title, content } = req.body;
    
    const campaign = await Charity.findById(req.params.id);
    
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }
    
    // Check if user is the organizer
    if (campaign.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this campaign' });
    }
    
    // Process uploaded images
    const imageFiles = req.files || [];
    const images = imageFiles.map(file => `/uploads/charity/${file.filename}`);
    
    campaign.updates.push({
      title,
      content,
      images
    });
    
    await campaign.save();
    
    res.status(200).json({
      success: true,
      data: campaign
    });
  } catch (error) {
    console.error('Campaign update error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

export default router; 