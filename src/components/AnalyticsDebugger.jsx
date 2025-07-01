import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiCheck, FiX, FiActivity, FiCode, FiEye, FiTarget } = FiIcons;

const AnalyticsDebugger = ({ showDebugger = false }) => {
  const [analyticsStatus, setAnalyticsStatus] = useState({
    ga4: false,
    dataLayer: false,
    script: false,
    siteBehaviour: false,
    events: 0
  });

  const [debugLogs, setDebugLogs] = useState([]);

  useEffect(() => {
    if (!showDebugger) return;

    const checkAnalytics = () => {
      const status = {
        ga4: typeof window.gtag === 'function',
        dataLayer: window.dataLayer && Array.isArray(window.dataLayer),
        script: !!document.querySelector('script[src*="googletagmanager.com/gtag/js"]'),
        siteBehaviour: !!document.querySelector('#site-behaviour-script-v2') && !!window.sitebehaviourTrackingSecret,
        events: window.dataLayer ? window.dataLayer.length : 0
      };

      setAnalyticsStatus(status);

      // Log status
      const log = `[${new Date().toLocaleTimeString()}] Analytics Check: ${
        Object.entries(status).every(([key, value]) => key === 'events' || value === true) ? 'ALL OPERATIONAL' : 'ISSUES DETECTED'
      }`;
      
      setDebugLogs(prev => [...prev.slice(-4), log]);
    };

    // Initial check
    checkAnalytics();

    // Check every 5 seconds
    const interval = setInterval(checkAnalytics, 5000);

    // Override console.log to catch analytics logs
    const originalLog = console.log;
    console.log = (...args) => {
      originalLog.apply(console, args);
      
      const message = args.join(' ');
      if (message.includes('GA4') || message.includes('gtag') || message.includes('SiteBehaviour') || message.includes('G-CTDQQ8XMKC')) {
        const log = `[${new Date().toLocaleTimeString()}] ${message}`;
        setDebugLogs(prev => [...prev.slice(-9), log]);
      }
    };

    return () => {
      clearInterval(interval);
      console.log = originalLog;
    };
  }, [showDebugger]);

  const fireTestEvent = () => {
    if (window.gtag) {
      window.gtag('event', 'debug_test', {
        event_category: 'debugging',
        event_label: 'manual_test',
        value: 1,
        timestamp: new Date().toISOString()
      });
      
      const log = `[${new Date().toLocaleTimeString()}] GA4 Test event fired`;
      setDebugLogs(prev => [...prev.slice(-9), log]);
    }
  };

  const runFullTest = () => {
    if (window.logAnalyticsStatus) {
      window.logAnalyticsStatus();
      const log = `[${new Date().toLocaleTimeString()}] Full analytics test completed`;
      setDebugLogs(prev => [...prev.slice(-9), log]);
    }
  };

  if (!showDebugger) return null;

  return (
    <motion.div 
      className="fixed bottom-4 right-4 bg-dark-gray border border-tactical-red rounded-lg p-4 max-w-sm z-50 shadow-lg"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-tactical-red font-bold text-sm">Analytics Debug Panel</h4>
        <SafeIcon icon={FiActivity} className="text-tactical-red" />
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between text-xs">
          <span>GA4 Function:</span>
          <SafeIcon icon={analyticsStatus.ga4 ? FiCheck : FiX} 
                   className={analyticsStatus.ga4 ? 'text-green-400' : 'text-red-400'} />
        </div>
        <div className="flex items-center justify-between text-xs">
          <span>DataLayer:</span>
          <SafeIcon icon={analyticsStatus.dataLayer ? FiCheck : FiX} 
                   className={analyticsStatus.dataLayer ? 'text-green-400' : 'text-red-400'} />
        </div>
        <div className="flex items-center justify-between text-xs">
          <span>GA4 Script:</span>
          <SafeIcon icon={analyticsStatus.script ? FiCheck : FiX} 
                   className={analyticsStatus.script ? 'text-green-400' : 'text-red-400'} />
        </div>
        <div className="flex items-center justify-between text-xs">
          <span>SiteBehaviour:</span>
          <SafeIcon icon={analyticsStatus.siteBehaviour ? FiCheck : FiX} 
                   className={analyticsStatus.siteBehaviour ? 'text-green-400' : 'text-red-400'} />
        </div>
        <div className="flex items-center justify-between text-xs">
          <span>Events:</span>
          <span className="text-tactical-red font-mono">{analyticsStatus.events}</span>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <button 
          onClick={fireTestEvent}
          className="w-full px-3 py-1 bg-tactical-red text-white rounded text-xs hover:bg-red-700 transition-colors"
        >
          Fire GA4 Test Event
        </button>
        <button 
          onClick={runFullTest}
          className="w-full px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
        >
          Run Full Test
        </button>
      </div>

      <div className="border-t border-gray-600 pt-2">
        <div className="text-xs text-gray-400 mb-1">Recent Logs:</div>
        <div className="space-y-1 max-h-20 overflow-y-auto">
          {debugLogs.map((log, index) => (
            <div key={index} className="text-xs text-gray-300 font-mono break-words">
              {log}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsDebugger;