import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiCheck, FiX, FiActivity, FiCode, FiEye, FiTarget } = FiIcons;

const AnalyticsDebugger = ({ showDebugger = false }) => {
  const [analyticsStatus, setAnalyticsStatus] = useState({
    siteBehaviour: false,
    siteBehaviourSecret: false,
    siteBehaviourScript: false,
    firebaseAnalytics: false,
    cyborgCRM: false,
    events: 0
  });

  const [debugLogs, setDebugLogs] = useState([]);

  useEffect(() => {
    if (!showDebugger) return;

    const checkAnalytics = () => {
      const status = {
        siteBehaviour: typeof window.siteBehaviour !== 'undefined',
        siteBehaviourSecret: window.sitebehaviourTrackingSecret === '507f5743-d0f0-49db-a5f0-0d702b989128',
        siteBehaviourScript: !!document.querySelector('#site-behaviour-script-v2'),
        firebaseAnalytics: !!window.firebaseAnalytics,
        cyborgCRM: typeof window.CyborgCRM === 'function',
        events: window.siteBehaviour ? 1 : 0
      };

      setAnalyticsStatus(status);

      // Log status
      const siteBehaviourOperational = status.siteBehaviour && status.siteBehaviourSecret && status.siteBehaviourScript;
      const log = `[${new Date().toLocaleTimeString()}] SiteBehaviour: ${siteBehaviourOperational ? 'FULLY OPERATIONAL' : 'ISSUES DETECTED'}`;
      setDebugLogs(prev => [...prev.slice(-4), log]);
    };

    // Initial check
    checkAnalytics();

    // Check every 5 seconds
    const interval = setInterval(checkAnalytics, 5000);

    // Override console.log to catch SiteBehaviour logs
    const originalLog = console.log;
    console.log = (...args) => {
      originalLog.apply(console, args);
      const message = args.join(' ');
      
      if (message.includes('SiteBehaviour') || message.includes('sitebehaviour') || message.includes('507f5743')) {
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
    // Fire SiteBehaviour test event
    document.dispatchEvent(new CustomEvent('sitebehaviour-debug-test', {
      detail: {
        test: 'manual_debug_test',
        timestamp: new Date().toISOString(),
        value: 1
      }
    }));

    const log = `[${new Date().toLocaleTimeString()}] SiteBehaviour test event fired`;
    setDebugLogs(prev => [...prev.slice(-9), log]);
  };

  const runFullTest = () => {
    if (window.logAnalyticsStatus) {
      window.logAnalyticsStatus();
      const log = `[${new Date().toLocaleTimeString()}] Full SiteBehaviour test completed`;
      setDebugLogs(prev => [...prev.slice(-9), log]);
    }
  };

  const checkConnection = () => {
    if (window.checkSiteBehaviourConnection) {
      const isConnected = window.checkSiteBehaviourConnection();
      const log = `[${new Date().toLocaleTimeString()}] Connection check: ${isConnected ? 'CONNECTED' : 'ISSUES'}`;
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
        <h4 className="text-tactical-red font-bold text-sm">SiteBehaviour Debug Panel</h4>
        <SafeIcon icon={FiActivity} className="text-tactical-red" />
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between text-xs">
          <span>SiteBehaviour API:</span>
          <SafeIcon 
            icon={analyticsStatus.siteBehaviour ? FiCheck : FiX} 
            className={analyticsStatus.siteBehaviour ? 'text-green-400' : 'text-red-400'} 
          />
        </div>
        <div className="flex items-center justify-between text-xs">
          <span>Secret Key:</span>
          <SafeIcon 
            icon={analyticsStatus.siteBehaviourSecret ? FiCheck : FiX} 
            className={analyticsStatus.siteBehaviourSecret ? 'text-green-400' : 'text-red-400'} 
          />
        </div>
        <div className="flex items-center justify-between text-xs">
          <span>Script Loaded:</span>
          <SafeIcon 
            icon={analyticsStatus.siteBehaviourScript ? FiCheck : FiX} 
            className={analyticsStatus.siteBehaviourScript ? 'text-green-400' : 'text-red-400'} 
          />
        </div>
        <div className="flex items-center justify-between text-xs">
          <span>Firebase:</span>
          <SafeIcon 
            icon={analyticsStatus.firebaseAnalytics ? FiCheck : FiX} 
            className={analyticsStatus.firebaseAnalytics ? 'text-green-400' : 'text-red-400'} 
          />
        </div>
        <div className="flex items-center justify-between text-xs">
          <span>CyborgCRM:</span>
          <SafeIcon 
            icon={analyticsStatus.cyborgCRM ? FiCheck : FiX} 
            className={analyticsStatus.cyborgCRM ? 'text-green-400' : 'text-red-400'} 
          />
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <button
          onClick={fireTestEvent}
          className="w-full px-3 py-1 bg-tactical-red text-white rounded text-xs hover:bg-red-700 transition-colors"
        >
          Fire SiteBehaviour Test
        </button>
        <div className="grid grid-cols-2 gap-1">
          <button
            onClick={runFullTest}
            className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
          >
            Full Test
          </button>
          <button
            onClick={checkConnection}
            className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors"
          >
            Check Connection
          </button>
        </div>
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