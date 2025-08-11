import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { trackButtonClick } from '../utils/analytics';

const {
  FiTarget,
  FiZap,
  FiShield,
  FiTrendingUp,
  FiDollarSign,
  FiUsers,
  FiLock,
  FiUnlock,
  FiArrowRight
} = FiIcons;

const MarketingStrategy = () => {
  const [accessLevel, setAccessLevel] = useState('basic'); // 'basic' or 'pro'

  const upgradeAccess = () => {
    trackButtonClick('Upgrade to Pro Access', 'Marketing Strategy');
    setAccessLevel('pro');
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold mb-4">
          Self-Marketing <span className="text-tactical-red">System™</span>
        </h2>
        <p className="text-gray-300">
          A revenue machine that pays for itself before you've finished onboarding. Deploy our proprietary system for consistent, predictable results.
        </p>
      </div>

      {/* Access Level Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Free Intel Briefing */}
        <motion.div
          className={`bg-medium-gray p-6 rounded-lg ${accessLevel === 'basic' ? 'tactical-border' : 'border border-gray-700'}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold">Free Intel Briefing</h3>
            <div className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-sm">
              Basic Access
            </div>
          </div>
          
          <p className="text-gray-300 mb-6">
            Your first taste of classified intelligence. Get basic insights into your marketing performance.
          </p>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiUnlock} className="text-green-400" />
              <span>Mission Briefing (3-step onboarding)</span>
            </div>
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiUnlock} className="text-green-400" />
              <span>Basic traffic trends & lead volume</span>
            </div>
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiUnlock} className="text-green-400" />
              <span>Campaign health "status light"</span>
            </div>
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiLock} className="text-gray-500" />
              <span className="text-gray-500">Advanced analytics (Pro only)</span>
            </div>
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiLock} className="text-gray-500" />
              <span className="text-gray-500">Competitor surveillance intel (Pro only)</span>
            </div>
          </div>
          
          <div className="text-center">
            <button
              className={`w-full px-6 py-3 rounded-lg font-semibold ${
                accessLevel === 'basic' 
                  ? 'bg-gray-600 text-white cursor-default' 
                  : 'border-2 border-tactical-red text-tactical-red hover:bg-tactical-red hover:text-white transition-all'
              }`}
              disabled={accessLevel === 'basic'}
            >
              Current Level
            </button>
          </div>
        </motion.div>

        {/* Full Tactical Control */}
        <motion.div
          className={`bg-medium-gray p-6 rounded-lg ${accessLevel === 'pro' ? 'tactical-border' : 'border border-gray-700'}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold">Full Tactical Control</h3>
            <div className="px-3 py-1 bg-tactical-red/20 text-tactical-red rounded text-sm">
              Pro Access
            </div>
          </div>
          
          <p className="text-gray-300 mb-6">
            Complete access to the agency's inner vault. Unlock our proprietary marketing system.
          </p>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiUnlock} className="text-green-400" />
              <span>Live campaign performance reports</span>
            </div>
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiUnlock} className="text-green-400" />
              <span>Competitor surveillance intel</span>
            </div>
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiUnlock} className="text-green-400" />
              <span>Lead tracking & CRM integration</span>
            </div>
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiUnlock} className="text-green-400" />
              <span>ROI calculations & optimization directives</span>
            </div>
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiUnlock} className="text-green-400" />
              <span>Self-Marketing System™ performance engine</span>
            </div>
          </div>
          
          <div className="text-center">
            {accessLevel === 'pro' ? (
              <button className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold cursor-default">
                Current Level
              </button>
            ) : (
              <button
                className="w-full px-6 py-3 btn-primary rounded-lg font-semibold animate-pulse-red"
                onClick={upgradeAccess}
              >
                Upgrade to Pro
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* System Overview */}
      <motion.div
        className="bg-medium-gray p-6 rounded-lg tactical-border mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <h3 className="text-xl font-bold mb-4">The Self-Marketing System™ Overview</h3>
        
        <p className="text-gray-300 mb-6">
          "We don't just create campaigns — we deploy a self-sustaining, profit-driven marketing engine that keeps producing sales and promoting itself, month after month. And we tie our compensation directly to your results — so we only win when you win."
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-dark-gray p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-tactical-red/20 rounded-full flex items-center justify-center">
                <span className="text-tactical-red font-bold">1</span>
              </div>
              <h4 className="font-bold">Intelligence Gathering</h4>
            </div>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Deep-dive market analysis</li>
              <li>• Competitor targeting blueprint</li>
              <li>• Conversion gap assessment</li>
            </ul>
          </div>
          
          <div className="bg-dark-gray p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-tactical-red/20 rounded-full flex items-center justify-center">
                <span className="text-tactical-red font-bold">2</span>
              </div>
              <h4 className="font-bold">Strategy Formation</h4>
            </div>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Target audience profiling</li>
              <li>• Messaging and hook development</li>
              <li>• Offer positioning for maximum pull</li>
            </ul>
          </div>
          
          <div className="bg-dark-gray p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-tactical-red/20 rounded-full flex items-center justify-center">
                <span className="text-tactical-red font-bold">3</span>
              </div>
              <h4 className="font-bold">Mission Parameters</h4>
            </div>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Budget + ROI thresholds set</li>
              <li>• Launch calendar created</li>
              <li>• Success metrics locked in</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Pricing Model */}
      <motion.div
        className="bg-medium-gray p-6 rounded-lg tactical-border mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h3 className="text-xl font-bold mb-4">Performance-Tied Pricing Model</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-dark-gray p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <SafeIcon icon={FiTarget} className="text-tactical-red" />
              <h4 className="font-bold">Core Activation Fee</h4>
            </div>
            <p className="text-sm text-gray-300 mb-3">
              One-time investment for strategy + setup: $1,500 – $3,500 depending on scope.
            </p>
            <p className="text-sm text-gray-300">
              Covers all upfront research, strategy building, creative assets, and system deployment.
            </p>
          </div>
          
          <div className="bg-dark-gray p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <SafeIcon icon={FiTrendingUp} className="text-tactical-red" />
              <h4 className="font-bold">Performance Accelerator</h4>
            </div>
            <p className="text-sm text-gray-300 mb-3">
              10–20% of net revenue generated in first 90 days from campaigns we manage.
            </p>
            <p className="text-sm text-gray-300">
              Paid monthly based on tracked conversions (integrated reporting dashboard provided).
            </p>
          </div>
          
          <div className="bg-dark-gray p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <SafeIcon icon={FiZap} className="text-tactical-red" />
              <h4 className="font-bold">Optimization Subscription</h4>
            </div>
            <p className="text-sm text-gray-300 mb-3">
              Monthly retainer for campaign scaling, optimization, and content deployment.
            </p>
            <p className="text-sm text-gray-300">
              Up to $50k/mo revenue: $1,000–$1,500/month<br />
              $50k–$150k/mo: $2,500–$5,000/month
            </p>
          </div>
        </div>
      </motion.div>

      {/* Benefits */}
      <motion.div
        className="bg-medium-gray p-6 rounded-lg tactical-border mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <h3 className="text-xl font-bold mb-4">Why The Self-Marketing System™ Works</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center p-4">
            <SafeIcon icon={FiZap} className="text-tactical-red text-3xl mb-3" />
            <h4 className="font-bold mb-2 text-center">Instant Setup</h4>
            <p className="text-sm text-gray-300 text-center">
              We get your first revenue-focused campaign live in minutes, not weeks.
            </p>
          </div>
          
          <div className="flex flex-col items-center p-4">
            <SafeIcon icon={FiShield} className="text-tactical-red text-3xl mb-3" />
            <h4 className="font-bold mb-2 text-center">Data-Driven Decisions</h4>
            <p className="text-sm text-gray-300 text-center">
              Every move we make is based on live metrics, not guesswork.
            </p>
          </div>
          
          <div className="flex flex-col items-center p-4">
            <SafeIcon icon={FiTarget} className="text-tactical-red text-3xl mb-3" />
            <h4 className="font-bold mb-2 text-center">Battle-Tested Strategies</h4>
            <p className="text-sm text-gray-300 text-center">
              We deploy tactics used by top direct-response marketers for consistent results.
            </p>
          </div>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        className="bg-gradient-to-r from-tactical-red to-tactical-red/70 p-6 rounded-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold mb-2 text-white">Ready to Deploy Your Marketing Arsenal?</h3>
            <p className="text-white/90">
              Schedule a strategy call to see how the Self-Marketing System™ can work for your business.
            </p>
          </div>
          <button
            onClick={() => trackButtonClick('Schedule Strategy Call', 'Marketing Strategy CTA')}
            className="px-6 py-3 bg-white text-tactical-red rounded-lg font-semibold flex items-center space-x-2 hover:bg-gray-100 transition-all"
          >
            <span>Schedule Strategy Call</span>
            <SafeIcon icon={FiArrowRight} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default MarketingStrategy;