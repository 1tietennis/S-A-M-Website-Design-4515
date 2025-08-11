import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { trackButtonClick } from '../utils/analytics';
import { useAuth } from '../context/AuthContext';

const {
  FiHome, FiUsers, FiTarget, FiActivity, FiSettings,
  FiBarChart2, FiMessageSquare, FiLogOut, FiChevronLeft,
  FiChevronRight, FiMenu
} = FiIcons;

const DashboardSidebar = () => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigationItems = [
    { name: 'Dashboard', icon: FiHome, path: '/dashboard' },
    { name: 'Contacts', icon: FiUsers, path: '/contact-manager' },
    { name: 'Mission Brief', icon: FiTarget, path: '/mission-briefing' },
    { name: 'Analytics', icon: FiBarChart2, path: '/analytics', disabled: true },
    { name: 'Campaigns', icon: FiActivity, path: '/campaigns', disabled: true },
    { name: 'Messages', icon: FiMessageSquare, path: '/messages', disabled: true },
    { name: 'Settings', icon: FiSettings, path: '/settings', disabled: true },
  ];

  const handleNavClick = (itemName, path) => {
    trackButtonClick(`Dashboard Nav: ${itemName}`, 'DashboardSidebar');
    setMobileOpen(false);
  };

  const handleLogout = () => {
    trackButtonClick('Logout', 'DashboardSidebar');
    logout();
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    trackButtonClick(collapsed ? 'Expand Sidebar' : 'Collapse Sidebar', 'DashboardSidebar');
  };

  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen);
    trackButtonClick(mobileOpen ? 'Close Mobile Menu' : 'Open Mobile Menu', 'DashboardSidebar');
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-24 left-4 z-30 bg-dark-gray p-2 rounded-md border border-gray-700"
      >
        <SafeIcon icon={FiMenu} className="text-tactical-red text-xl" />
      </button>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <motion.div
          className="lg:hidden fixed inset-0 bg-black/80 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      <motion.div
        className={`fixed top-0 left-0 h-full bg-dark-gray border-r border-gray-700 z-50 pt-20 transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        initial={{ x: '-100%' }}
        animate={{ x: mobileOpen || window.innerWidth >= 1024 ? 0 : '-100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
      >
        {/* Sidebar Content */}
        <div className="flex flex-col h-full">
          {/* User Profile */}
          <div className={`px-4 py-4 border-b border-gray-700 ${collapsed ? 'text-center' : ''}`}>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-tactical-red/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-tactical-red font-bold">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </span>
              </div>
              {!collapsed && (
                <div className="overflow-hidden">
                  <p className="font-semibold truncate">{user?.name || 'Agent'}</p>
                  <p className="text-sm text-gray-400 truncate">{user?.email || 'agent@example.com'}</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1">
              {navigationItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.disabled ? '#' : item.path}
                    className={`flex items-center ${
                      collapsed ? 'justify-center' : 'px-4'
                    } py-3 ${
                      location.pathname === item.path
                        ? 'bg-tactical-red/10 text-tactical-red border-l-4 border-tactical-red'
                        : 'text-gray-300 hover:bg-medium-gray hover:text-white'
                    } ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    onClick={item.disabled ? (e) => e.preventDefault() : () => handleNavClick(item.name, item.path)}
                  >
                    <SafeIcon icon={item.icon} className={collapsed ? 'text-xl' : 'text-xl mr-3'} />
                    {!collapsed && <span>{item.name}</span>}
                    {!collapsed && item.disabled && (
                      <span className="ml-auto text-xs px-2 py-1 bg-gray-700 rounded-full">Soon</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-700 p-4">
            <button
              onClick={handleLogout}
              className={`flex items-center ${
                collapsed ? 'justify-center w-full' : 'px-4 w-full'
              } py-3 text-gray-300 hover:bg-medium-gray hover:text-white rounded-lg transition-colors`}
            >
              <SafeIcon icon={FiLogOut} className={collapsed ? 'text-xl' : 'text-xl mr-3'} />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>

          {/* Collapse Button */}
          <button
            onClick={toggleCollapsed}
            className="absolute top-1/2 -right-3 bg-dark-gray border border-gray-700 rounded-full p-1 hidden lg:block"
          >
            <SafeIcon icon={collapsed ? FiChevronRight : FiChevronLeft} className="text-tactical-red" />
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default DashboardSidebar;