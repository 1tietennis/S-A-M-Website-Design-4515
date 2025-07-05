import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import CaseStudies from './pages/CaseStudies';
import Contact from './pages/Contact';
import VideoMarketing from './pages/VideoMarketing';
import AnalyticsDebugger from './components/AnalyticsDebugger';
import SiteBehaviourController from './components/SiteBehaviourController';
import { initializePageTracking, trackSPANavigation } from './utils/analytics';
import { trackPageLoadComplete } from './utils/analyticsVerification';
import './App.css';

// Component to handle route changes and analytics
function AnalyticsWrapper({ children }) {
  const location = useLocation();
  const [previousPath, setPreviousPath] = React.useState(location.pathname);

  useEffect(() => {
    // Track route changes for SPA navigation
    if (previousPath !== location.pathname) {
      const pageTitle = document.title;
      trackSPANavigation(previousPath, location.pathname, pageTitle);
      setPreviousPath(location.pathname);
    }
  }, [location, previousPath]);

  return children;
}

function App() {
  useEffect(() => {
    // Initialize page tracking when app loads
    initializePageTracking();

    // Track initial app load
    if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
      window.gtag('event', 'app_loaded', {
        event_category: 'app_lifecycle',
        timestamp: new Date().toISOString()
      });
    }

    // Run comprehensive analytics verification
    trackPageLoadComplete('App');

    // Initialize SiteBehaviour commands and real-time monitoring
    Promise.all([
      import('./utils/siteBehaviourCommands.js'),
      import('./utils/siteBehaviourRealTimeMonitor.js')
    ]).then(([commands, monitor]) => {
      console.log('🎯 SiteBehaviour systems loaded');
      
      // Auto-start real-time monitoring
      if (monitor.default && monitor.default.initializeRealTimeMonitoring) {
        monitor.default.initializeRealTimeMonitoring();
      }
    });

    console.log('🚀 Secret Agent Digital Marketing App Loaded with Real-Time Analytics');
  }, []);

  // Show debugger in development or with debug parameter
  const showDebugger = process.env.NODE_ENV === 'development' || window.location.search.includes('debug=true');
  
  // Show SiteBehaviour controller with sitebehaviour parameter
  const showSiteBehaviour = window.location.search.includes('sitebehaviour=true') || process.env.NODE_ENV === 'development';

  return (
    <Router>
      <div className="min-h-screen bg-jet-black text-white">
        <AnalyticsWrapper>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/video-marketing" element={<VideoMarketing />} />
              <Route path="/about" element={<About />} />
              <Route path="/case-studies" element={<CaseStudies />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          <Footer />
        </AnalyticsWrapper>

        {/* Analytics Debugger - shows when debug=true in URL or in development */}
        <AnalyticsDebugger showDebugger={showDebugger} />

        {/* SiteBehaviour Controller - shows when sitebehaviour=true in URL or in development */}
        <SiteBehaviourController showController={showSiteBehaviour} />
      </div>
    </Router>
  );
}

export default App;