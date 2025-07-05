import React from 'react';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiTarget, FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiLinkedin, FiInstagram } = FiIcons;

const Footer = () => {
  return (
    <footer className="bg-dark-gray border-t border-tactical-red/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <SafeIcon icon={FiTarget} className="text-tactical-red text-2xl" />
              <span className="text-xl font-display font-bold gradient-text">
                Secret Agent Digital Marketing
              </span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Elite digital marketing strategies for businesses ready to dominate their market. We deliver stealth-level tactics with transparent results.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-tactical-red transition-colors">
                <SafeIcon icon={FiFacebook} className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-tactical-red transition-colors">
                <SafeIcon icon={FiTwitter} className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-tactical-red transition-colors">
                <SafeIcon icon={FiLinkedin} className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-tactical-red transition-colors">
                <SafeIcon icon={FiInstagram} className="text-xl" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/services" className="text-gray-400 hover:text-tactical-red transition-colors">Services</Link></li>
              <li><Link to="/video-marketing" className="text-gray-400 hover:text-tactical-red transition-colors">Video Marketing</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-tactical-red transition-colors">About Us</Link></li>
              <li><Link to="/case-studies" className="text-gray-400 hover:text-tactical-red transition-colors">Case Studies</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-tactical-red transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiMail} className="text-tactical-red" />
                <span className="text-gray-400">info@secretagentdigital.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiPhone} className="text-tactical-red" />
                <span className="text-gray-400">301-205-5131</span>
              </div>
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiMapPin} className="text-tactical-red" />
                <span className="text-gray-400">Classified Location</span>
              </div>
            </div>
          </div>
        </div>

        <div className="section-divider"></div>

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Secret Agent Digital Marketing. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-tactical-red text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-tactical-red text-sm transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;