import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiHome, FiLayers, FiUsers, FiVideo, FiFileText, FiPhone, FiX, FiArrowRight, FiMonitor } = FiIcons;

const PagePreviewer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);

  const pages = [
    { id: 'home', name: 'Home', path: '/', icon: FiHome, 
      description: 'Landing page with hero section, problem-solution, benefits, and testimonials.' },
    { id: 'services', name: 'Services', path: '/services', icon: FiLayers,
      description: 'Overview of marketing services with pricing and features.' },
    { id: 'about', name: 'About', path: '/about', icon: FiUsers,
      description: 'Team information, company values, and mission statement.' },
    { id: 'video-marketing', name: 'Video Marketing', path: '/video-marketing', icon: FiVideo,
      description: 'Specialized video production and marketing services.' },
    { id: 'case-studies', name: 'Case Studies', path: '/case-studies', icon: FiFileText,
      description: 'Success stories and client results with metrics.' },
    { id: 'contact', name: 'Contact', path: '/contact', icon: FiPhone,
      description: 'Contact form with Netlify form integration.' },
  ];

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (isOpen) setSelectedPage(null);
  };

  const selectPage = (page) => {
    setSelectedPage(page);
  };

  return (
    <div className="fixed bottom-20 right-4 z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <button 
          onClick={toggleOpen}
          className="flex items-center justify-center p-3 bg-tactical-red rounded-full shadow-lg hover:bg-red-700 transition-colors"
        >
          <SafeIcon icon={isOpen ? FiX : FiMonitor} className="text-white text-xl" />
        </button>
      </motion.div>

      {isOpen && (
        <motion.div 
          className="absolute bottom-16 right-0 bg-dark-gray rounded-lg shadow-lg border border-tactical-red p-4 w-80 md:w-96"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-lg font-bold mb-4 text-tactical-red">Page Previewer</h3>
          
          {selectedPage ? (
            <div>
              <button 
                onClick={() => setSelectedPage(null)}
                className="text-sm text-gray-400 hover:text-white mb-3 flex items-center"
              >
                <SafeIcon icon={FiArrowRight} className="transform rotate-180 mr-1" /> Back to pages
              </button>
              
              <div className="bg-medium-gray rounded-lg p-4 mb-4">
                <div className="flex items-center mb-3">
                  <SafeIcon icon={selectedPage.icon} className="text-tactical-red text-xl mr-2" />
                  <h4 className="font-bold">{selectedPage.name}</h4>
                </div>
                <p className="text-sm text-gray-300 mb-3">{selectedPage.description}</p>
                <Link 
                  to={selectedPage.path}
                  className="btn-primary px-4 py-2 rounded-lg text-sm inline-flex items-center"
                  onClick={toggleOpen}
                >
                  Visit Page <SafeIcon icon={FiArrowRight} className="ml-1" />
                </Link>
              </div>
              
              <div className="bg-medium-gray rounded-lg p-4">
                <h5 className="font-semibold mb-2 text-sm">Page Preview</h5>
                <div className="border border-gray-600 rounded-lg overflow-hidden">
                  <div className="bg-black p-1 flex justify-between items-center">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-xs text-gray-400 truncate">{selectedPage.path}</div>
                    <div></div>
                  </div>
                  <div className="p-2 bg-gray-900 h-32 flex items-center justify-center">
                    <div className="text-center">
                      <SafeIcon icon={selectedPage.icon} className="text-tactical-red text-2xl mx-auto mb-2" />
                      <p className="text-xs text-gray-300">Preview of {selectedPage.name} page</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {pages.map(page => (
                <button
                  key={page.id}
                  className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-medium-gray transition-colors text-left"
                  onClick={() => selectPage(page)}
                >
                  <SafeIcon icon={page.icon} className="text-tactical-red" />
                  <div>
                    <div className="font-medium">{page.name}</div>
                    <div className="text-xs text-gray-400 truncate">{page.path}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default PagePreviewer;