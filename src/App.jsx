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
import DroneServices from './pages/DroneServices';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import ContactManager from './pages/ContactManager';
import ThankYou from './components/ThankYou';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

// Component to handle route changes and analytics
function AnalyticsWrapper({ children }) {
  const location = useLocation();
  const [previousPath, setPreviousPath] = React.useState(location.pathname);

  useEffect(() => {
    // Track route changes for SPA navigation with enhanced analytics
    if (previousPath !== location.pathname) {
      const pageTitle = document.title;
      
      // Track with Google Analytics 4 (G-CTDQQ8XMKC only)
      if (typeof window.gtag === 'function') {
        window.gtag('config', 'G-CTDQQ8XMKC', {
          page_title: pageTitle,
          page_path: location.pathname,
          page_location: window.location.href
        });
        console.log('📊 Page view tracked with GA4:', location.pathname);
      }
      
      setPreviousPath(location.pathname);
    }
  }, [location, previousPath]);

  return children;
}

function App() {
  useEffect(() => {
    // Track initial app load with Google Analytics 4 (G-CTDQQ8XMKC only)
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'app_loaded', {
        event_category: 'app_lifecycle',
        timestamp: new Date().toISOString()
      });
      console.log('✅ Google Analytics 4 app_loaded event sent to G-CTDQQ8XMKC');
    }
  }, []);

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
              <Route path="/drone-services" element={<>
                <Header />
                <main><DroneServices /></main>
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
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;