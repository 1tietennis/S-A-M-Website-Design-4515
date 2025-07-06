// Enhanced Analytics with NEW Google Tag (gtag.js) Implementation

// Initialize analytics tracking
export const initializeAnalytics = () => {
  if (typeof window !== 'undefined') {
    console.log('📈 Initializing NEW Google Analytics 4 (gtag.js)...');
    
    // Verify gtag is loaded
    if (typeof window.gtag === 'function') {
      console.log('✅ gtag function is available');
      
      // Send initial page view
      gtag('config', 'G-CTDQQ8XMKC', {
        page_title: document.title,
        page_location: window.location.href
      });
      
      console.log('📊 GA4 initialized with measurement ID: G-CTDQQ8XMKC');
    } else {
      console.error('❌ gtag function not available - check Google Analytics implementation');
    }
  }
};

// Initialize page tracking (alias for initializeAnalytics)
export const initializePageTracking = () => {
  initializeAnalytics();
  console.log('📄 Page tracking initialized');
};

// Enhanced page view tracking with NEW gtag
export const trackPageView = (pagePath, pageTitle) => {
  if (typeof window !== 'undefined') {
    // Primary tracking with NEW Google Analytics 4
    if (typeof window.gtag === 'function') {
      gtag('config', 'G-CTDQQ8XMKC', {
        page_path: pagePath,
        page_title: pageTitle,
        page_location: window.location.href
      });
      
      // Also send as event for better tracking
      gtag('event', 'page_view', {
        page_path: pagePath,
        page_title: pageTitle,
        page_location: window.location.href,
        timestamp: new Date().toISOString()
      });
      
      console.log('📄 NEW GA4 Page view tracked:', pagePath, pageTitle);
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
    
    // Track with Firebase Analytics if available
    if (typeof window.firebaseAnalytics !== 'undefined') {
      window.firebaseAnalytics.logEvent('page_view', {
        page_path: pagePath,
        page_title: pageTitle,
        page_location: window.location.href
      });
    }
    
    // Track with CyborgCRM if available
    if (typeof window.CyborgCRM === 'function') {
      window.CyborgCRM('track', 'pageview', {
        page: pagePath,
        title: pageTitle
      });
    }
  }
};

// Enhanced event tracking with NEW gtag
export const trackEvent = (eventName, parameters = {}) => {
  if (typeof window !== 'undefined') {
    // Primary tracking with NEW Google Analytics 4
    if (typeof window.gtag === 'function') {
      gtag('event', eventName, {
        ...parameters,
        timestamp: new Date().toISOString(),
        measurement_id: 'G-CTDQQ8XMKC'
      });
      
      console.log('📊 NEW GA4 Event tracked:', eventName, parameters);
    }
    
    // Track with SiteBehaviour
    document.dispatchEvent(new CustomEvent(`sitebehaviour-${eventName}`, {
      detail: {
        ...parameters,
        timestamp: new Date().toISOString()
      }
    }));
    
    // Track with Firebase Analytics if available
    if (typeof window.firebaseAnalytics !== 'undefined') {
      window.firebaseAnalytics.logEvent(eventName, parameters);
    }
    
    // Track with CyborgCRM if available
    if (typeof window.CyborgCRM === 'function') {
      window.CyborgCRM('track', eventName, parameters);
    }
  }
};

// Enhanced conversion tracking with NEW gtag
export const trackConversion = (conversionType, value = 0, currency = 'USD') => {
  const conversionData = {
    event_category: 'conversion',
    event_label: conversionType,
    value: value,
    currency: currency,
    transaction_id: `${conversionType}_${Date.now()}`
  };
  
  if (typeof window !== 'undefined') {
    // Track with NEW Google Analytics 4
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
      
      console.log('💰 NEW GA4 Conversion tracked:', conversionType, value);
    }
    
    // Track with SiteBehaviour
    document.dispatchEvent(new CustomEvent('sitebehaviour-conversion', {
      detail: conversionData
    }));
    
    // Track with Firebase Analytics if available
    if (typeof window.firebaseAnalytics !== 'undefined') {
      window.firebaseAnalytics.logEvent('purchase', {
        currency: currency,
        value: value,
        transaction_id: conversionData.transaction_id
      });
    }
    
    // Track with CyborgCRM if available
    if (typeof window.CyborgCRM === 'function') {
      window.CyborgCRM('track', 'conversion', conversionData);
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

// Initialize analytics when module loads
if (typeof window !== 'undefined') {
  // Auto-initialize after DOM loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAnalytics);
  } else {
    initializeAnalytics();
  }
}