import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { trackButtonClick } from '../utils/analytics';

const {
  FiHome,
  FiTarget,
  FiTrendingUp,
  FiBarChart2,
  FiBriefcase,
  FiUsers,
  FiSettings,
  FiZap
} = FiIcons;

const DashboardMenu = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    {
      id: 'home',
      name: 'Dashboard Home',
      icon: FiHome,
      description: 'Overview of your marketing operations'
    },
    {
      id: 'strategy',
      name: 'Marketing Strategy',
      icon: FiTarget,
      description: 'Your personalized marketing strategy',
      highlight: true
    },
    {
      id: 'campaigns',
      name: 'Campaign Manager',
      icon: FiBarChart2,
      description: 'Manage your active campaigns'
    },
    {
      id: 'performance',
      name: 'Performance Metrics',
      icon: FiTrendingUp,
      description: 'Analytics and performance data'
    },
    {
      id: 'briefing',
      name: 'Mission Briefing',
      icon: FiBriefcase,
      description: 'Setup your marketing arsenal'
    },
    {
      id: 'contacts',
      name: 'Contact Manager',
      icon: FiUsers,
      description: 'Manage your leads and contacts',
      link: '/contact-manager'
    }
  ];

  const handleMenuClick = (item) => {
    trackButtonClick(`Dashboard Menu: ${item.name}`, 'Dashboard');
    if (item.link) {
      // External link, will be handled by React Router Link
      return;
    }
    setActiveSection(item.id);
  };

  return (
    <motion.div
      className="bg-dark-gray rounded-lg p-4 tactical-border"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-bold mb-6 text-center gradient-text">Command Center</h2>
      
      <div className="space-y-2">
        {menuItems.map((item) => (
          item.link ? (
            <a
              key={item.id}
              href={item.link}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
                activeSection === item.id
                  ? 'bg-tactical-red/20 text-tactical-red'
                  : 'hover:bg-medium-gray text-gray-300 hover:text-white'
              } ${item.highlight ? 'relative' : ''}`}
              onClick={() => handleMenuClick(item)}
            >
              {item.highlight && (
                <span className="absolute -right-1 -top-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tactical-red opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-tactical-red"></span>
                </span>
              )}
              <SafeIcon icon={item.icon} className={activeSection === item.id ? 'text-tactical-red' : ''} />
              <span>{item.name}</span>
            </a>
          ) : (
            <button
              key={item.id}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
                activeSection === item.id
                  ? 'bg-tactical-red/20 text-tactical-red'
                  : 'hover:bg-medium-gray text-gray-300 hover:text-white'
              } ${item.highlight ? 'relative' : ''}`}
              onClick={() => handleMenuClick(item)}
            >
              {item.highlight && (
                <span className="absolute -right-1 -top-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tactical-red opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-tactical-red"></span>
                </span>
              )}
              <SafeIcon icon={item.icon} className={activeSection === item.id ? 'text-tactical-red' : ''} />
              <span>{item.name}</span>
            </button>
          )
        ))}
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-700">
        <button className="w-full flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 hover:bg-medium-gray text-gray-300 hover:text-white">
          <SafeIcon icon={FiSettings} />
          <span>Account Settings</span>
        </button>
        
        <div className="mt-4 p-4 bg-tactical-red/10 rounded-lg border border-tactical-red/30">
          <div className="flex items-center space-x-2 mb-2">
            <SafeIcon icon={FiZap} className="text-tactical-red" />
            <h3 className="font-bold text-sm">Self-Marketing System™</h3>
          </div>
          <p className="text-xs text-gray-400 mb-3">
            Unlock our proprietary revenue-generating system that works around the clock.
          </p>
          <button 
            onClick={() => {
              setActiveSection('strategy');
              trackButtonClick('Upgrade to Pro', 'Dashboard Menu');
            }}
            className="w-full py-2 btn-primary text-xs rounded-lg font-semibold"
          >
            Upgrade to Pro
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardMenu;