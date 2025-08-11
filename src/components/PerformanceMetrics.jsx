import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { trackButtonClick } from '../utils/analytics';

const {
  FiTrendingUp,
  FiUsers,
  FiDollarSign,
  FiArrowUp,
  FiArrowDown,
  FiTarget,
  FiBarChart2,
  FiLock,
  FiUnlock,
  FiCalendar,
  FiPieChart,
  FiZap,
  FiDownload
} = FiIcons;

const PerformanceMetrics = ({ metrics = {} }) => {
  const [timeRange, setTimeRange] = useState('month');
  const [accessLevel, setAccessLevel] = useState('basic');
  const [activeTab, setActiveTab] = useState('overview');

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    trackButtonClick(`Time Range: ${range}`, 'Performance Metrics');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    trackButtonClick(`Metrics Tab: ${tab}`, 'Performance Metrics');
  };

  const upgradeAccess = () => {
    setAccessLevel('pro');
    trackButtonClick('Upgrade Metrics to Pro', 'Performance Metrics');
  };

  // Demo metrics data
  const performanceData = {
    overview: {
      campaignPerformance: metrics.campaignPerformance || '+127%',
      leadGeneration: metrics.leadGeneration || '2,847',
      revenueImpact: metrics.revenueImpact || '$45,230',
      conversionRate: '8.7%',
      change: '+2.3%'
    },
    traffic: {
      totalVisits: '14,872',
      uniqueVisitors: '9,345',
      averageSessionDuration: '3:42',
      bounceRate: '42%'
    },
    conversions: {
      totalConversions: '847',
      conversionRate: '8.7%',
      costPerConversion: '$18.42',
      topConversionSource: 'Google Ads'
    },
    campaigns: {
      activeCampaigns: '5',
      topCampaign: 'Summer Promotion',
      campaignROI: '312%',
      averageCTR: '4.8%'
    }
  };

  const renderOverviewTab = () => (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            icon: FiTrendingUp,
            label: 'Campaign Performance',
            value: performanceData.overview.campaignPerformance,
            change: 'vs last month',
            color: 'text-green-400'
          },
          {
            icon: FiUsers,
            label: 'Lead Generation',
            value: performanceData.overview.leadGeneration,
            change: 'qualified leads',
            color: 'text-blue-400'
          },
          {
            icon: FiDollarSign,
            label: 'Revenue Impact',
            value: performanceData.overview.revenueImpact,
            change: 'this quarter',
            color: 'text-tactical-red'
          },
          {
            icon: FiTarget,
            label: 'Conversion Rate',
            value: performanceData.overview.conversionRate,
            change: `${performanceData.overview.change} increase`,
            color: 'text-green-400'
          }
        ].map((stat, index) => (
          <motion.div
            key={index}
            className="bg-medium-gray p-4 rounded-lg tactical-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <SafeIcon icon={stat.icon} className="text-tactical-red text-xl" />
              <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
            </div>
            <h3 className="font-semibold text-white text-sm mb-1">{stat.label}</h3>
            <p className="text-gray-400 text-xs">{stat.change}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Performance Chart */}
        <div className="lg:col-span-2">
          <motion.div
            className="bg-medium-gray p-6 rounded-lg tactical-border h-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Performance Overview</h3>
              <div className="flex space-x-2">
                <button
                  className={`px-2 py-1 text-xs rounded ${timeRange === 'week' ? 'bg-tactical-red text-white' : 'bg-dark-gray text-gray-400'}`}
                  onClick={() => handleTimeRangeChange('week')}
                >
                  Week
                </button>
                <button
                  className={`px-2 py-1 text-xs rounded ${timeRange === 'month' ? 'bg-tactical-red text-white' : 'bg-dark-gray text-gray-400'}`}
                  onClick={() => handleTimeRangeChange('month')}
                >
                  Month
                </button>
                <button
                  className={`px-2 py-1 text-xs rounded ${timeRange === 'quarter' ? 'bg-tactical-red text-white' : 'bg-dark-gray text-gray-400'}`}
                  onClick={() => handleTimeRangeChange('quarter')}
                >
                  Quarter
                </button>
              </div>
            </div>

            <div className="h-64 flex items-center justify-center">
              {accessLevel === 'pro' ? (
                <div className="w-full h-full bg-dark-gray rounded-lg p-4 flex flex-col justify-between">
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-400">Performance Metrics</div>
                    <div className="flex space-x-2">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-tactical-red rounded-full"></div>
                        <span className="text-xs text-gray-400">Leads</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-xs text-gray-400">Revenue</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-grow relative">
                    {/* Simulated chart */}
                    <div className="absolute bottom-0 left-0 right-0 h-3/4 flex items-end">
                      {[...Array(12)].map((_, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center space-y-1">
                          <div 
                            className="w-2/3 bg-tactical-red/80" 
                            style={{ 
                              height: `${20 + Math.random() * 60}%`,
                              marginRight: '1px'
                            }}
                          ></div>
                          <div 
                            className="w-2/3 bg-blue-400/80" 
                            style={{ 
                              height: `${30 + Math.random() * 50}%`,
                              marginRight: '1px'
                            }}
                          ></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-400 pt-2 border-t border-gray-700">
                    {timeRange === 'week' && ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                      <div key={i}>{day}</div>
                    ))}
                    {timeRange === 'month' && ['Week 1', 'Week 2', 'Week 3', 'Week 4'].map((week, i) => (
                      <div key={i}>{week}</div>
                    ))}
                    {timeRange === 'quarter' && ['Jan', 'Feb', 'Mar'].map((month, i) => (
                      <div key={i}>{month}</div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <SafeIcon icon={FiLock} className="text-tactical-red text-4xl mb-4" />
                  <h4 className="text-lg font-bold mb-2">Advanced Analytics Locked</h4>
                  <p className="text-gray-400 mb-4">Upgrade to Pro to access detailed performance charts</p>
                  <button
                    className="px-4 py-2 btn-primary rounded-lg text-sm font-semibold"
                    onClick={upgradeAccess}
                  >
                    Unlock Advanced Analytics
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Leads by Source */}
        <div>
          <motion.div
            className="bg-medium-gray p-6 rounded-lg tactical-border h-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-lg font-bold mb-4">Leads by Source</h3>
            
            {accessLevel === 'pro' ? (
              <div className="space-y-4">
                {[
                  { source: 'Google Ads', percentage: 45, leads: 1282, color: 'bg-blue-400' },
                  { source: 'Facebook', percentage: 27, leads: 768, color: 'bg-indigo-400' },
                  { source: 'Organic', percentage: 18, leads: 512, color: 'bg-green-400' },
                  { source: 'Direct', percentage: 10, leads: 285, color: 'bg-tactical-red' }
                ].map((source, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{source.source}</span>
                      <span className="text-tactical-red">{source.leads} leads</span>
                    </div>
                    <div className="w-full bg-dark-gray rounded-full h-2">
                      <div 
                        className={`${source.color} h-2 rounded-full`} 
                        style={{ width: `${source.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-400">{source.percentage}%</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <SafeIcon icon={FiLock} className="text-tactical-red text-3xl mb-3" />
                <p className="text-gray-400 mb-4">Upgrade to view lead source breakdown</p>
                <button
                  className="px-4 py-2 btn-primary rounded-lg text-sm font-semibold"
                  onClick={upgradeAccess}
                >
                  Unlock Data
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );

  const renderTrafficTab = () => (
    <div>
      {accessLevel === 'pro' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: 'Total Visits',
                value: performanceData.traffic.totalVisits,
                icon: FiUsers,
                change: '+12.4%'
              },
              {
                label: 'Unique Visitors',
                value: performanceData.traffic.uniqueVisitors,
                icon: FiTarget,
                change: '+8.7%'
              },
              {
                label: 'Avg. Session Duration',
                value: performanceData.traffic.averageSessionDuration,
                icon: FiClock,
                change: '+0:22'
              },
              {
                label: 'Bounce Rate',
                value: performanceData.traffic.bounceRate,
                icon: FiBarChart2,
                change: '-3.2%',
                negative: true
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-medium-gray p-4 rounded-lg tactical-border"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <SafeIcon icon={stat.icon} className="text-tactical-red text-xl" />
                  <div className="text-xl font-bold text-white">{stat.value}</div>
                </div>
                <h3 className="font-semibold text-white text-sm mb-1">{stat.label}</h3>
                <p className={`text-xs ${stat.negative ? 'text-green-400' : 'text-blue-400'}`}>
                  {stat.change}
                </p>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            className="bg-medium-gray p-6 rounded-lg tactical-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Traffic Sources</h3>
              <button className="text-sm text-tactical-red flex items-center">
                <SafeIcon icon={FiDownload} className="mr-1" />
                Export
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-400">
                    <th className="pb-2">Source</th>
                    <th className="pb-2">Users</th>
                    <th className="pb-2">Sessions</th>
                    <th className="pb-2">Bounce Rate</th>
                    <th className="pb-2">Conversions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {[
                    { source: 'Google / Organic', users: '3,245', sessions: '4,712', bounce: '38%', conv: '142' },
                    { source: 'Google / CPC', users: '2,871', sessions: '3,982', bounce: '42%', conv: '203' },
                    { source: 'Facebook / Paid', users: '1,924', sessions: '2,391', bounce: '45%', conv: '87' },
                    { source: 'Direct', users: '1,247', sessions: '1,689', bounce: '31%', conv: '56' },
                    { source: 'Referral', users: '892', sessions: '1,128', bounce: '35%', conv: '43' }
                  ].map((row, index) => (
                    <tr key={index} className="border-t border-gray-700">
                      <td className="py-3">{row.source}</td>
                      <td className="py-3">{row.users}</td>
                      <td className="py-3">{row.sessions}</td>
                      <td className="py-3">{row.bounce}</td>
                      <td className="py-3 text-tactical-red">{row.conv}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="flex items-center justify-center py-20">
          <div className="text-center max-w-md">
            <SafeIcon icon={FiLock} className="text-tactical-red text-5xl mb-4 mx-auto" />
            <h3 className="text-2xl font-bold mb-3">Traffic Analytics Locked</h3>
            <p className="text-gray-400 mb-6">
              Detailed traffic analysis is available with Pro access. Upgrade now to see where your visitors are coming from and how they engage with your site.
            </p>
            <button
              className="px-6 py-3 btn-primary rounded-lg font-semibold"
              onClick={upgradeAccess}
            >
              Upgrade to Pro
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderConversionsTab = () => (
    <div>
      {accessLevel === 'pro' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: 'Total Conversions',
                value: performanceData.conversions.totalConversions,
                icon: FiTarget,
                change: '+24.7%'
              },
              {
                label: 'Conversion Rate',
                value: performanceData.conversions.conversionRate,
                icon: FiPieChart,
                change: '+1.8%'
              },
              {
                label: 'Cost Per Conversion',
                value: performanceData.conversions.costPerConversion,
                icon: FiDollarSign,
                change: '-$2.14',
                negative: true
              },
              {
                label: 'Top Source',
                value: performanceData.conversions.topConversionSource,
                icon: FiZap,
                change: 'No change'
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-medium-gray p-4 rounded-lg tactical-border"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <SafeIcon icon={stat.icon} className="text-tactical-red text-xl" />
                  <div className="text-xl font-bold text-white">{stat.value}</div>
                </div>
                <h3 className="font-semibold text-white text-sm mb-1">{stat.label}</h3>
                <p className={`text-xs ${stat.negative ? 'text-green-400' : stat.change === 'No change' ? 'text-gray-400' : 'text-blue-400'}`}>
                  {stat.change}
                </p>
              </motion.div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              className="bg-medium-gray p-6 rounded-lg tactical-border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-lg font-bold mb-4">Conversion by Channel</h3>
              <div className="space-y-4">
                {[
                  { channel: 'Paid Search', conversions: 372, rate: '9.2%', color: 'bg-blue-400' },
                  { channel: 'Social Media', conversions: 214, rate: '7.8%', color: 'bg-indigo-400' },
                  { channel: 'Organic Search', conversions: 156, rate: '6.3%', color: 'bg-green-400' },
                  { channel: 'Direct', conversions: 105, rate: '8.4%', color: 'bg-tactical-red' }
                ].map((item, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{item.channel}</span>
                      <span>{item.conversions} conversions</span>
                    </div>
                    <div className="w-full bg-dark-gray rounded-full h-2">
                      <div 
                        className={`${item.color} h-2 rounded-full`} 
                        style={{ width: `${(item.conversions / 372) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-400">Conversion rate: {item.rate}</div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              className="bg-medium-gray p-6 rounded-lg tactical-border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-lg font-bold mb-4">Top Converting Pages</h3>
              <div className="space-y-4">
                {[
                  { page: '/services/digital-marketing', conversions: 124, rate: '12.4%' },
                  { page: '/contact', conversions: 98, rate: '18.7%' },
                  { page: '/case-studies/johnson-real-estate', conversions: 76, rate: '9.2%' },
                  { page: '/services/video-marketing', conversions: 62, rate: '8.5%' },
                  { page: '/about', conversions: 41, rate: '4.2%' }
                ].map((page, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-700">
                    <div className="flex-grow">
                      <div className="font-medium">{page.page}</div>
                      <div className="text-xs text-gray-400">Conversion rate: {page.rate}</div>
                    </div>
                    <div className="text-tactical-red font-bold">{page.conversions}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center py-20">
          <div className="text-center max-w-md">
            <SafeIcon icon={FiLock} className="text-tactical-red text-5xl mb-4 mx-auto" />
            <h3 className="text-2xl font-bold mb-3">Conversion Analytics Locked</h3>
            <p className="text-gray-400 mb-6">
              Unlock detailed conversion tracking and analysis by upgrading to Pro access. See exactly what's driving your results and optimize for better performance.
            </p>
            <button
              className="px-6 py-3 btn-primary rounded-lg font-semibold"
              onClick={upgradeAccess}
            >
              Upgrade to Pro
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderCampaignsTab = () => (
    <div>
      {accessLevel === 'pro' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: 'Active Campaigns',
                value: performanceData.campaigns.activeCampaigns,
                icon: FiTarget,
                change: '+2'
              },
              {
                label: 'Top Campaign',
                value: performanceData.campaigns.topCampaign,
                icon: FiZap,
                change: 'No change'
              },
              {
                label: 'Campaign ROI',
                value: performanceData.campaigns.campaignROI,
                icon: FiTrendingUp,
                change: '+28%'
              },
              {
                label: 'Average CTR',
                value: performanceData.campaigns.averageCTR,
                icon: FiBarChart2,
                change: '+0.6%'
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-medium-gray p-4 rounded-lg tactical-border"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <SafeIcon icon={stat.icon} className="text-tactical-red text-xl" />
                  <div className="text-xl font-bold text-white">{stat.value}</div>
                </div>
                <h3 className="font-semibold text-white text-sm mb-1">{stat.label}</h3>
                <p className={`text-xs ${stat.change === 'No change' ? 'text-gray-400' : 'text-blue-400'}`}>
                  {stat.change}
                </p>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            className="bg-medium-gray p-6 rounded-lg tactical-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Campaign Performance</h3>
              <button className="text-sm text-tactical-red flex items-center">
                <SafeIcon icon={FiDownload} className="mr-1" />
                Export
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-400">
                    <th className="pb-2">Campaign</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Budget</th>
                    <th className="pb-2">Impressions</th>
                    <th className="pb-2">Clicks</th>
                    <th className="pb-2">CTR</th>
                    <th className="pb-2">Conversions</th>
                    <th className="pb-2">Cost/Conv</th>
                    <th className="pb-2">ROI</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {[
                    { 
                      name: 'Summer Promotion',
                      status: 'active',
                      budget: '$5,000',
                      impressions: '124,872',
                      clicks: '6,243',
                      ctr: '5.0%',
                      conv: '312',
                      cpc: '$16.03',
                      roi: '312%'
                    },
                    { 
                      name: 'Brand Awareness',
                      status: 'active',
                      budget: '$3,500',
                      impressions: '98,541',
                      clicks: '4,123',
                      ctr: '4.2%',
                      conv: '187',
                      cpc: '$18.72',
                      roi: '243%'
                    },
                    { 
                      name: 'Product Launch',
                      status: 'active',
                      budget: '$7,500',
                      impressions: '145,782',
                      clicks: '7,289',
                      ctr: '5.0%',
                      conv: '365',
                      cpc: '$20.55',
                      roi: '287%'
                    },
                    { 
                      name: 'Retargeting',
                      status: 'active',
                      budget: '$2,000',
                      impressions: '67,412',
                      clicks: '3,371',
                      ctr: '5.0%',
                      conv: '219',
                      cpc: '$9.13',
                      roi: '478%'
                    },
                    { 
                      name: 'Holiday Special',
                      status: 'paused',
                      budget: '$4,000',
                      impressions: '89,341',
                      clicks: '4,467',
                      ctr: '5.0%',
                      conv: '223',
                      cpc: '$17.94',
                      roi: '298%'
                    }
                  ].map((campaign, index) => (
                    <tr key={index} className="border-t border-gray-700">
                      <td className="py-3 font-medium">{campaign.name}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 text-xs rounded ${
                          campaign.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td className="py-3">{campaign.budget}</td>
                      <td className="py-3">{campaign.impressions}</td>
                      <td className="py-3">{campaign.clicks}</td>
                      <td className="py-3">{campaign.ctr}</td>
                      <td className="py-3 text-tactical-red font-medium">{campaign.conv}</td>
                      <td className="py-3">{campaign.cpc}</td>
                      <td className="py-3 text-green-400">{campaign.roi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="flex items-center justify-center py-20">
          <div className="text-center max-w-md">
            <SafeIcon icon={FiLock} className="text-tactical-red text-5xl mb-4 mx-auto" />
            <h3 className="text-2xl font-bold mb-3">Campaign Analytics Locked</h3>
            <p className="text-gray-400 mb-6">
              Unlock detailed campaign performance data with Pro access. Track ROI, conversion costs, and optimize your marketing spend for maximum results.
            </p>
            <button
              className="px-6 py-3 btn-primary rounded-lg font-semibold"
              onClick={upgradeAccess}
            >
              Upgrade to Pro
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-display font-bold">
          Performance <span className="text-tactical-red">Metrics</span>
        </h2>
        
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded text-sm ${accessLevel === 'pro' ? 'bg-tactical-red text-white' : 'bg-blue-500/20 text-blue-400'}`}>
            {accessLevel === 'pro' ? 'Pro Access' : 'Basic Access'}
          </span>
          
          {accessLevel !== 'pro' && (
            <button
              className="px-3 py-1 btn-primary rounded text-sm font-semibold"
              onClick={upgradeAccess}
            >
              Upgrade
            </button>
          )}
        </div>
      </div>

      {/* Access Level Indicator */}
      {accessLevel !== 'pro' && (
        <motion.div
          className="bg-tactical-red/20 border border-tactical-red/30 rounded-lg p-4 mb-6 flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiLock} className="text-tactical-red text-xl" />
            <div>
              <h3 className="font-bold">Limited Analytics View</h3>
              <p className="text-sm text-gray-300">Upgrade to Pro for full access to all performance metrics and detailed reporting.</p>
            </div>
          </div>
          <button
            className="px-4 py-2 bg-tactical-red text-white rounded-lg font-semibold text-sm"
            onClick={upgradeAccess}
          >
            Unlock Full Access
          </button>
        </motion.div>
      )}

      {/* Tabs Navigation */}
      <div className="border-b border-gray-700 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', name: 'Overview' },
            { id: 'traffic', name: 'Traffic' },
            { id: 'conversions', name: 'Conversions' },
            { id: 'campaigns', name: 'Campaigns' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`py-3 relative ${
                activeTab === tab.id
                  ? 'text-tactical-red font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.name}
              {activeTab === tab.id && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-tactical-red"
                  layoutId="activeMetricsTab"
                />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'traffic' && renderTrafficTab()}
        {activeTab === 'conversions' && renderConversionsTab()}
        {activeTab === 'campaigns' && renderCampaignsTab()}
      </motion.div>
    </div>
  );
};

export default PerformanceMetrics;