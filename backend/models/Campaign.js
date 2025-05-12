const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a campaign title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  prizeTitle: {
    type: String,
    required: [true, 'Please provide a prize title'],
    trim: true,
    maxlength: [100, 'Prize title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a campaign description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  startDate: {
    type: Date,
    required: [true, 'Please provide a start date']
  },
  endDate: {
    type: Date,
    required: [true, 'Please provide an end date']
  },
  numWinners: {
    type: Number,
    required: [true, 'Please provide number of winners'],
    default: 1,
    min: [1, 'Number of winners must be at least 1'],
    max: [100, 'Number of winners cannot be more than 100']
  },
  externalUrl: {
    type: String,
    trim: true,
    match: [
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
      'Please provide a valid URL'
    ]
  },
  // Email Collection
  emailHeadline: {
    type: String,
    default: 'Join the giveaway!'
  },
  emailSubheadline: {
    type: String,
    default: 'Enter your email to join this exciting giveaway.'
  },
  termsConsent: {
    type: Boolean,
    default: true
  },
  newsletterOptIn: {
    type: Boolean,
    default: true
  },
  // Entry Options
  entryOptions: {
    visitUrl: {
      enabled: {
        type: Boolean,
        default: false
      },
      url: String
    },
    socialFollow: {
      instagram: {
        enabled: {
          type: Boolean,
          default: false
        },
        username: String
      },
      facebook: {
        enabled: {
          type: Boolean,
          default: false
        },
        pageUrl: String
      },
      youtube: {
        enabled: {
          type: Boolean,
          default: false
        },
        channelUrl: String
      },
      tiktok: {
        enabled: {
          type: Boolean,
          default: false
        },
        username: String
      }
    },
    socialShare: {
      facebook: {
        enabled: {
          type: Boolean,
          default: false
        }
      },
      twitter: {
        enabled: {
          type: Boolean,
          default: false
        }
      }
    },
    referral: {
      enabled: {
        type: Boolean,
        default: false
      },
      pointsPerReferral: {
        type: Number,
        default: 1
      }
    }
  },
  // Design Customization
  design: {
    logo: {
      type: String // URL to uploaded logo
    },
    headerImage: {
      type: String // URL to uploaded header image
    },
    colorScheme: {
      type: String,
      enum: ['blue', 'green', 'red', 'purple', 'orange'],
      default: 'blue'
    },
    ctaText: {
      type: String,
      default: 'Enter Giveaway'
    },
    headlineText: {
      type: String,
      default: 'Win Amazing Prizes!'
    }
  },
  // Integrations
  integrations: {
    provider: {
      type: String,
      enum: ['none', 'mailchimp', 'mailerlite', 'convertkit', 'webhook'],
      default: 'none'
    },
    apiKey: String,
    listId: String,
    webhookUrl: String
  },
  // Coupon Reveal (optional)
  couponReveal: {
    enabled: {
      type: Boolean,
      default: false
    },
    code: String,
    description: String
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'active', 'completed', 'cancelled'],
    default: 'draft'
  },
  slug: {
    type: String,
    unique: true
  },
  stats: {
    views: {
      type: Number,
      default: 0
    },
    entries: {
      type: Number,
      default: 0
    },
    referrals: {
      type: Number,
      default: 0
    },
    conversionRate: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate a slug before saving
CampaignSchema.pre('save', function(next) {
  if (!this.slug) {
    // Create slug from title (lowercase, replace spaces with dashes, remove special characters)
    const baseSlug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    // Add a timestamp to ensure uniqueness
    this.slug = `${baseSlug}-${Date.now().toString(36)}`;
  }
  next();
});

module.exports = mongoose.model('Campaign', CampaignSchema);