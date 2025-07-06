// Enhanced Analytics with VERIFIED Google Tag (gtag.js) Implementation

// Initialize analytics tracking
export const initializeAnalytics = () => {
  if (typeof window !== 'undefined') {
    console.log('📈 Initializing VERIFIED Google Analytics 4 (gtag.js)...');
    
    // Verify gtag is loaded
    if (typeof window.gtag === 'function') {
      console.log('✅ gtag function is available');
      
      // Send initial page view with enhanced data
      gtag('config', 'G-CTDQQ8XMKC', {
        page_title: document.title,
        page_location: window.location.href,
        send_page_view: true,
        custom_map: {
          custom_dimension_1: 'site_section'
        }
      });
      
      console.log('📊 GA4 initialized with measurement ID: G-CTDQQ8XMKC');
      console.log('🎯 Enhanced tracking enabled');
    } else {
      console.error('❌ gtag function not available - check Google Analytics implementation');
    }
  }
};

// Initialize page tracking (alias for initializeAnalytics)
export const initializePageTracking = () => {
  initializeAnalytics();
  console.log('📄 Page tracking initialized');
  
  // Send initialization event
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    gtag('event', 'analytics_initialized', {
      event_category: 'system',
      event_label: 'page_tracking_init',
      timestamp: new Date().toISOString()
    });
  }
};

// Enhanced page view tracking with VERIFIED gtag
export const trackPageView = (pagePath, pageTitle) => {
  if (typeof window !== 'undefined') {
    // Primary tracking with VERIFIED Google Analytics 4
    if (typeof window.gtag === 'function') {
      // Send both config and event for comprehensive tracking
      gtag('config', 'G-CTDQQ8XMKC', {
        page_path: pagePath,
        page_title: pageTitle,
        page_location: window.location.href,
        send_page_view: true
      });
      
      // Also send as custom event for better tracking
      gtag('event', 'page_view', {
        page_path: pagePath,
        page_title: pageTitle,
        page_location: window.location.href,
        referrer: document.referrer,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent.substring(0, 100) // Truncated for privacy
      });
      
      console.log('📄 VERIFIED GA4 Page view tracked:', pagePath, pageTitle);
    } else {
      console.warn('⚠️ gtag function not available for page view tracking');
    }
    
    // Track with SiteBehaviour
    document.dispatchEvent(new CustomEvent('sitebehaviour-pageview', {
      detail: {
        page_path: pagePath,
        page_title: pageTitle,
        page_location: window.location.href,
        referrer: document.referrer,
        timestamp: new Date().toISOString()
      }
    }));
    
    // Track with DataLayer for GTM compatibility
    if (window.dataLayer && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: 'custom_page_view',
        page_path: pagePath,
        page_title: pageTitle,
        page_location: window.location.href,
        timestamp: new Date().toISOString()
      });
    }
  }
};

// Enhanced event tracking with VERIFIED gtag
export const trackEvent = (eventName, parameters = {}) => {
  if (typeof window !== 'undefined') {
    // Primary tracking with VERIFIED Google Analytics 4
    if (typeof window.gtag === 'function') {
      const enhancedParams = {
        ...parameters,
        timestamp: new Date().toISOString(),
        measurement_id: 'G-CTDQQ8XMKC',
        page_path: window.location.pathname,
        page_title: document.title
      };
      
      gtag('event', eventName, enhancedParams);
      
      console.log('📊 VERIFIED GA4 Event tracked:', eventName, parameters);
    } else {
      console.warn('⚠️ gtag function not available for event tracking');
    }
    
    // Track with SiteBehaviour
    document.dispatchEvent(new CustomEvent(`sitebehaviour-${eventName}`, {
      detail: {
        ...parameters,
        timestamp: new Date().toISOString()
      }
    }));
    
    // Track with DataLayer for GTM compatibility
    if (window.dataLayer && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: `custom_${eventName}`,
        eventCategory: parameters.event_category || 'general',
        eventAction: eventName,
        eventLabel: parameters.event_label || '',
        ...parameters,
        timestamp: new Date().toISOString()
      });
    }
  }
};

// Enhanced conversion tracking with VERIFIED gtag
export const trackConversion = (conversionType, value = 0, currency = 'USD') => {
  const conversionData = {
    event_category: 'conversion',
    event_label: conversionType,
    value: value,
    currency: currency,
    transaction_id: `${conversionType}_${Date.now()}`
  };
  
  if (typeof window !== 'undefined') {
    // Track with VERIFIED Google Analytics 4
    if (typeof window.gtag === 'function') {
      // Send as purchase event for e-commerce tracking
      gtag('event', 'purchase', {
        transaction_id: conversionData.transaction_id,
        value: value,
        currency: currency,
        items: [{
          item_id: conversionType,
          item_name: conversionType,
          category: 'conversion',
          quantity: 1,
          price: value
        }]
      });
      
      // Also send as custom conversion event
      gtag('event', 'conversion', conversionData);
      
      console.log('💰 VERIFIED GA4 Conversion tracked:', conversionType, value);
    }
    
    // Track with SiteBehaviour
    document.dispatchEvent(new CustomEvent('sitebehaviour-conversion', {
      detail: conversionData
    }));
    
    // Track with DataLayer for GTM compatibility
    if (window.dataLayer && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: 'purchase',
        ecommerce: {
          transaction_id: conversionData.transaction_id,
          value: value,
          currency: currency,
          items: [{
            item_name: conversionType,
            item_category: 'conversion',
            price: value,
            quantity: 1
          }]
        }
      });
    }
  }
};

// Enhanced form submission tracking
export const trackFormSubmission = (formName, formData = {}) => {
  const eventData = {
    event_category: 'form_interaction',
    event_label: formName,
    form_name: formName,
    timestamp: new Date().toISOString(),
    ...formData
  };
  
  // Track form submission as event
  trackEvent('form_submit', eventData);
  
  // Also track as conversion with value
  trackConversion('form_submission', 99.99, 'USD');
  
  console.log('📝 Form submission tracked:', formName);
};

// Enhanced button click tracking
export const trackButtonClick = (buttonName, location = '', additionalData = {}) => {
  const eventData = {
    event_category: 'user_interaction',
    event_label: buttonName,
    button_name: buttonName,
    click_location: location,
    timestamp: new Date().toISOString(),
    ...additionalData
  };
  
  trackEvent('button_click', eventData);
  
  console.log('🖱️ Button click tracked:', buttonName, 'at', location);
};

// User engagement tracking
export const trackUserEngagement = (action, element, additionalData = {}) => {
  const eventData = {
    event_category: 'user_engagement',
    event_label: element,
    interaction_type: action,
    element: element,
    timestamp: new Date().toISOString(),
    ...additionalData
  };
  
  trackEvent('user_engagement', eventData);
};

// Enhanced page tracking for Single Page Applications
export const trackSPANavigation = (fromPath, toPath, pageTitle) => {
  // Track navigation between pages
  trackEvent('spa_navigation', {
    event_category: 'navigation',
    from_page: fromPath,
    to_page: toPath,
    page_title: pageTitle
  });
  
  // Track the new page view
  trackPageView(toPath, pageTitle);
};

// Scroll depth tracking
export const trackScrollDepth = (depth) => {
  trackEvent('scroll_depth', {
    event_category: 'user_engagement',
    scroll_depth: depth,
    page_path: window.location.pathname
  });
};

// Time on page tracking
export const trackTimeOnPage = (timeInSeconds) => {
  trackEvent('time_on_page', {
    event_category: 'user_engagement',
    time_seconds: timeInSeconds,
    page_path: window.location.pathname
  });
};

// Real-time tracking test function
export const testGA4RealTimeTracking = () => {
  console.log('🧪 Testing GA4 Real-Time Tracking');
  console.log('=================================');
  
  if (typeof window.gtag === 'function') {
    const testEvents = [
      { name: 'test_tracking_verification', params: { event_category: 'testing', test_type: 'real_time' }},
      { name: 'test_page_interaction', params: { event_category: 'testing', interaction_type: 'manual_test' }},
      { name: 'test_conversion_simulation', params: { event_category: 'conversion', value: 1, currency: 'USD' }}
    ];
    
    testEvents.forEach((event, index) => {
      setTimeout(() => {
        gtag('event', event.name, event.params);
        console.log(`📊 Test event ${index + 1} sent: ${event.name}`);
      }, index * 1000);
    });
    
    console.log('✅ All test events queued');
    console.log('📈 Check GA4 Real-Time reports in 1-2 minutes');
  } else {
    console.error('❌ gtag function not available');
  }
};

// Make test function globally available
if (typeof window !== 'undefined') {
  window.testGA4RealTimeTracking = testGA4RealTimeTracking;
  
  // Auto-initialize after DOM loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAnalytics);
  } else {
    initializeAnalytics();
  }
}