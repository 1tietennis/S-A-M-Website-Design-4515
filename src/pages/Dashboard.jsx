import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { trackPageView, trackButtonClick } from '../utils/analytics';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiTarget, FiTrendingUp, FiUsers, FiDollarSign, FiLogOut, FiSettings } = FiIcons;

const Dashboard = () => {
  const { user, logout } = useAuth();

  useEffect(() => {
    trackPageView('/dashboard', 'Dashboard - Secret Agent Digital Marketing');
  }, []);

  const handleLogout = () => {
    trackButtonClick('Logout', 'Dashboard Header');
    logout();
  };

  const stats = [
    {
      icon: FiTrendingUp,
      label: 'Campaign Performance',
      value: '+127%',
      change: 'vs last month',
      color: 'text-green-400'
    },
    {
      icon: FiUsers,
      label: 'Lead Generation',
      value: '2,847',
      change: 'qualified leads',
      color: 'text-blue-400'
    },
    {
      icon: FiDollarSign,
      label: 'Revenue Impact',
      value: '$45,230',
      change: 'this quarter',
      color: 'text-tactical-red'
    }
  ];

  return (
    <div className="min-h-screen bg-jet-black">
      {/* Header */}
      <header className="bg-dark-gray border-b border-tactical-red/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiTarget} className="text-tactical-red text-2xl" />
              <h1 className="text-xl font-display font-bold gradient-text">
                Mission Control
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {user && (
                <div className="text-gray-300">
                  Welcome back, <span className="text-tactical-red font-semibold">{user.name || 'Agent'}</span>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-tactical-red/20 hover:bg-tactical-red/30 rounded-lg transition-colors duration-200"
              >
                <SafeIcon icon={FiLogOut} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Welcome Section */}
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Mission <span className="text-tactical-red">Dashboard</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl">
              Your command center for dominating the digital battlefield. Monitor campaigns, 
              track performance, and deploy new strategies with military precision.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-dark-gray p-6 rounded-lg tactical-border card-hover"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <SafeIcon icon={stat.icon} className="text-tactical-red text-2xl" />
                  <div className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </div>
                </div>
                <h3 className="font-semibold text-white mb-1">{stat.label}</h3>
                <p className="text-gray-400 text-sm">{stat.change}</p>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <motion.div
            className="bg-dark-gray rounded-lg p-8 tactical-border"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: FiTrendingUp, label: 'View Analytics', href: '/analytics' },
                { icon: FiUsers, label: 'Manage Campaigns', href: '/campaigns' },
                { icon: FiSettings, label: 'Account Settings', href: '/settings' },
                { icon: FiTarget, label: 'New Campaign', href: '/campaigns/new' }
              ].map((action, index) => (
                <button
                  key={index}
                  className="flex flex-col items-center p-4 bg-medium-gray rounded-lg hover:bg-tactical-red/20 transition-colors duration-200"
                  onClick={() => trackButtonClick(action.label, 'Dashboard Quick Actions')}
                >
                  <SafeIcon icon={action.icon} className="text-tactical-red text-2xl mb-2" />
                  <span className="text-sm font-semibold">{action.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            className="mt-8 bg-dark-gray rounded-lg p-8 tactical-border"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h3 className="text-2xl font-bold mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { action: 'New lead generated', time: '2 hours ago', status: 'success' },
                { action: 'Campaign performance updated', time: '4 hours ago', status: 'info' },
                { action: 'Monthly report generated', time: '1 day ago', status: 'success' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-medium-gray rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'success' ? 'bg-green-400' : 'bg-blue-400'
                    }`}></div>
                    <span>{activity.action}</span>
                  </div>
                  <span className="text-gray-400 text-sm">{activity.time}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;