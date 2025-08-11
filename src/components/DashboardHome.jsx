import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { trackButtonClick } from '../utils/analytics';

const {
  FiTarget,
  FiTrendingUp,
  FiUsers,
  FiDollarSign,
  FiArrowUp,
  FiArrowRight,
  FiCalendar,
  FiClock,
  FiAlertCircle,
  FiCheckCircle
} = FiIcons;

const DashboardHome = ({ data }) => {
  const { campaigns, contacts, metrics, loading } = data;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tactical-red"></div>
      </div>
    );
  }

  // Stats for the top cards
  const stats = [
    {
      icon: FiTrendingUp,
      label: 'Campaign Performance',
      value: metrics.campaignPerformance || '+127%',
      change: 'vs last month',
      color: 'text-green-400'
    },
    {
      icon: FiUsers,
      label: 'Lead Generation',
      value: metrics.totalContacts || '0',
      change: 'qualified leads',
      color: 'text-blue-400'
    },
    {
      icon: FiDollarSign,
      label: 'Revenue Impact',
      value: metrics.revenueImpact || '$0',
      change: 'this quarter',
      color: 'text-tactical-red'
    }
  ];

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold mb-4">
          Mission <span className="text-tactical-red">Dashboard</span>
        </h2>
        <p className="text-gray-300">
          Your command center for dominating the digital battlefield. Monitor campaigns, track performance, and deploy new strategies with military precision.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="bg-medium-gray p-6 rounded-lg tactical-border card-hover"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <SafeIcon icon={stat.icon} className="text-tactical-red text-2xl" />
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            </div>
            <h3 className="font-semibold text-white mb-1">{stat.label}</h3>
            <p className="text-gray-400 text-sm">{stat.change}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity and Campaign Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Contacts */}
        <motion.div
          className="bg-medium-gray rounded-lg p-6 tactical-border"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <SafeIcon icon={FiUsers} className="text-tactical-red mr-2" />
            Recent Contacts
          </h3>
          
          {contacts && contacts.length > 0 ? (
            <div className="space-y-4">
              {contacts.slice(0, 4).map((contact, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-dark-gray rounded-lg">
                  <div>
                    <p className="font-semibold">{contact.name}</p>
                    <p className="text-sm text-gray-400">{contact.email}</p>
                  </div>
                  <div className="flex items-center">
                    <span className={`px-2 py-1 text-xs rounded capitalize ${
                      contact.status === 'new' ? 'bg-blue-500 text-white' :
                      contact.status === 'contacted' ? 'bg-yellow-500 text-white' :
                      contact.status === 'qualified' ? 'bg-green-500 text-white' :
                      contact.status === 'unqualified' ? 'bg-red-500 text-white' :
                      contact.status === 'converted' ? 'bg-purple-500 text-white' :
                      'bg-gray-500 text-white'
                    }`}>
                      {contact.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 text-gray-400">
              No contacts found. Start capturing leads with your marketing campaigns.
            </div>
          )}
          
          <button
            className="mt-4 w-full px-4 py-2 border border-tactical-red text-tactical-red rounded-lg hover:bg-tactical-red hover:text-white transition-colors flex items-center justify-center space-x-2"
            onClick={() => trackButtonClick('View All Contacts', 'Dashboard')}
          >
            <span>View All Contacts</span>
            <SafeIcon icon={FiArrowRight} />
          </button>
        </motion.div>

        {/* Campaign Status */}
        <motion.div
          className="bg-medium-gray rounded-lg p-6 tactical-border"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <SafeIcon icon={FiTarget} className="text-tactical-red mr-2" />
            Campaign Status
          </h3>
          
          {campaigns && campaigns.length > 0 ? (
            <div className="space-y-4">
              {campaigns.slice(0, 4).map((campaign, index) => (
                <div key={index} className="p-3 bg-dark-gray rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">{campaign.name}</h4>
                    <span className={`px-2 py-1 text-xs rounded capitalize ${
                      campaign.status === 'active' ? 'bg-green-500 text-white' :
                      campaign.status === 'paused' ? 'bg-yellow-500 text-white' :
                      campaign.status === 'draft' ? 'bg-blue-500 text-white' :
                      campaign.status === 'completed' ? 'bg-purple-500 text-white' :
                      'bg-gray-500 text-white'
                    }`}>
                      {campaign.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center">
                      <SafeIcon icon={FiCalendar} className="mr-1" />
                      <span>
                        {campaign.start_date ? new Date(campaign.start_date).toLocaleDateString() : 'Not started'}
                      </span>
                    </div>
                    <div>
                      Budget: ${campaign.budget?.toLocaleString() || '0'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 text-gray-400">
              No campaigns found. Create your first marketing campaign to get started.
            </div>
          )}
          
          <button
            className="mt-4 w-full px-4 py-2 border border-tactical-red text-tactical-red rounded-lg hover:bg-tactical-red hover:text-white transition-colors flex items-center justify-center space-x-2"
            onClick={() => trackButtonClick('View All Campaigns', 'Dashboard')}
          >
            <span>View All Campaigns</span>
            <SafeIcon icon={FiArrowRight} />
          </button>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        className="bg-medium-gray rounded-lg p-6 tactical-border"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: FiTarget, label: "New Campaign", action: "campaigns" },
            { icon: FiUsers, label: "Add Contact", action: "contacts" },
            { icon: FiTrendingUp, label: "View Analytics", action: "performance" },
            { icon: FiDollarSign, label: "Set Budget", action: "strategy" }
          ].map((action, index) => (
            <button
              key={index}
              className="flex flex-col items-center justify-center p-4 bg-dark-gray rounded-lg hover:bg-tactical-red/20 transition-colors duration-200"
              onClick={() => trackButtonClick(`Quick Action: ${action.label}`, 'Dashboard')}
            >
              <SafeIcon icon={action.icon} className="text-tactical-red text-2xl mb-2" />
              <span className="text-sm font-semibold">{action.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Self-Marketing System CTA */}
      <motion.div
        className="mt-8 bg-gradient-to-r from-tactical-red/20 to-dark-gray rounded-lg p-6 border border-tactical-red/30"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold mb-2 gradient-text">Unlock The Self-Marketing System™</h3>
            <p className="text-gray-300">Deploy our proprietary revenue-generating system that works around the clock.</p>
          </div>
          <button
            onClick={() => trackButtonClick('Activate Self-Marketing System', 'Dashboard CTA')}
            className="px-6 py-3 btn-primary rounded-lg font-semibold flex items-center space-x-2"
          >
            <span>Activate System</span>
            <SafeIcon icon={FiArrowRight} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardHome;