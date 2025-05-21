const mongoose = require('mongoose');

const IntegrationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true
  },
  provider: {
    type: String,
    enum: ['none', 'mailchimp', 'convertkit', 'mailerlite', 'webhook'],
    required: true
  },
  // General fields
  apiKey: {
    type: String,
    select: false // Don't include in queries by default for security
  },
  // Mailchimp specific
  listId: {
    type: String
  },
  // ConvertKit specific
  formId: {
    type: String
  },
  tagId: {
    type: String
  },
  // Webhook specific
  webhookUrl: {
    type: String
  },
  secretKey: {
    type: String,
    select: false // Don't include in queries by default for security
  },
  // Status and tracking
  lastSynced: {
    type: Date
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  stats: {
    totalSynced: {
      type: Number,
      default: 0
    },
    successCount: {
      type: Number,
      default: 0
    },
    failureCount: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
IntegrationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Integration', IntegrationSchema);