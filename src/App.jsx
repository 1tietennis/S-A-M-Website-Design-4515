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
import { initializePageTracking, trackSPANavigation } from './utils/analytics';
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
    
    console.log('🚀 Secret Agent Digital Marketing App Loaded with Analytics');
  }, []);

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
      </div>
    </Router>
  );
}

export default App;