import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import CaseStudies from './pages/CaseStudies';
import Contact from './pages/Contact';
import VideoMarketing from './pages/VideoMarketing';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import ContactManager from './pages/ContactManager';
import ThankYou from './components/ThankYou';
import ProtectedRoute from './components/ProtectedRoute';
import AnalyticsDebugger from './components/AnalyticsDebugger';
import SiteBehaviourController from './components/SiteBehaviourController';
import NetlifyFormTest from './components/NetlifyFormTest';
import PagePreviewer from './components/PagePreviewer';
import { trackEnhancedEvent } from './utils/analyticsEnhanced';
import { trackPageLoadComplete } from './utils/analyticsVerification';
import TrackingTroubleshooter from './utils/trackingTroubleshooter';
import './App.css';

// Component to handle route changes and enhanced analytics
function AnalyticsWrapper({ children }) {
  const location = useLocation();
  const [previousPath, setPreviousPath] = React.useState(location.pathname);

  useEffect(() => {
    // Track route changes for SPA navigation with enhanced analytics
    if (previousPath !== location.pathname) {
      const pageTitle = document.title;
      
      // Track with Google Analytics 4
      if (typeof window.gtag === 'function') {
        window.gtag('config', 'G-CTDQQ8XMKC', {
          page_title: pageTitle,
          page_path: location.pathname,
          page_location: window.location.href
        });
        console.log('📊 Page view tracked with GA4:', location.pathname);
      }

      // Track with CyborgCRM Advanced
      if (typeof window.CyborgCRM === 'function') {
        CyborgCRM('track', 'pageview', {
          page_title: pageTitle,
          page_url: window.location.href,
          referrer: document.referrer,
          previous_page: previousPath
        });
      }
      
      // Track with Meta Pixel (Facebook Pixel)
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'PageView', {
          page_title: pageTitle,
          page_path: location.pathname
        });
      }
      
      setPreviousPath(location.pathname);
    }
  }, [location, previousPath]);

  return children;
}

function App() {
  useEffect(() => {
    // Initialize tracking troubleshooter
    TrackingTroubleshooter.initialize();

    // Track initial app load across all platforms
    if (typeof window !== 'undefined') {
      // Google Analytics 4
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'app_loaded', {
          event_category: 'app_lifecycle',
          timestamp: new Date().toISOString()
        });
        console.log('✅ Google Analytics 4 app_loaded event sent');
      }

      // Meta Pixel (Facebook Pixel)
      if (typeof window.fbq === 'function') {
        window.fbq('trackCustom', 'AppLoaded', {
          app_name: 'Secret Agent Digital Marketing',
          load_time: Date.now(),
          user_agent: navigator.userAgent.substring(0, 100)
        });
      }

      // CyborgCRM Advanced
      if (typeof window.CyborgCRM === 'function') {
        CyborgCRM('track', 'app_loaded', {
          app_name: 'Secret Agent Digital Marketing',
          load_time: Date.now(),
          timestamp: new Date().toISOString(),
          tracking_type: 'advanced'
        });
        console.log('✅ CyborgCRM Advanced app_loaded event sent');
      }

      // Initialize Visitor Tracking if available
      if (typeof window.init_tracer === 'function') {
        try {
          window.init_tracer();
          console.log('✅ Visitor Tracking initialized from App.jsx');
        } catch (error) {
          console.error('❌ Error initializing Visitor Tracking:', error);
        }
      }
    }

    // Run comprehensive analytics verification
    setTimeout(() => {
      trackPageLoadComplete('App');
      
      // Run initial tracking diagnostic
      console.log('🔧 Running initial tracking diagnostic...');
      TrackingTroubleshooter.testAllPlatforms();
      
      // Test CyborgCRM Advanced specifically
      if (typeof window.verifyCyborgCRMAdvanced === 'function') {
        window.verifyCyborgCRMAdvanced();
      }
      
      // Test Google Analytics specifically
      if (typeof window.gtag === 'function') {
        console.log('✅ Google Analytics (gtag) is available in App component');
        window.gtag('event', 'app_component_loaded', {
          event_category: 'app_lifecycle',
          event_label: 'react_app_init',
          timestamp: new Date().toISOString()
        });
        console.log('✅ Test event sent to Google Analytics from App component');
      } else {
        console.error('❌ Google Analytics (gtag) is NOT available in App component');
        
        // Attempt to load Google Analytics dynamically if not available
        const gaScript = document.createElement('script');
        gaScript.async = true;
        gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-CTDQQ8XMKC';
        
        const inlineScript = document.createElement('script');
        inlineScript.textContent = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-CTDQQ8XMKC');
          console.log('🔄 Google Analytics loaded dynamically in App component');
        `;
        
        document.head.appendChild(gaScript);
        document.head.appendChild(inlineScript);
      }
    }, 2000);

    console.log('🚀 Secret Agent Digital Marketing App Loaded with Google Analytics 4 + Enhanced Analytics');
  }, []);

  // Show debugger in development or with debug parameter
  const showDebugger = process.env.NODE_ENV === 'development' || (typeof window !== 'undefined' && window.location.search.includes('debug=true'));

  // Show SiteBehaviour controller with sitebehaviour parameter
  const showSiteBehaviour = (typeof window !== 'undefined' && window.location.search.includes('sitebehaviour=true')) || process.env.NODE_ENV === 'development';

  // Show Netlify form tester in development or with form-test parameter
  const showFormTester = process.env.NODE_ENV === 'development' || (typeof window !== 'undefined' && window.location.search.includes('form-test=true'));

  // Show page previewer always
  const showPagePreviewer = true;

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-jet-black text-white">
          <AnalyticsWrapper>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/thank-you" element={<ThankYou />} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute requireOnboarding={true}>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/contact-manager" element={
                <ProtectedRoute requireOnboarding={true}>
                  <ContactManager />
                </ProtectedRoute>
              } />

              {/* Main Site Routes */}
              <Route path="/" element={<>
                <Header />
                <main><Home /></main>
                <Footer />
              </>} />
              <Route path="/services" element={<>
                <Header />
                <main><Services /></main>
                <Footer />
              </>} />
              <Route path="/video-marketing" element={<>
                <Header />
                <main><VideoMarketing /></main>
                <Footer />
              </>} />
              <Route path="/about" element={<>
                <Header />
                <main><About /></main>
                <Footer />
              </>} />
              <Route path="/case-studies" element={<>
                <Header />
                <main><CaseStudies /></main>
                <Footer />
              </>} />
              <Route path="/contact" element={<>
                <Header />
                <main><Contact /></main>
                <Footer />
              </>} />
            </Routes>
          </AnalyticsWrapper>

          {/* Analytics Debugger - shows when debug=true in URL or in development */}
          <AnalyticsDebugger showDebugger={showDebugger} />

          {/* SiteBehaviour Controller - shows when sitebehaviour=true in URL or in development */}
          <SiteBehaviourController showController={showSiteBehaviour} />

          {/* Netlify Form Tester - shows when form-test=true in URL or in development */}
          {showFormTester && <NetlifyFormTest />}

          {/* Page Previewer - always shows */}
          {showPagePreviewer && <PagePreviewer />}
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;