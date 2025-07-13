import React,{useEffect} from 'react';
import {HashRouter as Router,Routes,Route,useLocation} from 'react-router-dom';
import {AuthProvider} from './context/AuthContext';
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
import ProtectedRoute from './components/ProtectedRoute';
import AnalyticsDebugger from './components/AnalyticsDebugger';
import SiteBehaviourController from './components/SiteBehaviourController';
import {initializeEnhancedAnalytics,trackEnhancedPageView,verifyEnhancedAnalytics} from './utils/analyticsEnhanced';
import {trackPageLoadComplete} from './utils/analyticsVerification';
import TrackingTroubleshooter from './utils/trackingTroubleshooter';
import './App.css';

// Component to handle route changes and enhanced analytics
function AnalyticsWrapper({children}) {
  const location=useLocation();
  const [previousPath,setPreviousPath]=React.useState(location.pathname);

  useEffect(()=> {
    // Track route changes for SPA navigation with enhanced analytics
    if (previousPath !==location.pathname) {
      const pageTitle=document.title;
      trackEnhancedPageView(location.pathname,pageTitle);
      setPreviousPath(location.pathname);
    }
  },[location,previousPath]);

  return children;
}

function App() {
  useEffect(()=> {
    // Initialize enhanced analytics with Meta Pixel when app loads
    initializeEnhancedAnalytics();

    // Initialize tracking troubleshooter
    TrackingTroubleshooter.initialize();

    // Track initial app load across all platforms
    if (typeof window !=='undefined') {
      // Google Analytics 4
      if (typeof window.gtag !=='undefined') {
        window.gtag('event','app_loaded',{
          event_category: 'app_lifecycle',
          timestamp: new Date().toISOString()
        });
      }

      // Meta Pixel
      if (typeof window.fbq !=='undefined') {
        window.fbq('trackCustom','AppLoaded',{
          app_name: 'Secret Agent Digital Marketing',
          load_time: Date.now(),
          user_agent: navigator.userAgent.substring(0,100)
        });
      }
      
      // CyborgCRM
      if (typeof window.CyborgCRM !=='undefined') {
        window.CyborgCRM('track', 'app_loaded', {
          app_name: 'Secret Agent Digital Marketing',
          load_time: Date.now(),
          timestamp: new Date().toISOString()
        });
        console.log('✅ CyborgCRM app_loaded event sent');
      }

      // Initialize Visitor Tracking if available
      if (typeof window.init_tracer==='function') {
        try {
          window.init_tracer();
          console.log('✅ Visitor Tracking initialized from App.jsx');
        } catch (error) {
          console.error('❌ Error initializing Visitor Tracking:',error);
        }
      }
    }

    // Run comprehensive analytics verification and troubleshooting
    setTimeout(()=> {
      verifyEnhancedAnalytics();
      trackPageLoadComplete('App');

      // Run initial tracking diagnostic
      console.log('🔧 Running initial tracking diagnostic...');
      TrackingTroubleshooter.quickCheck();

      // Auto-run full diagnostic if issues detected
      setTimeout(()=> {
        const healthStatus=TrackingTroubleshooter.getTrackingHealthStatus();
        if (healthStatus.score < 75) {
          console.warn('⚠️ Tracking issues detected - running full diagnostic...');
          TrackingTroubleshooter.runDiagnostic();
        }
      },5000);
    },2000);

    // Initialize SiteBehaviour systems
    Promise.all([
      import('./utils/siteBehaviourCommands.js'),
      import('./utils/siteBehaviourRealTimeMonitor.js')
    ]).then(([commands,monitor])=> {
      console.log('🎯 SiteBehaviour systems loaded');
      if (monitor.default && monitor.default.initializeRealTimeMonitoring) {
        monitor.default.initializeRealTimeMonitoring();
      }
    }).catch(error=> {
      console.log('SiteBehaviour systems not available:',error.message);
    });

    console.log('🚀 Secret Agent Digital Marketing App Loaded with Enhanced Analytics + Troubleshooting');
  },[]);

  // Show debugger in development or with debug parameter
  const showDebugger=process.env.NODE_ENV==='development' || (typeof window !=='undefined' && window.location.search.includes('debug=true'));

  // Show SiteBehaviour controller with sitebehaviour parameter
  const showSiteBehaviour=(typeof window !=='undefined' && window.location.search.includes('sitebehaviour=true')) || process.env.NODE_ENV==='development';

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-jet-black text-white">
          <AnalyticsWrapper>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/onboarding" element={<Onboarding />} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute requireOnboarding={true}>
                  <Dashboard />
                </ProtectedRoute>
              } />

              {/* Main Site Routes */}
              <Route path="/" element={<>
                <Header />
                <main>
                  <Home />
                </main>
                <Footer />
              </>} />
              <Route path="/services" element={<>
                <Header />
                <main>
                  <Services />
                </main>
                <Footer />
              </>} />
              <Route path="/video-marketing" element={<>
                <Header />
                <main>
                  <VideoMarketing />
                </main>
                <Footer />
              </>} />
              <Route path="/about" element={<>
                <Header />
                <main>
                  <About />
                </main>
                <Footer />
              </>} />
              <Route path="/case-studies" element={<>
                <Header />
                <main>
                  <CaseStudies />
                </main>
                <Footer />
              </>} />
              <Route path="/contact" element={<>
                <Header />
                <main>
                  <Contact />
                </main>
                <Footer />
              </>} />
            </Routes>
          </AnalyticsWrapper>

          {/* Analytics Debugger - shows when debug=true in URL or in development */}
          <AnalyticsDebugger showDebugger={showDebugger} />

          {/* SiteBehaviour Controller - shows when sitebehaviour=true in URL or in development */}
          <SiteBehaviourController showController={showSiteBehaviour} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;