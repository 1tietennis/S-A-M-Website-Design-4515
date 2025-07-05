import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiActivity, FiCheck, FiX, FiPlay, FiRefreshCw, FiBarChart3, FiTarget, FiUsers, FiMousePointer } = FiIcons;

const SiteBehaviourController = ({ showController = false }) => {
  const [status, setStatus] = useState({
    isActive: false,
    scriptLoaded: false,
    secretConfigured: false,
    lastCheck: null
  });
  
  const [metrics, setMetrics] = useState({
    siteTraffic: false,
    engagementScore: false,
    utmCampaigns: false,
    multiPageVisits: false,
    formInteractions: false,
    linkClicks: false
  });

  const [isActivating, setIsActivating] = useState(false);

  useEffect(() => {
    if (showController) {
      checkStatus();
      const interval = setInterval(checkStatus, 5000); // Check every 5 seconds
      return () => clearInterval(interval);
    }
  }, [showController]);

  const checkStatus = () => {
    const scriptLoaded = !!document.querySelector('#site-behaviour-script-v2');
    const secretConfigured = window.sitebehaviourTrackingSecret === '507f5743-d0f0-49db-a5f0-0d702b989128';
    const isActive = scriptLoaded && secretConfigured;
    
    setStatus({
      isActive,
      scriptLoaded,
      secretConfigured,
      lastCheck: new Date().toISOString()
    });

    // Check which metrics are active based on session storage and events
    const sessionId = sessionStorage.getItem('sb_session_id');
    const pageCount = sessionStorage.getItem('sb_page_count');
    
    setMetrics({
      siteTraffic: isActive && !!sessionId,
      engagementScore: isActive && !!sessionId,
      utmCampaigns: isActive,
      multiPageVisits: isActive && !!pageCount,
      formInteractions: isActive,
      linkClicks: isActive
    });
  };

  const activateAllMetrics = async () => {
    setIsActivating(true);
    
    try {
      // Import and run the activation
      const { activateAllSiteBehaviourMetrics } = await import('../utils/siteBehaviourVerification.js');
      
      console.log('🚀 Activating all SiteBehaviour metrics...');
      activateAllSiteBehaviourMetrics();
      
      // Wait a moment then recheck status
      setTimeout(() => {
        checkStatus();
        setIsActivating(false);
      }, 3000);
      
    } catch (error) {
      console.error('Failed to activate metrics:', error);
      setIsActivating(false);
    }
  };

  const testAllMetrics = async () => {
    try {
      const { default: commands } = await import('../utils/siteBehaviourCommands.js');
      commands.testMetrics();
    } catch (error) {
      console.error('Failed to test metrics:', error);
    }
  };

  const resetAndRestart = async () => {
    try {
      const { default: commands } = await import('../utils/siteBehaviourCommands.js');
      commands.resetAndRestart();
      
      setTimeout(checkStatus, 5000);
    } catch (error) {
      console.error('Failed to reset:', error);
    }
  };

  if (!showController) return null;

  return (
    <motion.div
      className="fixed bottom-4 left-4 bg-dark-gray border border-tactical-red rounded-lg p-4 max-w-sm z-50 shadow-lg"
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-tactical-red font-bold text-sm">SiteBehaviour Control</h4>
        <SafeIcon 
          icon={status.isActive ? FiCheck : FiX} 
          className={status.isActive ? 'text-green-400' : 'text-red-400'} 
        />
      </div>

      {/* Status Indicators */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-xs">
          <span>Script Loaded:</span>
          <SafeIcon 
            icon={status.scriptLoaded ? FiCheck : FiX} 
            className={status.scriptLoaded ? 'text-green-400' : 'text-red-400'} 
          />
        </div>
        <div className="flex items-center justify-between text-xs">
          <span>Secret Configured:</span>
          <SafeIcon 
            icon={status.secretConfigured ? FiCheck : FiX} 
            className={status.secretConfigured ? 'text-green-400' : 'text-red-400'} 
          />
        </div>
      </div>

      {/* Metrics Status */}
      <div className="border-t border-gray-600 pt-3 mb-4">
        <div className="text-xs text-gray-400 mb-2">Active Metrics:</div>
        <div className="grid grid-cols-2 gap-1 text-xs">
          {[
            { key: 'siteTraffic', label: 'Traffic' },
            { key: 'engagementScore', label: 'Engagement' },
            { key: 'utmCampaigns', label: 'UTM' },
            { key: 'multiPageVisits', label: 'Multi-page' },
            { key: 'formInteractions', label: 'Forms' },
            { key: 'linkClicks', label: 'Clicks' }
          ].map(metric => (
            <div key={metric.key} className="flex items-center space-x-1">
              <SafeIcon 
                icon={metrics[metric.key] ? FiCheck : FiX} 
                className={`${metrics[metric.key] ? 'text-green-400' : 'text-gray-500'} text-xs`} 
              />
              <span className={metrics[metric.key] ? 'text-white' : 'text-gray-500'}>
                {metric.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="space-y-2">
        <button
          onClick={activateAllMetrics}
          disabled={isActivating}
          className="w-full px-3 py-2 bg-tactical-red text-white rounded text-xs hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          {isActivating ? (
            <>
              <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
              <span>Activating...</span>
            </>
          ) : (
            <>
              <SafeIcon icon={FiPlay} />
              <span>Activate All Metrics</span>
            </>
          )}
        </button>
        
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={testAllMetrics}
            className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
          >
            <SafeIcon icon={FiBarChart3} />
            <span>Test</span>
          </button>
          
          <button
            onClick={resetAndRestart}
            className="px-2 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700 transition-colors flex items-center justify-center space-x-1"
          >
            <SafeIcon icon={FiRefreshCw} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Last Check */}
      {status.lastCheck && (
        <div className="border-t border-gray-600 pt-2 mt-3">
          <div className="text-xs text-gray-400">
            Last check: {new Date(status.lastCheck).toLocaleTimeString()}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SiteBehaviourController;