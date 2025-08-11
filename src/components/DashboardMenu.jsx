import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../context/AuthContext';
import supabase from '../lib/supabase';

const { 
  FiHome, FiUsers, FiBarChart2, FiSettings, FiMail, FiLock, FiUnlock,
  FiChevronDown, FiChevronUp, FiLogOut, FiTarget, FiShield, FiBriefcase
} = FiIcons;

const DashboardMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(null);
  const [subscriptionTier, setSubscriptionTier] = useState('free');
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchUserSubscription(user.id);
    }
  }, [isAuthenticated, user]);

  const fetchUserSubscription = async (userId) => {
    try {
      // For now we'll just simulate this, but in a real app you'd fetch from Supabase
      const { data, error } = await supabase
        .from('subscription_tiers_jfk72b')
        .select('name')
        .limit(1);
        
      if (error) throw error;
      
      // Default to free tier if no subscription found
      setSubscriptionTier(data?.length > 0 ? 'premium' : 'free');
    } catch (error) {
      console.error('Error fetching subscription:', error);
      setSubscriptionTier('free');
    }
  };

  if (!isAuthenticated) return null;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setIsDropdownOpen(null);
  };

  const toggleDropdown = (dropdown) => {
    if (isDropdownOpen === dropdown) {
      setIsDropdownOpen(null);
    } else {
      setIsDropdownOpen(dropdown);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const menuVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 }
  };

  const dropdownVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto' }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {/* Toggle button */}
      <motion.button
        className="flex items-center justify-center p-3 bg-tactical-red rounded-full shadow-lg hover:bg-red-700 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleMenu}
      >
        <SafeIcon 
          icon={isOpen ? FiChevronDown : FiTarget} 
          className="text-white text-xl" 
        />
      </motion.button>

      {/* Menu panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-16 left-0 bg-dark-gray rounded-lg shadow-lg border border-tactical-red p-3 w-64"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center space-x-2 px-3 py-2 border-b border-gray-700">
              <SafeIcon icon={FiTarget} className="text-tactical-red" />
              <span className="font-semibold text-sm">Agent Dashboard</span>
              <span className={`ml-auto text-xs px-2 py-1 rounded ${subscriptionTier === 'free' ? 'bg-blue-500' : 'bg-tactical-red'}`}>
                {subscriptionTier === 'free' ? 'Basic' : 'Premium'}
              </span>
            </div>
            
            <div className="mt-2 space-y-1">
              {/* Dashboard Dropdown */}
              <div>
                <button 
                  onClick={() => toggleDropdown('dashboard')}
                  className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-medium-gray transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiHome} className="text-tactical-red" />
                    <span className="text-sm">Dashboard 🕵️‍♂️</span>
                  </div>
                  <SafeIcon 
                    icon={isDropdownOpen === 'dashboard' ? FiChevronUp : FiChevronDown} 
                    className="text-gray-400"
                  />
                </button>
                
                <AnimatePresence>
                  {isDropdownOpen === 'dashboard' && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={dropdownVariants}
                      className="overflow-hidden pl-8 space-y-1"
                    >
                      <Link
                        to="/mission-briefing"
                        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-medium-gray transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <SafeIcon icon={FiUnlock} className="text-blue-400" />
                        <div>
                          <span className="text-sm block">Free Intel Briefing</span>
                          <span className="text-xs text-gray-400">Basic Access</span>
                        </div>
                      </Link>
                      
                      <Link
                        to="/tactical-control"
                        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-medium-gray transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        {subscriptionTier === 'free' ? (
                          <SafeIcon icon={FiLock} className="text-gray-400" />
                        ) : (
                          <SafeIcon icon={FiUnlock} className="text-tactical-red" />
                        )}
                        <div>
                          <span className={`text-sm block ${subscriptionTier === 'free' ? 'text-gray-400' : ''}`}>
                            Full Tactical Control
                          </span>
                          <span className="text-xs text-gray-400">Paid Upgrade</span>
                        </div>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Contacts Menu */}
              <div>
                <button 
                  onClick={() => toggleDropdown('contacts')}
                  className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-medium-gray transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiUsers} className="text-tactical-red" />
                    <span className="text-sm">Contacts Menu</span>
                  </div>
                  <SafeIcon 
                    icon={isDropdownOpen === 'contacts' ? FiChevronUp : FiChevronDown} 
                    className="text-gray-400"
                  />
                </button>
                
                <AnimatePresence>
                  {isDropdownOpen === 'contacts' && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={dropdownVariants}
                      className="overflow-hidden pl-8 space-y-1"
                    >
                      <Link
                        to="/contact-manager"
                        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-medium-gray transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <SafeIcon icon={FiUsers} className="text-blue-400" />
                        <span className="text-sm">Lead Assets</span>
                      </Link>
                      
                      <Link
                        to="/mission-contacts"
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-medium-gray transition-colors ${subscriptionTier === 'free' ? 'opacity-50' : ''}`}
                        onClick={() => setIsOpen(false)}
                      >
                        {subscriptionTier === 'free' ? (
                          <SafeIcon icon={FiLock} className="text-gray-400" />
                        ) : (
                          <SafeIcon icon={FiBriefcase} className="text-tactical-red" />
                        )}
                        <span className="text-sm">Mission Contacts</span>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Analytics Menu */}
              <div>
                <button 
                  onClick={() => toggleDropdown('analytics')}
                  className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-medium-gray transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiBarChart2} className="text-tactical-red" />
                    <span className="text-sm">Intelligence</span>
                  </div>
                  <SafeIcon 
                    icon={isDropdownOpen === 'analytics' ? FiChevronUp : FiChevronDown} 
                    className="text-gray-400"
                  />
                </button>
                
                <AnimatePresence>
                  {isDropdownOpen === 'analytics' && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={dropdownVariants}
                      className="overflow-hidden pl-8 space-y-1"
                    >
                      <Link
                        to="/analytics"
                        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-medium-gray transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <SafeIcon icon={FiBarChart2} className="text-blue-400" />
                        <span className="text-sm">Basic Reports</span>
                      </Link>
                      
                      <Link
                        to="/advanced-analytics"
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-medium-gray transition-colors ${subscriptionTier === 'free' ? 'opacity-50' : ''}`}
                        onClick={() => setIsOpen(false)}
                      >
                        {subscriptionTier === 'free' ? (
                          <SafeIcon icon={FiLock} className="text-gray-400" />
                        ) : (
                          <SafeIcon icon={FiBarChart2} className="text-tactical-red" />
                        )}
                        <span className="text-sm">Advanced Intel</span>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Settings */}
              <Link
                to="/settings"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-medium-gray transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <SafeIcon icon={FiSettings} className="text-tactical-red" />
                <span className="text-sm">Mission Control</span>
              </Link>
              
              {/* Upgrade Button */}
              {subscriptionTier === 'free' && (
                <Link
                  to="/upgrade"
                  className="flex items-center justify-center space-x-2 mt-3 px-3 py-2 bg-tactical-red rounded-lg hover:bg-red-700 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <SafeIcon icon={FiShield} className="text-white" />
                  <span className="text-sm text-white font-semibold">Upgrade to Full Access</span>
                </Link>
              )}
              
              {/* Logout */}
              <button 
                className="w-full flex items-center space-x-2 px-3 py-2 mt-2 rounded-lg hover:bg-medium-gray transition-colors text-left"
                onClick={handleLogout}
              >
                <SafeIcon icon={FiLogOut} className="text-tactical-red" />
                <span className="text-sm">End Mission</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardMenu;