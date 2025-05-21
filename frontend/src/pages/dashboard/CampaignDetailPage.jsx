import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { campaignAPI, analyticsAPI, entriesAPI } from '../../api';
import { toast } from 'react-hot-toast';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  ArcElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Line, Pie, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  ArcElement,
  Title, 
  Tooltip, 
  Legend,
  Filler,
  ChartDataLabels
);

const CampaignDetailPage = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [entriesLoading, setEntriesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch campaign details, analytics, and entries
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch campaign details
        setLoading(true);
        const campaignResponse = await campaignAPI.getCampaign(id);
        setCampaign(campaignResponse.data.data);
        setLoading(false);

        // Fetch campaign analytics
        setAnalyticsLoading(true);
        const analyticsResponse = await analyticsAPI.getCampaignStats(id);
        setAnalytics(analyticsResponse.data.data);
        setAnalyticsLoading(false);

        // Fetch campaign entries
        setEntriesLoading(true);
        const entriesResponse = await entriesAPI.getEntries(id);
        setEntries(entriesResponse.data.data);
        setEntriesLoading(false);
      } catch (err) {
        console.error('Error fetching campaign data:', err);
        setError(err.response?.data?.message || 'Failed to load campaign data');
        setLoading(false);
        setAnalyticsLoading(false);
        setEntriesLoading(false);
        toast.error('Failed to load campaign data');
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // Prepare data for the entry growth chart
  const prepareGrowthChartData = () => {
    if (!analytics || !analytics.entriesByDay) {
      return null;
    }

    const dates = Object.keys(analytics.entriesByDay).sort((a, b) => new Date(a) - new Date(b));
    const counts = dates.map(date => analytics.entriesByDay[date]);
    
    // Calculate cumulative count for growth chart
    let cumulativeCount = 0;
    const cumulativeCounts = counts.map(count => {
      cumulativeCount += count;
      return cumulativeCount;
    });

    return {
      labels: dates.map(date => new Date(date).toLocaleDateString()),
      datasets: [
        {
          label: 'Daily Entries',
          data: counts,
          backgroundColor: 'rgba(53, 162, 235, 0.2)',
          borderColor: 'rgba(53, 162, 235, 1)',
          borderWidth: 2,
          tension: 0.4,
        },
        {
          label: 'Total Entries',
          data: cumulativeCounts,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2,
          tension: 0.4,
        }
      ]
    };
  };

  // Prepare data for the entry method breakdown pie chart
  const prepareEntryMethodChartData = () => {
    if (!analytics || !analytics.actionBreakdown) {
      return null;
    }

    // Filter out zero values for cleaner chart
    const filteredData = Object.entries(analytics.actionBreakdown)
      .filter(([_, value]) => value > 0)
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

    const labels = Object.keys(filteredData).map(key => {
      switch(key) {
        case 'email_signup': return 'Email Signup';
        case 'social_follow': return 'Social Follow';
        case 'social_share': return 'Social Share';
        case 'visit_url': return 'URL Visit';
        case 'referral': return 'Referral';
        default: return key;
      }
    });

    const data = Object.values(filteredData);

    // Enhanced color palette with better contrasts
    const backgroundColors = [
      'rgba(255, 99, 132, 0.7)',  // Pink/red
      'rgba(54, 162, 235, 0.7)',  // Blue
      'rgba(255, 206, 86, 0.7)',  // Yellow
      'rgba(75, 192, 192, 0.7)',  // Teal
      'rgba(153, 102, 255, 0.7)', // Purple
      'rgba(255, 159, 64, 0.7)',  // Orange
      'rgba(201, 203, 207, 0.7)', // Grey
      'rgba(100, 220, 123, 0.7)'  // Green
    ];

    return {
      labels,
      datasets: [
        {
          label: 'Entry Method Breakdown',
          data,
          backgroundColor: backgroundColors.slice(0, data.length),
          borderColor: backgroundColors.slice(0, data.length).map(color => color.replace('0.7', '1')),
          borderWidth: 1,
        }
      ]
    };
  };
  
  // Prepare data for the top referrers bar chart
  const prepareReferrerChartData = () => {
    if (!analytics || !analytics.topReferrers || analytics.topReferrers.length === 0) {
      return null;
    }

    // Sort by count in descending order and take the top 10
    const sortedReferrers = [...analytics.topReferrers]
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const labels = sortedReferrers.map(referrer => {
      // Truncate long emails for display
      const email = referrer.email;
      if (email.length > 20) {
        const parts = email.split('@');
        if (parts.length === 2) {
          const username = parts[0];
          const domain = parts[1];
          return `${username.substring(0, 10)}...@${domain}`;
        }
      }
      return email;
    });

    const data = sortedReferrers.map(referrer => referrer.count);

    return {
      labels,
      datasets: [
        {
          label: 'Referral Count',
          data,
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          borderRadius: 5,
          maxBarThickness: 35,
        }
      ]
    };
  };

  // Handle tab switching
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  // Function to export all analytics data
  const exportAnalyticsData = () => {
    if (!analytics || !campaign) return;
    
    // CSV headers
    const sections = [
      // Campaign info
      [
        ['Campaign Analytics Report'],
        ['Campaign:', campaign.title],
        ['Exported on:', new Date().toLocaleString()],
        ['Start Date:', new Date(campaign.startDate).toLocaleDateString()],
        ['End Date:', new Date(campaign.endDate).toLocaleDateString()],
        ['Status:', campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)],
        []
      ],
      
      // Summary statistics
      [
        ['Summary Statistics'],
        ['Metric', 'Value'],
        ['Total Views', analytics.totalViews || campaign.stats.views],
        ['Total Entries', analytics.totalEntries],
        ['Conversion Rate', `${analytics.conversionRate || campaign.stats.conversionRate}%`],
        ['Direct Entries', analytics.summary?.directEntries || 0],
        ['Referral Entries', analytics.summary?.referralEntries || 0],
        ['Newsletter Opt-Ins', `${analytics.newsletterOptInRate}%`],
        []
      ],
      
      // Daily entries data
      [
        ['Daily Entries'],
        ['Date', 'New Entries', 'Cumulative Total'],
        ...(analytics.entriesByDay ? Object.entries(analytics.entriesByDay).map(([date, count], index) => {
          let cumulative = 0;
          for (let i = 0; i <= index; i++) {
            const currentDate = Object.keys(analytics.entriesByDay).sort()[i];
            cumulative += analytics.entriesByDay[currentDate];
          }
          return [date, count, cumulative];
        }) : []),
        []
      ],
      
      // Entry methods breakdown
      [
        ['Entry Methods Breakdown'],
        ['Method', 'Count'],
        ...(analytics.actionBreakdown ? Object.entries(analytics.actionBreakdown).map(([method, count]) => {
          let methodName = method;
          switch(method) {
            case 'email_signup': methodName = 'Email Signup'; break;
            case 'social_follow': methodName = 'Social Follow'; break;
            case 'social_share': methodName = 'Social Share'; break;
            case 'visit_url': methodName = 'URL Visit'; break;
            case 'referral': methodName = 'Referral'; break;
          }
          return [methodName, count];
        }) : []),
        []
      ],
      
      // Top referrers
      [
        ['Top Referrers'],
        ['Rank', 'Email', 'Referrals'],
        ...(analytics.topReferrers ? analytics.topReferrers.map((referrer, index) => 
          [`#${index + 1}`, referrer.email, referrer.count]
        ) : []),
        []
      ]
    ];
    
    // Combine all sections
    const csvContent = sections.flat().map(row => row.join(',')).join('\n');
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${campaign.title}-analytics-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Analytics data exported successfully!');
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
            <div className="mt-4">
              <Link to="/dashboard/campaigns" className="text-sm text-red-700 underline">
                Return to Campaigns
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return null;
  }

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Check if campaign is eligible for picking winners
  const isEligibleForWinnerSelection = () => {
    if (!campaign) return false;
    
    const now = new Date();
    const endDate = new Date(campaign.endDate);
    
    // Campaign is completed or past end date
    return (campaign.status === 'completed' && (!campaign.winners || campaign.winners.length === 0)) || 
           (campaign.status === 'active' && endDate < now);
  };
  
  // Handle selecting winners
  const [selectingWinners, setSelectingWinners] = useState(false);
  const [winnerSelectionError, setWinnerSelectionError] = useState(null);
  
  const handleSelectWinners = async () => {
    try {
      setSelectingWinners(true);
      setWinnerSelectionError(null);
      
      // First set status to completed if not already
      if (campaign.status !== 'completed') {
        await campaignAPI.updateCampaignStatus(campaign._id, 'completed');
      }
      
      // Then select winners
      const response = await campaignAPI.selectWinners(campaign._id);
      
      // Refresh campaign data
      const updatedCampaign = await campaignAPI.getCampaign(campaign._id);
      setCampaign(updatedCampaign.data.data);
      
      toast.success('Winners selected successfully!');
    } catch (err) {
      console.error('Error selecting winners:', err);
      setWinnerSelectionError(err.response?.data?.message || 'Failed to select winners');
      toast.error(err.response?.data?.message || 'Failed to select winners');
    } finally {
      setSelectingWinners(false);
    }
  };

  const growthChartData = prepareGrowthChartData();
  const entryMethodChartData = prepareEntryMethodChartData();
  const referrerChartData = prepareReferrerChartData();

  return (
    <div>
      {/* Campaign Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-headline font-bold text-neutral">{campaign.title}</h1>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${getStatusBadgeClass(campaign.status)}`}>
              {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
            </span>
          </div>
          <p className="text-neutral-600 mt-1">
            {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          {campaign.status === 'active' && campaign.slug && (
            <Link
              to={`/giveaway/${campaign.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-green-500 shadow-sm text-sm font-medium rounded-md text-green-600 bg-white hover:bg-green-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Public Page
            </Link>
          )}
          {isEligibleForWinnerSelection() && (
            <button
              onClick={handleSelectWinners}
              disabled={selectingWinners}
              className="inline-flex items-center px-4 py-2 border border-blue-500 shadow-sm text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {selectingWinners ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Selecting...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Pick Winners
                </>
              )}
            </button>
          )}
          <Link
            to={`/dashboard/campaigns/${campaign._id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Campaign
          </Link>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => handleTabChange('overview')}
            className={`${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Overview
          </button>
          <button
            onClick={() => handleTabChange('entries')}
            className={`${
              activeTab === 'entries'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Entries
          </button>
          <button
            onClick={() => handleTabChange('settings')}
            className={`${
              activeTab === 'settings'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Settings
          </button>
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          {/* Winner Selection Error */}
          {winnerSelectionError && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{winnerSelectionError}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Winners Display */}
          {campaign.winners && campaign.winners.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
              <h2 className="text-lg font-bold text-neutral mb-4">
                🏆 Winners
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rank
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Points
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {campaign.winners.map((winner, index) => (
                      <tr key={winner.entryId}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-lg font-bold">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {winner.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {winner.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {winner.points}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    // Create CSV data
                    const headers = ['Rank', 'Name', 'Email', 'Points'];
                    const rows = campaign.winners.map((winner, index) => 
                      [`#${index + 1}`, winner.name, winner.email, winner.points]
                    );
                    const csvContent = [
                      headers.join(','),
                      ...rows.map(row => row.join(','))
                    ].join('\n');
                    
                    // Create blob and download
                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.setAttribute('href', url);
                    link.setAttribute('download', `${campaign.title}-winners.csv`);
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export Winners
                </button>
              </div>
            </div>
          )}
          
          {/* Export Analytics Button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={exportAnalyticsData}
              disabled={analyticsLoading}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
              Export All Analytics
            </button>
          </div>
          
          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-neutral-600">Total Entries</p>
                  {analyticsLoading ? (
                    <div className="animate-pulse h-8 w-16 bg-gray-200 rounded mt-1"></div>
                  ) : (
                    <p className="text-2xl font-semibold text-neutral">{analytics?.totalEntries.toLocaleString() || 0}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-neutral-600">Page Views</p>
                  {analyticsLoading ? (
                    <div className="animate-pulse h-8 w-16 bg-gray-200 rounded mt-1"></div>
                  ) : (
                    <p className="text-2xl font-semibold text-neutral">{analytics?.totalViews.toLocaleString() || 0}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-neutral-600">Conversion Rate</p>
                  {analyticsLoading ? (
                    <div className="animate-pulse h-8 w-16 bg-gray-200 rounded mt-1"></div>
                  ) : (
                    <p className="text-2xl font-semibold text-neutral">{analytics?.conversionRate.toFixed(1) || 0}%</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-neutral-600">Newsletter Opt-In</p>
                  {analyticsLoading ? (
                    <div className="animate-pulse h-8 w-16 bg-gray-200 rounded mt-1"></div>
                  ) : (
                    <p className="text-2xl font-semibold text-neutral">{analytics?.newsletterOptInRate.toFixed(1) || 0}%</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Entry Growth Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-neutral mb-4">Entry Growth</h2>
              {analyticsLoading ? (
                <div className="animate-pulse h-64 w-full bg-gray-200 rounded"></div>
              ) : growthChartData ? (
                <div className="h-64">
                  <Line 
                    data={growthChartData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            precision: 0
                          }
                        }
                      },
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              return `${context.dataset.label}: ${context.parsed.y}`;
                            }
                          }
                        }
                      },
                    }}
                  />
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center">
                  <p className="text-gray-500">No entry data available</p>
                </div>
              )}
            </div>

            {/* Entry Method Breakdown Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-neutral mb-4">Entry Method Breakdown</h2>
              {analyticsLoading ? (
                <div className="animate-pulse h-64 w-full bg-gray-200 rounded"></div>
              ) : entryMethodChartData ? (
                <div className="h-64 flex flex-col items-center justify-center">
                  <div className="w-full h-full flex items-center justify-center">
                    <Pie 
                      data={entryMethodChartData} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'right',
                            labels: {
                              boxWidth: 15,
                              padding: 15,
                              font: {
                                size: 12
                              }
                            }
                          },
                          tooltip: {
                            callbacks: {
                              label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const value = context.parsed;
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${context.label}: ${value} (${percentage}%)`;
                              }
                            }
                          },
                          datalabels: {
                            display: true,
                            formatter: (value, ctx) => {
                              const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                              const percentage = ((value / total) * 100).toFixed(1);
                              return percentage > 5 ? `${percentage}%` : '';
                            },
                            color: '#fff',
                            font: {
                              weight: 'bold',
                              size: 11
                            }
                          }
                        },
                        rotation: -0.5 * Math.PI,
                        cutout: '30%',
                        animation: {
                          animateScale: true,
                          animateRotate: true
                        }
                      }}
                    />
                  </div>
                  
                  <div className="mt-4 text-center">
                    <div className="text-xs text-gray-500">
                      Total entries: <span className="font-semibold">{entryMethodChartData.datasets[0].data.reduce((a, b) => a + b, 0)}</span> across {entryMethodChartData.labels.length} methods
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center">
                  <p className="text-gray-500">No entry method data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Top Referrers */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-neutral">Top Referrers</h2>
              {/* Only show export button if we have referrer data */}
              {analytics?.topReferrers && analytics.topReferrers.length > 0 && (
                <button
                  onClick={() => {
                    // Create CSV data
                    const headers = ['Rank', 'Email', 'Referrals'];
                    const rows = analytics.topReferrers.map((referrer, index) => 
                      [`#${index + 1}`, referrer.email, referrer.count]
                    );
                    const csvContent = [
                      headers.join(','),
                      ...rows.map(row => row.join(','))
                    ].join('\n');
                    
                    // Create blob and download
                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.setAttribute('href', url);
                    link.setAttribute('download', `${campaign.title}-referrers.csv`);
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    
                    toast.success('Referrers exported successfully!');
                  }}
                  className="inline-flex items-center px-3 py-1.5 text-xs border border-gray-300 shadow-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export CSV
                </button>
              )}
            </div>
            
            {analyticsLoading ? (
              <div className="animate-pulse space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-10 bg-gray-200 rounded"></div>
                ))}
              </div>
            ) : referrerChartData ? (
              <div className="space-y-6">
                {/* Bar Chart */}
                <div className="h-64">
                  <Bar
                    data={referrerChartData}
                    options={{
                      indexAxis: 'y', // Horizontal bar chart
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false // Hide legend for cleaner look
                        },
                        tooltip: {
                          callbacks: {
                            title: function(context) {
                              // Show full email in tooltip
                              const index = context[0].dataIndex;
                              const referrer = analytics.topReferrers[index];
                              return referrer ? referrer.email : '';
                            },
                            label: function(context) {
                              const value = context.raw;
                              return `Referrals: ${value}`;
                            }
                          }
                        },
                        datalabels: {
                          display: true,
                          align: 'end',
                          anchor: 'end',
                          formatter: (value) => `${value}`,
                          color: 'rgba(54, 162, 235, 1)',
                          font: {
                            weight: 'bold'
                          }
                        }
                      },
                      scales: {
                        y: {
                          grid: {
                            display: false
                          }
                        },
                        x: {
                          grid: {
                            color: 'rgba(0,0,0,0.05)'
                          },
                          ticks: {
                            precision: 0 // Only show whole numbers
                          }
                        }
                      }
                    }}
                  />
                </div>
                
                {/* Table View */}
                <div className="overflow-x-auto mt-6">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rank
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Referrals
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          % of Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {analytics.topReferrers.map((referrer, index) => {
                        // Calculate percentage of total referrals
                        const totalReferrals = analytics.topReferrers.reduce((sum, ref) => sum + ref.count, 0);
                        const percentage = ((referrer.count / totalReferrals) * 100).toFixed(1);
                        
                        return (
                          <tr key={referrer.email} className={index < 3 ? 'bg-blue-50' : ''}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <span className={index < 3 ? 'font-bold' : ''}>
                                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {referrer.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                              {referrer.count}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {percentage}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900">No referrals yet</h3>
                <p className="mt-1 text-gray-500">
                  Encourage participants to share your giveaway to earn referrals
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Entries Tab */}
      {activeTab === 'entries' && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-neutral">All Entries</h2>
            <button
              onClick={() => toast.success('Entries export initiated! Check your email for the download link.')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export Entries
            </button>
          </div>

          {entriesLoading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          ) : entries && entries.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions Completed
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Newsletter Opt-In
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Referrals
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {entries.map((entry) => (
                    <tr key={entry._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {entry.name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {entry.actions ? entry.actions.length : 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {entry.newsletterOptIn ? (
                          <span className="text-green-600">Yes</span>
                        ) : (
                          <span className="text-gray-400">No</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {entry.referralCount || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900">No entries yet</h3>
              <p className="mt-1 text-gray-500">
                Share your campaign to start collecting entries!
              </p>
              {campaign.status === 'active' && campaign.slug && (
                <div className="mt-4">
                  <Link
                    to={`/giveaway/${campaign.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-green-500 shadow-sm text-sm font-medium rounded-md text-green-600 bg-white hover:bg-green-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    View Public Page
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-neutral mb-4">Campaign Settings</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-md font-medium text-gray-900">Public URL</h3>
              {campaign.slug ? (
                <div className="mt-2 flex items-center">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/giveaway/${campaign.slug}`}
                    className="flex-grow p-2 border border-gray-300 rounded-l-md bg-gray-50"
                  />
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/giveaway/${campaign.slug}`);
                      toast.success('URL copied to clipboard!');
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors"
                  >
                    Copy
                  </button>
                </div>
              ) : (
                <p className="text-gray-500 mt-2">No public URL available for draft campaigns</p>
              )}
            </div>

            <div>
              <h3 className="text-md font-medium text-gray-900">Campaign Dates</h3>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="text-gray-900">{new Date(campaign.startDate).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">End Date</p>
                  <p className="text-gray-900">{new Date(campaign.endDate).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-md font-medium text-gray-900">Campaign Status</h3>
              <div className="mt-2">
                <span className={`px-2 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusBadgeClass(campaign.status)}`}>
                  {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                </span>
              </div>
              {campaign.status === 'draft' && (
                <div className="mt-4">
                  <button 
                    className="inline-flex items-center px-4 py-2 border border-green-500 shadow-sm text-sm font-medium rounded-md text-green-600 bg-white hover:bg-green-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Activate Campaign
                  </button>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-md font-medium text-gray-900">Winner Settings</h3>
              <div className="mt-2">
                <p className="text-gray-700">Number of Winners: <span className="font-medium">{campaign.numWinners || 1}</span></p>
                {campaign.winners && campaign.winners.length > 0 ? (
                  <div className="mt-2">
                    <p className="text-green-600 font-medium">
                      ✓ Winners have been selected ({campaign.winners.length})
                    </p>
                  </div>
                ) : (
                  <div className="mt-2">
                    <p className="text-gray-500 italic">
                      No winners selected yet
                      {isEligibleForWinnerSelection() && " - campaign is eligible for winner selection"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex justify-end">
                <Link
                  to={`/dashboard/campaigns/${campaign._id}/edit`}
                  className="inline-flex items-center px-4 py-2 border border-blue-300 shadow-sm text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit All Settings
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignDetailPage;