const mongoose = require('mongoose');

const EntrySchema = new mongoose.Schema({
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email address'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email'
    ]
  },
  name: {
    type: String,
    trim: true
  },
  newsletterOptIn: {
    type: Boolean,
    default: false
  },
  ipAddress: String,
  entryMethod: {
    type: String,
    enum: ['email', 'referral'],
    default: 'email'
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Entry'
  },
  referralCode: {
    type: String,
    unique: true
  },
  points: {
    type: Number,
    default: 1
  },
  actions: [{
    type: {
      type: String,
      enum: ['email_signup', 'visit_url', 'social_follow', 'social_share', 'referral']
    },
    platform: String, // e.g., 'instagram', 'facebook', etc.
    completed: {
      type: Boolean,
      default: false
    },
    points: {
      type: Number,
      default: 1
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  couponRevealed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate a unique referral code before saving
EntrySchema.pre('save', function(next) {
  if (!this.referralCode) {
    // Generate a unique referral code
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    this.referralCode = `${timestamp}${randomStr}`;
  }
  next();
});

module.exports = mongoose.model('Entry', EntrySchema);