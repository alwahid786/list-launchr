const Campaign = require('../models/Campaign');
const Entry = require('../models/Entry');

// @desc    Get analytics for a specific campaign
// @route   GET /api/analytics/campaign/:campaignId
// @access  Private
exports.getCampaignStats = async (req, res) => {
  try {
    const { campaignId } = req.params;
    
    // Find the campaign to verify ownership
    const campaign = await Campaign.findById(campaignId);
    
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }
    
    // Check campaign ownership
    if (campaign.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access analytics for this campaign'
      });
    }
    
    // Get all entries for deeper analytics
    const entries = await Entry.find({ campaign: campaignId });
    
    // Total entries
    const totalEntries = entries.length;
    
    // Direct vs referral entries
    const directEntries = entries.filter(entry => entry.entryMethod === 'email').length;
    const referralEntries = entries.filter(entry => entry.entryMethod === 'referral').length;
    
    // Entry breakdown by day (for charts)
    const entryDateCounts = {};
    
    entries.forEach(entry => {
      const dateStr = new Date(entry.createdAt).toISOString().split('T')[0];
      entryDateCounts[dateStr] = (entryDateCounts[dateStr] || 0) + 1;
    });
    
    // Convert to array for easier consumption by frontend charts
    const entryDates = Object.keys(entryDateCounts).sort();
    const entryCountsByDay = entryDates.map(date => ({
      date,
      count: entryDateCounts[date]
    }));
    
    // Top referrers
    const referrerCounts = {};
    
    // Count referrals by each entry
    for (const entry of entries) {
      if (entry.referredBy) {
        // Get the referring entry
        const referringEntry = await Entry.findById(entry.referredBy);
        if (referringEntry) {
          const referrerEmail = referringEntry.email;
          referrerCounts[referrerEmail] = (referrerCounts[referrerEmail] || 0) + 1;
        }
      }
    }
    
    // Convert to array and sort by count
    const topReferrers = Object.keys(referrerCounts)
      .map(email => ({ email, count: referrerCounts[email] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Get top 10
    
    // Action breakdown
    const actionCounts = {
      email_signup: 0,
      visit_url: 0,
      social_follow: 0,
      social_share: 0,
      referral: 0
    };
    
    // Count actions across all entries
    entries.forEach(entry => {
      entry.actions.forEach(action => {
        if (action.completed) {
          actionCounts[action.type] = (actionCounts[action.type] || 0) + 1;
        }
      });
    });
    
    // Newsletter opt-in rate
    const newsletterOptIns = entries.filter(entry => entry.newsletterOptIn).length;
    const optInRate = totalEntries > 0 ? (newsletterOptIns / totalEntries * 100).toFixed(1) : 0;
    
    // Compile stats
    const stats = {
      summary: {
        views: campaign.stats.views,
        entries: totalEntries,
        conversionRate: campaign.stats.conversionRate,
        directEntries,
        referralEntries,
        newsletterOptIns,
        optInRate
      },
      entryCountsByDay,
      topReferrers,
      actionBreakdown: actionCounts
    };
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get dashboard analytics across all campaigns
// @route   GET /api/analytics/dashboard
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    // Get all campaigns for the user
    const campaigns = await Campaign.find({ user: req.user.id });
    
    if (campaigns.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalCampaigns: 0,
          activeCampaigns: 0,
          totalEntries: 0,
          totalViews: 0,
          averageConversionRate: 0,
          recentCampaigns: []
        }
      });
    }
    
    // Basic counts
    const totalCampaigns = campaigns.length;
    const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
    
    // Aggregate metrics
    let totalEntries = 0;
    let totalViews = 0;
    
    campaigns.forEach(campaign => {
      totalEntries += campaign.stats.entries;
      totalViews += campaign.stats.views;
    });
    
    // Calculate average conversion rate
    const campaignsWithViews = campaigns.filter(c => c.stats.views > 0);
    let averageConversionRate = 0;
    
    if (campaignsWithViews.length > 0) {
      const sumConversionRates = campaignsWithViews.reduce(
        (sum, campaign) => sum + parseFloat(campaign.stats.conversionRate || 0),
        0
      );
      averageConversionRate = (sumConversionRates / campaignsWithViews.length).toFixed(1);
    }
    
    // Get recent campaigns
    const recentCampaigns = campaigns
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(campaign => ({
        id: campaign._id,
        title: campaign.title,
        status: campaign.status,
        entries: campaign.stats.entries,
        views: campaign.stats.views,
        conversionRate: campaign.stats.conversionRate,
        startDate: campaign.startDate,
        endDate: campaign.endDate
      }));
    
    // Compile dashboard stats
    const dashboardStats = {
      totalCampaigns,
      activeCampaigns,
      totalEntries,
      totalViews,
      averageConversionRate,
      recentCampaigns
    };
    
    res.status(200).json({
      success: true,
      data: dashboardStats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};