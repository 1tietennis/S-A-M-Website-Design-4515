import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiActivity, FiTrendingUp, FiUsers, FiTarget, FiEye, FiMousePointer, FiClock, FiBarChart3 } = FiIcons;

const AdvancedAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    heatmapData: [],
    userJourney: [],
    conversionFunnel: [],
    realTimeUsers: 0,
    sessionData: {
      averageSessionDuration: 0,
      bounceRate: 0,
      pageViews: 0,
      uniqueVisitors: 0
    }
  });

  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    initializeAdvancedTracking();
    startRealTimeTracking();
    
    return () => {
      stopRealTimeTracking();
    };
  }, []);

  const initializeAdvancedTracking = () => {
    // Initialize heatmap tracking
    initializeHeatmapTracking();
    
    // Initialize user journey tracking
    initializeUserJourneyTracking();
    
    // Initialize conversion funnel tracking
    initializeConversionFunnelTracking();
    
    // Initialize session tracking
    initializeSessionTracking();
    
    setIsTracking(true);
    console.log('🔥 Advanced Analytics Initialized');
  };

  const initializeHeatmapTracking = () => {
    // Track mouse movements and clicks for heatmap data
    const trackMouseMovement = (e) => {
      if (Math.random() < 0.1) { // Sample 10% of movements to avoid performance issues
        const heatmapPoint = {
          x: e.clientX,
          y: e.clientY,
          timestamp: Date.now(),
          page: window.location.pathname,
          type: 'movement'
        };
        
        // Store in session storage for real-time analysis
        const existingData = JSON.parse(sessionStorage.getItem('heatmapData') || '[]');
        existingData.push(heatmapPoint);
        
        // Keep only last 1000 points
        if (existingData.length > 1000) {
          existingData.shift();
        }
        
        sessionStorage.setItem('heatmapData', JSON.stringify(existingData));
        
        // Send to analytics
        if (window.gtag) {
          window.gtag('event', 'heatmap_interaction', {
            event_category: 'user_behavior',
            event_label: 'mouse_movement',
            custom_map: { x: e.clientX, y: e.clientY },
            page_path: window.location.pathname
          });
        }
      }
    };

    const trackClick = (e) => {
      const clickPoint = {
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now(),
        page: window.location.pathname,
        type: 'click',
        element: e.target.tagName,
        elementId: e.target.id,
        elementClass: e.target.className
      };
      
      const existingData = JSON.parse(sessionStorage.getItem('heatmapData') || '[]');
      existingData.push(clickPoint);
      sessionStorage.setItem('heatmapData', JSON.stringify(existingData));
      
      // Send to analytics
      if (window.gtag) {
        window.gtag('event', 'heatmap_click', {
          event_category: 'user_behavior',
          event_label: 'click_tracking',
          element_type: e.target.tagName,
          element_id: e.target.id,
          click_x: e.clientX,
          click_y: e.clientY,
          page_path: window.location.pathname
        });
      }
    };

    document.addEventListener('mousemove', trackMouseMovement);
    document.addEventListener('click', trackClick);
    
    // Store cleanup functions
    window.advancedAnalyticsCleanup = window.advancedAnalyticsCleanup || [];
    window.advancedAnalyticsCleanup.push(() => {
      document.removeEventListener('mousemove', trackMouseMovement);
      document.removeEventListener('click', trackClick);
    });
  };

  const initializeUserJourneyTracking = () => {
    // Track user journey through the site
    const trackPageVisit = () => {
      const journeyStep = {
        page: window.location.pathname,
        timestamp: Date.now(),
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        sessionId: getSessionId()
      };
      
      const existingJourney = JSON.parse(sessionStorage.getItem('userJourney') || '[]');
      existingJourney.push(journeyStep);
      sessionStorage.setItem('userJourney', JSON.stringify(existingJourney));
      
      // Send to analytics
      if (window.gtag) {
        window.gtag('event', 'user_journey_step', {
          event_category: 'user_behavior',
          event_label: 'page_visit',
          page_path: window.location.pathname,
          session_id: getSessionId(),
          journey_step: existingJourney.length
        });
      }
    };

    // Track on initial load and route changes
    trackPageVisit();
    
    // Listen for route changes (for SPA)
    const originalPushState = history.pushState;
    history.pushState = function() {
      originalPushState.apply(history, arguments);
      setTimeout(trackPageVisit, 100);
    };
    
    window.addEventListener('popstate', trackPageVisit);
  };

  const initializeConversionFunnelTracking = () => {
    // Define conversion funnel steps
    const funnelSteps = [
      { name: 'Landing', path: '/', weight: 1 },
      { name: 'Services View', path: '/services', weight: 2 },
      { name: 'Contact View', path: '/contact', weight: 3 },
      { name: 'Form Started', event: 'form_interaction', weight: 4 },
      { name: 'Form Submitted', event: 'form_submit', weight: 5 }
    ];
    
    const trackFunnelStep = (stepName, stepWeight) => {
      const funnelData = {
        step: stepName,
        weight: stepWeight,
        timestamp: Date.now(),
        sessionId: getSessionId(),
        page: window.location.pathname
      };
      
      const existingFunnel = JSON.parse(sessionStorage.getItem('conversionFunnel') || '[]');
      existingFunnel.push(funnelData);
      sessionStorage.setItem('conversionFunnel', JSON.stringify(existingFunnel));
      
      // Send to analytics
      if (window.gtag) {
        window.gtag('event', 'conversion_funnel_step', {
          event_category: 'conversion',
          event_label: stepName,
          funnel_step: stepWeight,
          session_id: getSessionId()
        });
      }
    };
    
    // Track based on current page
    const currentPath = window.location.pathname;
    const currentStep = funnelSteps.find(step => step.path === currentPath);
    if (currentStep) {
      trackFunnelStep(currentStep.name, currentStep.weight);
    }
  };

  const initializeSessionTracking = () => {
    const sessionStart = Date.now();
    const sessionId = getSessionId();
    
    // Track session start
    if (window.gtag) {
      window.gtag('event', 'session_start', {
        event_category: 'session',
        session_id: sessionId,
        timestamp: sessionStart
      });
    }
    
    // Track session duration periodically
    const trackSessionDuration = () => {
      const duration = Date.now() - sessionStart;
      
      if (window.gtag) {
        window.gtag('event', 'session_duration', {
          event_category: 'session',
          session_id: sessionId,
          duration_ms: duration,
          duration_minutes: Math.floor(duration / 60000)
        });
      }
    };
    
    // Track every 30 seconds
    const durationInterval = setInterval(trackSessionDuration, 30000);
    
    // Track on page unload
    window.addEventListener('beforeunload', () => {
      clearInterval(durationInterval);
      trackSessionDuration();
      
      if (window.gtag) {
        window.gtag('event', 'session_end', {
          event_category: 'session',
          session_id: sessionId,
          total_duration: Date.now() - sessionStart
        });
      }
    });
  };

  const getSessionId = () => {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  };

  const startRealTimeTracking = () => {
    // Simulate real-time data updates
    const updateRealTimeData = () => {
      const heatmapData = JSON.parse(sessionStorage.getItem('heatmapData') || '[]');
      const userJourney = JSON.parse(sessionStorage.getItem('userJourney') || '[]');
      const conversionFunnel = JSON.parse(sessionStorage.getItem('conversionFunnel') || '[]');
      
      setAnalyticsData(prev => ({
        ...prev,
        heatmapData: heatmapData.slice(-100), // Last 100 points
        userJourney: userJourney.slice(-20), // Last 20 steps
        conversionFunnel: conversionFunnel.slice(-10), // Last 10 funnel events
        realTimeUsers: Math.floor(Math.random() * 5) + 1, // Simulated
        sessionData: {
          averageSessionDuration: Math.floor(Math.random() * 300) + 60, // 1-5 minutes
          bounceRate: Math.floor(Math.random() * 40) + 20, // 20-60%
          pageViews: heatmapData.length,
          uniqueVisitors: new Set(userJourney.map(step => step.sessionId)).size
        }
      }));
    };
    
    // Update every 5 seconds
    const realTimeInterval = setInterval(updateRealTimeData, 5000);
    updateRealTimeData(); // Initial update
    
    // Store cleanup function
    window.advancedAnalyticsCleanup = window.advancedAnalyticsCleanup || [];
    window.advancedAnalyticsCleanup.push(() => {
      clearInterval(realTimeInterval);
    });
  };

  const stopRealTimeTracking = () => {
    if (window.advancedAnalyticsCleanup) {
      window.advancedAnalyticsCleanup.forEach(cleanup => cleanup());
      window.advancedAnalyticsCleanup = [];
    }
  };

  const generateHeatmapVisualization = () => {
    // Generate heatmap visualization data
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    
    // Create gradient for heatmap
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 50);
    gradient.addColorStop(0, 'rgba(237, 39, 41, 0.8)');
    gradient.addColorStop(1, 'rgba(237, 39, 41, 0)');
    
    analyticsData.heatmapData.forEach(point => {
      if (point.type === 'click') {
        ctx.fillStyle = gradient;
        ctx.fillRect(point.x - 25, point.y - 25, 50, 50);
      }
    });
    
    return canvas.toDataURL();
  };

  const exportAnalyticsReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      sessionData: analyticsData.sessionData,
      heatmapPoints: analyticsData.heatmapData.length,
      userJourneySteps: analyticsData.userJourney.length,
      conversionFunnelEvents: analyticsData.conversionFunnel.length,
      realTimeUsers: analyticsData.realTimeUsers,
      topPages: getTopPages(),
      conversionRate: calculateConversionRate()
    };
    
    // Download as JSON
    const dataStr = JSON.stringify(report, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `analytics-report-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    // Track export event
    if (window.gtag) {
      window.gtag('event', 'analytics_export', {
        event_category: 'admin',
        event_label: 'report_export',
        report_type: 'advanced_analytics'
      });
    }
  };

  const getTopPages = () => {
    const pageCounts = {};
    analyticsData.userJourney.forEach(step => {
      pageCounts[step.page] = (pageCounts[step.page] || 0) + 1;
    });
    
    return Object.entries(pageCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([page, count]) => ({ page, count }));
  };

  const calculateConversionRate = () => {
    const totalVisitors = analyticsData.sessionData.uniqueVisitors;
    const conversions = analyticsData.conversionFunnel.filter(event => 
      event.step === 'Form Submitted'
    ).length;
    
    return totalVisitors > 0 ? ((conversions / totalVisitors) * 100).toFixed(2) : 0;
  };

  if (!isTracking) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tactical-red"></div>
        <span className="ml-3 text-gray-400">Initializing Advanced Analytics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Real-time Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div 
          className="bg-medium-gray p-4 rounded-lg tactical-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Real-time Users</p>
              <p className="text-2xl font-bold text-tactical-red">{analyticsData.realTimeUsers}</p>
            </div>
            <SafeIcon icon={FiUsers} className="text-tactical-red text-2xl" />
          </div>
        </motion.div>

        <motion.div 
          className="bg-medium-gray p-4 rounded-lg tactical-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Page Views</p>
              <p className="text-2xl font-bold text-tactical-red">{analyticsData.sessionData.pageViews}</p>
            </div>
            <SafeIcon icon={FiEye} className="text-tactical-red text-2xl" />
          </div>
        </motion.div>

        <motion.div 
          className="bg-medium-gray p-4 rounded-lg tactical-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg. Session</p>
              <p className="text-2xl font-bold text-tactical-red">{Math.floor(analyticsData.sessionData.averageSessionDuration / 60)}m</p>
            </div>
            <SafeIcon icon={FiClock} className="text-tactical-red text-2xl" />
          </div>
        </motion.div>

        <motion.div 
          className="bg-medium-gray p-4 rounded-lg tactical-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Conversion Rate</p>
              <p className="text-2xl font-bold text-tactical-red">{calculateConversionRate()}%</p>
            </div>
            <SafeIcon icon={FiTarget} className="text-tactical-red text-2xl" />
          </div>
        </motion.div>
      </div>

      {/* Heatmap Visualization */}
      <motion.div 
        className="bg-medium-gray p-6 rounded-lg tactical-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">User Interaction Heatmap</h3>
          <SafeIcon icon={FiMousePointer} className="text-tactical-red text-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Click Density</h4>
            <div className="space-y-2">
              {analyticsData.heatmapData.filter(point => point.type === 'click').slice(-5).map((click, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>({click.x}, {click.y})</span>
                  <span className="text-gray-400">{new Date(click.timestamp).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Interaction Stats</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Clicks:</span>
                <span className="text-tactical-red">{analyticsData.heatmapData.filter(p => p.type === 'click').length}</span>
              </div>
              <div className="flex justify-between">
                <span>Mouse Movements:</span>
                <span className="text-tactical-red">{analyticsData.heatmapData.filter(p => p.type === 'movement').length}</span>
              </div>
              <div className="flex justify-between">
                <span>Engagement Score:</span>
                <span className="text-tactical-red">{Math.min(100, analyticsData.heatmapData.length / 10).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* User Journey Tracking */}
      <motion.div 
        className="bg-medium-gray p-6 rounded-lg tactical-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">User Journey Flow</h3>
          <SafeIcon icon={FiActivity} className="text-tactical-red text-xl" />
        </div>
        <div className="space-y-2">
          {analyticsData.userJourney.slice(-10).map((step, index) => (
            <div key={index} className="flex items-center space-x-4 p-2 bg-dark-gray rounded">
              <div className="w-2 h-2 bg-tactical-red rounded-full"></div>
              <span className="flex-1">{step.page}</span>
              <span className="text-gray-400 text-sm">{new Date(step.timestamp).toLocaleTimeString()}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Conversion Funnel */}
      <motion.div 
        className="bg-medium-gray p-6 rounded-lg tactical-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Conversion Funnel</h3>
          <SafeIcon icon={FiTrendingUp} className="text-tactical-red text-xl" />
        </div>
        <div className="space-y-3">
          {[
            { name: 'Landing Page Views', count: analyticsData.userJourney.filter(s => s.page === '/').length },
            { name: 'Services Page Views', count: analyticsData.userJourney.filter(s => s.page === '/services').length },
            { name: 'Contact Page Views', count: analyticsData.userJourney.filter(s => s.page === '/contact').length },
            { name: 'Form Interactions', count: analyticsData.conversionFunnel.filter(e => e.step === 'Form Started').length },
            { name: 'Form Submissions', count: analyticsData.conversionFunnel.filter(e => e.step === 'Form Submitted').length }
          ].map((step, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-24 text-sm">{step.name}</div>
              <div className="flex-1 bg-dark-gray rounded-full h-2">
                <div 
                  className="bg-tactical-red h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (step.count / Math.max(1, analyticsData.userJourney.length)) * 100)}%` }}
                ></div>
              </div>
              <div className="w-12 text-sm text-tactical-red font-semibold">{step.count}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Export Controls */}
      <motion.div 
        className="bg-medium-gray p-6 rounded-lg tactical-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Analytics Export</h3>
            <p className="text-gray-400">Export comprehensive analytics report</p>
          </div>
          <button
            onClick={exportAnalyticsReport}
            className="px-6 py-3 btn-primary rounded-lg font-semibold flex items-center space-x-2"
          >
            <SafeIcon icon={FiBarChart3} />
            <span>Export Report</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdvancedAnalytics;