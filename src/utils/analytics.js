// Enhanced Google Analytics 4 & Multi-Platform Analytics Helper Functions

// Automatic page view tracking for React Router
export const initializePageTracking = () => {
  // Track initial page load
  if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
    window.gtag('config', 'G-CTDQQ8XMKC', {
      page_title: document.title,
      page_location: window.location.href,
      send_page_view: true
    });
    console.log('📈 Initial page view tracked:', window.location.pathname);
  }
};

export const trackEvent = (eventName, parameters = {}) => {
  // Track with Google Analytics 4
  if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
    window.gtag('event', eventName, {
      ...parameters,
      timestamp: new Date().toISOString()
    });
    console.log('📊 GA4 Event tracked:', eventName, parameters);
  }
  
  // Track with Firebase Analytics
  if (typeof window !== 'undefined' && window.firebaseAnalytics) {
    window.firebaseAnalytics.logEvent(eventName, parameters);
  }
  
  // Track with CyborgCRM
  if (typeof window !== 'undefined' && window.CyborgCRM) {
    window.CyborgCRM('track', eventName, parameters);
  }
  
  // Track with SiteBehaviour if available
  if (typeof window !== 'undefined' && window.sitebehaviourTrackingSecret) {
    // SiteBehaviour automatically tracks user behavior
    console.log('📊 SiteBehaviour tracking active');
  }
};

export const trackPageView = (pagePath, pageTitle) => {
  // Track with Google Analytics 4
  if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
    window.gtag('config', 'G-CTDQQ8XMKC', {
      page_path: pagePath,
      page_title: pageTitle,
      page_location: window.location.href
    });
    console.log('📄 GA4 Page view tracked:', pagePath, pageTitle);
  }
  
  // Track with Firebase Analytics
  if (typeof window !== 'undefined' && window.firebaseAnalytics) {
    window.firebaseAnalytics.logEvent('page_view', {
      page_path: pagePath,
      page_title: pageTitle,
      page_location: window.location.href
    });
  }
  
  // Track with CyborgCRM
  if (typeof window !== 'undefined' && window.CyborgCRM) {
    window.CyborgCRM('track', 'pageview', {
      page: pagePath,
      title: pageTitle
    });
  }
};

export const trackConversion = (conversionType, value = 0, currency = 'USD') => {
  const conversionData = {
    event_category: 'conversion',
    event_label: conversionType,
    value: value,
    currency: currency,
    transaction_id: `${conversionType}_${Date.now()}`
  };

  // Track with Google Analytics 4
  if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
    // Track conversion event
    window.gtag('event', 'conversion', conversionData);
    
    // Track purchase event for e-commerce
    window.gtag('event', 'purchase', {
      transaction_id: conversionData.transaction_id,
      value: value,
      currency: currency,
      items: [{
        item_id: conversionType,
        item_name: conversionType,
        category: 'marketing_service',
        price: value,
        quantity: 1
      }]
    });
    
    console.log('💰 GA4 Conversion tracked:', conversionType, value);
  }
  
  // Track with Firebase Analytics
  if (typeof window !== 'undefined' && window.firebaseAnalytics) {
    window.firebaseAnalytics.logEvent('purchase', {
      currency: currency,
      value: value,
      transaction_id: conversionData.transaction_id
    });
  }
  
  // Track with CyborgCRM
  if (typeof window !== 'undefined' && window.CyborgCRM) {
    window.CyborgCRM('track', 'conversion', conversionData);
  }
};

export const trackFormSubmission = (formName, formData = {}) => {
  const eventData = {
    event_category: 'form',
    event_label: formName,
    form_name: formName,
    timestamp: new Date().toISOString(),
    ...formData
  };

  trackEvent('form_submit', eventData);
  
  // Also track as a lead conversion
  trackConversion('lead_form_submission', 99.99, 'USD');
};

export const trackButtonClick = (buttonName, location = '', additionalData = {}) => {
  const eventData = {
    event_category: 'engagement',
    event_label: buttonName,
    button_name: buttonName,
    click_location: location,
    timestamp: new Date().toISOString(),
    ...additionalData
  };

  trackEvent('click', eventData);
  console.log('🖱️ Button click tracked:', buttonName, 'at', location);
};

export const trackUserEngagement = (action, element, additionalData = {}) => {
  const eventData = {
    event_category: 'user_interaction',
    event_label: element,
    interaction_type: action,
    element: element,
    timestamp: new Date().toISOString(),
    ...additionalData
  };

  trackEvent('engagement', eventData);
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

// Track scroll depth
export const trackScrollDepth = (depth) => {
  trackEvent('scroll_depth', {
    event_category: 'engagement',
    scroll_depth: depth,
    page_path: window.location.pathname
  });
};

// Track time on page
export const trackTimeOnPage = (timeInSeconds) => {
  trackEvent('time_on_page', {
    event_category: 'engagement',
    time_seconds: timeInSeconds,
    page_path: window.location.pathname
  });
};