const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password in queries by default
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true // Allows multiple null values
  },
  picture: {
    type: String,
    default: ''
  },
  accountType: {
    type: String,
    enum: ['free', 'pro'],
    default: 'free'
  },
  // Stripe subscription fields
  stripeCustomerId: {
    type: String,
    select: false
  },
  subscriptionId: {
    type: String,
    select: false
  },
  subscriptionStatus: {
    type: String,
    enum: ['none', 'active', 'trialing', 'past_due', 'canceled', 'unpaid'],
    default: 'none'
  },
  subscriptionEndsAt: {
    type: Date
  },
  isPro: {
    type: Boolean,
    default: false
  },
  lastBillingDate: {
    type: Date
  },
  nextBillingDate: {
    type: Date
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  // Only run this if password was modified
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE
    }
  );
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

// Check if user has Pro access
UserSchema.methods.hasProAccess = function() {
  // User has Pro access if they are a Pro and their subscription is active/trialing
  return this.isPro && 
    (this.subscriptionStatus === 'active' || 
     this.subscriptionStatus === 'trialing' || 
     (this.subscriptionEndsAt && this.subscriptionEndsAt > new Date()));
};

module.exports = mongoose.model('User', UserSchema);