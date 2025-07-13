import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiCheck, FiArrowRight, FiTarget } = FiIcons;

const ThankYou = () => {
  // Track conversion with all analytics platforms
  useEffect(() => {
    // CyborgCRM Conversion Tracking
    if (typeof window.CyborgCRM === 'function') {
      window.CyborgCRM('track', 'conversion', {
        event: 'purchase',
        value: 99.99,
        currency: 'USD',
        timestamp: new Date().toISOString()
      });
      console.log('✅ CyborgCRM conversion tracked');
    }

    // Google Analytics 4 Conversion
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'purchase', {
        transaction_id: `TRANS_${Date.now()}`,
        value: 99.99,
        currency: 'USD',
        items: [{
          item_id: 'marketing_service',
          item_name: 'Marketing Service Package',
          price: 99.99,
          quantity: 1
        }]
      });
      console.log('✅ GA4 conversion tracked');
    }

    // Meta Pixel Conversion
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'Purchase', {
        value: 99.99,
        currency: 'USD',
        content_type: 'product',
        content_ids: ['marketing_service']
      });
      console.log('✅ Meta Pixel conversion tracked');
    }

    // SiteBehaviour Conversion
    document.dispatchEvent(new CustomEvent('sitebehaviour-conversion', {
      detail: {
        type: 'purchase',
        value: 99.99,
        currency: 'USD',
        timestamp: new Date().toISOString()
      }
    }));
    console.log('✅ SiteBehaviour conversion tracked');
  }, []);

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-jet-black">
      <motion.div 
        className="text-center max-w-3xl mx-auto px-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="w-24 h-24 bg-tactical-red/20 rounded-full flex items-center justify-center mb-8 mx-auto">
          <SafeIcon icon={FiCheck} className="text-tactical-red text-5xl" />
        </div>

        <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
          Mission <span className="text-tactical-red">Accomplished</span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 mb-8">
          Your strategy briefing has been successfully transmitted to our command center.
          One of our elite operatives will contact you within 24 hours to begin your marketing mission.
        </p>

        <div className="bg-dark-gray p-8 rounded-lg tactical-border mb-8">
          <h3 className="text-2xl font-bold mb-6 text-tactical-red">Mission Timeline:</h3>
          <div className="space-y-4 text-left max-w-2xl mx-auto">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-tactical-red rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <div>
                <div className="font-semibold text-white">Initial Reconnaissance Call</div>
                <div className="text-gray-400 text-sm">Within 24 hours - Strategy discussion & goal alignment</div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-tactical-red rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <div>
                <div className="font-semibold text-white">Battle Plan Development</div>
                <div className="text-gray-400 text-sm">2-3 business days - Custom strategy creation & proposal</div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-tactical-red rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">3</span>
              </div>
              <div>
                <div className="font-semibold text-white">Mission Deployment</div>
                <div className="text-gray-400 text-sm">Upon approval - Campaign launch & execution begins</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-medium-gray p-6 rounded-lg tactical-border">
            <SafeIcon icon={FiTarget} className="text-tactical-red text-3xl mb-3 mx-auto" />
            <h4 className="font-bold mb-2">90-Day Guarantee</h4>
            <p className="text-gray-400 text-sm">Results or we work for free</p>
          </div>

          <div className="bg-medium-gray p-6 rounded-lg tactical-border">
            <SafeIcon icon={FiCheck} className="text-tactical-red text-3xl mb-3 mx-auto" />
            <h4 className="font-bold mb-2">Elite Team Assigned</h4>
            <p className="text-gray-400 text-sm">Dedicated marketing operatives</p>
          </div>

          <div className="bg-medium-gray p-6 rounded-lg tactical-border">
            <SafeIcon icon={FiArrowRight} className="text-tactical-red text-3xl mb-3 mx-auto" />
            <h4 className="font-bold mb-2">Fast Response</h4>
            <p className="text-gray-400 text-sm">24-hour mission activation</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/" 
            className="px-8 py-4 btn-primary rounded-lg font-semibold text-lg flex items-center justify-center space-x-2"
          >
            <span>Return to Base</span>
            <SafeIcon icon={FiArrowRight} />
          </Link>

          <Link 
            to="/case-studies" 
            className="px-8 py-4 border-2 border-tactical-red text-tactical-red rounded-lg font-semibold text-lg hover:bg-tactical-red hover:text-white transition-all duration-300"
          >
            View Success Stories
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ThankYou;