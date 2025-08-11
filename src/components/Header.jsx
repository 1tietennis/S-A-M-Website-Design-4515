import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { trackPageView, trackButtonClick } from '../utils/analytics';
import { useAuth } from '../context/AuthContext';

const { FiMenu, FiX, FiTarget, FiUsers, FiHome } = FiIcons;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track page views when location changes
  useEffect(() => {
    // Track with all analytics platforms
    trackPageView(location.pathname, document.title);

    // Track specifically with Google Analytics 4 (G-CTDQQ8XMKC only)
    if (typeof window.gtag === 'function') {
      window.gtag('config', 'G-CTDQQ8XMKC', {
        page_path: location.pathname,
        page_title: document.title,
        page_location: window.location.href
      });
    }
  }, [location]);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Video Marketing', path: '/video-marketing' },
    { name: 'Drone Services', path: '/drone-services' },
    { name: 'About', path: '/about' },
    { name: 'Case Studies', path: '/case-studies' },
    { name: 'Contact', path: '/contact' },
  ];

  // Admin navigation items
  const adminItems = [
    { name: 'Dashboard', path: '/dashboard', icon: FiHome },
    { name: 'Contacts', path: '/contact-manager', icon: FiUsers },
  ];

  const handleNavClick = (itemName, path) => {
    trackButtonClick(`Navigation: ${itemName}`, 'Header');

    // Track with Google Analytics 4 (G-CTDQQ8XMKC only)
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'navigation_click', {
        event_category: 'engagement',
        event_label: itemName,
        page_path: path
      });
    }
  };

  const handleCtaClick = () => {
    trackButtonClick('Start Your Mission', 'Header CTA');

    // Track with Google Analytics 4 (G-CTDQQ8XMKC only)
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'cta_click', {
        event_category: 'engagement',
        event_label: 'Start Your Mission',
        button_location: 'Header'
      });
    }
  };

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-jet-black/95 backdrop-blur-md border-b border-tactical-red/20' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center space-x-2"
            onClick={() => handleNavClick('Logo', '/')}
          >
            <SafeIcon icon={FiTarget} className="text-tactical-red text-2xl" />
            <span className="text-xl font-display font-bold gradient-text">
              Secret Agent Digital Marketing
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative py-2 transition-colors duration-300 ${
                  location.pathname === item.path ? 'text-tactical-red' : 'text-white hover:text-tactical-red'
                }`}
                onClick={() => handleNavClick(item.name, item.path)}
              >
                {item.name}
                {location.pathname === item.path && (
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-tactical-red" 
                    layoutId="activeNav"
                  />
                )}
              </Link>
            ))}

            {/* Show admin nav items if authenticated */}
            {isAuthenticated && adminItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative py-2 transition-colors duration-300 ${
                  location.pathname === item.path ? 'text-tactical-red' : 'text-white hover:text-tactical-red'
                }`}
                onClick={() => handleNavClick(item.name, item.path)}
              >
                {item.name === 'Contacts' ? (
                  <div className="flex items-center">
                    <SafeIcon icon={item.icon} className="mr-1" />
                    <span>Contacts</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <SafeIcon icon={item.icon} className="mr-1" />
                    <span>{item.name}</span>
                  </div>
                )}
                {location.pathname === item.path && (
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-tactical-red" 
                    layoutId="activeNavAdmin"
                  />
                )}
              </Link>
            ))}
          </nav>

          <Link 
            to="/contact" 
            className="hidden md:block px-6 py-2 btn-primary rounded-lg font-semibold"
            onClick={handleCtaClick}
          >
            Start Your Mission
          </Link>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white"
          >
            <SafeIcon icon={isMenuOpen ? FiX : FiMenu} className="text-2xl" />
          </button>
        </div>

        {isMenuOpen && (
          <motion.div 
            className="md:hidden mt-4 py-4 border-t border-tactical-red/20"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block py-2 transition-colors duration-300 ${
                  location.pathname === item.path ? 'text-tactical-red' : 'text-white hover:text-tactical-red'
                }`}
                onClick={() => {
                  handleNavClick(item.name, item.path);
                  setIsMenuOpen(false);
                }}
              >
                {item.name}
              </Link>
            ))}

            {/* Show admin nav items in mobile menu if authenticated */}
            {isAuthenticated && (
              <>
                <div className="border-t border-gray-700 my-2"></div>
                {adminItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`block py-2 transition-colors duration-300 ${
                      location.pathname === item.path ? 'text-tactical-red' : 'text-white hover:text-tactical-red'
                    }`}
                    onClick={() => {
                      handleNavClick(item.name, item.path);
                      setIsMenuOpen(false);
                    }}
                  >
                    <div className="flex items-center">
                      <SafeIcon icon={item.icon} className="mr-1" />
                      <span>{item.name}</span>
                    </div>
                  </Link>
                ))}
              </>
            )}

            <Link 
              to="/contact" 
              className="block mt-4 px-6 py-2 btn-primary rounded-lg font-semibold text-center"
              onClick={() => {
                handleCtaClick();
                setIsMenuOpen(false);
              }}
            >
              Start Your Mission
            </Link>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;