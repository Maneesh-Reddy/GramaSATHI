import mongoose from 'mongoose';

const charitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  category: {
    type: String,
    enum: ['elderly', 'disabled', 'children', 'women', 'other'],
    required: [true, 'Category is required']
  },
  targetAmount: {
    type: Number,
    required: [true, 'Target amount is required'],
    min: 1
  },
  raisedAmount: {
    type: Number,
    default: 0
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  location: {
    village: String,
    district: String,
    state: String
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Organizer is required']
  },
  beneficiaries: {
    type: Number,
    required: [true, 'Number of beneficiaries is required'],
    min: 1
  },
  images: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  donors: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    amount: Number,
    date: {
      type: Date,
      default: Date.now
    },
    anonymous: {
      type: Boolean,
      default: false
    },
    message: String
  }],
  updates: [{
    title: String,
    content: String,
    date: {
      type: Date,
      default: Date.now
    },
    images: [String]
  }]
}, {
  timestamps: true
});

// Virtual field for progress percentage
charitySchema.virtual('progressPercentage').get(function() {
  return Math.min(Math.round((this.raisedAmount / this.targetAmount) * 100), 100);
});

// Virtual field for days remaining
charitySchema.virtual('daysRemaining').get(function() {
  const now = new Date();
  const end = new Date(this.endDate);
  const diffTime = end - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
});

// Include virtuals when converting to JSON
charitySchema.set('toJSON', { virtuals: true });
charitySchema.set('toObject', { virtuals: true });

const Charity = mongoose.model('Charity', charitySchema);

export default Charity; 