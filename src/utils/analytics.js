// Enhanced SiteBehaviour & Multi-Platform Analytics Helper Functions

// Automatic page view tracking for React Router
export const initializePageTracking = () => {
  // Track initial page load with SiteBehaviour focus
  if (typeof window !== 'undefined') {
    console.log('📈 Initializing SiteBehaviour-focused page tracking...');
    
    // Send page view to SiteBehaviour
    document.dispatchEvent(new CustomEvent('sitebehaviour-pageview', {
      detail: {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname,
        timestamp: new Date().toISOString()
      }
    }));
    
    console.log('📊 Initial page view tracked:', window.location.pathname);
  }
};

export const trackEvent = (eventName, parameters = {}) => {
  // Primary tracking with SiteBehaviour
  if (typeof window !== 'undefined') {
    // Send to SiteBehaviour
    document.dispatchEvent(new CustomEvent(`sitebehaviour-${eventName}`, {
      detail: {
        ...parameters,
        timestamp: new Date().toISOString()
      }
    }));
    
    console.log('📊 SiteBehaviour Event tracked:', eventName, parameters);
  }

  // Track with Firebase Analytics if available
  if (typeof window !== 'undefined' && window.firebaseAnalytics) {
    window.firebaseAnalytics.logEvent(eventName, parameters);
  }

  // Track with CyborgCRM if available
  if (typeof window !== 'undefined' && window.CyborgCRM) {
    window.CyborgCRM('track', eventName, parameters);
  }
};

export const trackPageView = (pagePath, pageTitle) => {
  // Primary SiteBehaviour page tracking
  if (typeof window !== 'undefined') {
    document.dispatchEvent(new CustomEvent('sitebehaviour-pageview', {
      detail: {
        page_path: pagePath,
        page_title: pageTitle,
        page_location: window.location.href,
        referrer: document.referrer,
        timestamp: new Date().toISOString()
      }
    }));
    
    console.log('📄 SiteBehaviour Page view tracked:', pagePath, pageTitle);
  }

  // Track with Firebase Analytics if available
  if (typeof window !== 'undefined' && window.firebaseAnalytics) {
    window.firebaseAnalytics.logEvent('page_view', {
      page_path: pagePath,
      page_title: pageTitle,
      page_location: window.location.href
    });
  }

  // Track with CyborgCRM if available
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

  // Track with SiteBehaviour
  document.dispatchEvent(new CustomEvent('sitebehaviour-conversion', {
    detail: conversionData
  }));

  // Track with Firebase Analytics if available
  if (typeof window !== 'undefined' && window.firebaseAnalytics) {
    window.firebaseAnalytics.logEvent('purchase', {
      currency: currency,
      value: value,
      transaction_id: conversionData.transaction_id
    });
  }

  // Track with CyborgCRM if available
  if (typeof window !== 'undefined' && window.CyborgCRM) {
    window.CyborgCRM('track', 'conversion', conversionData);
  }

  console.log('💰 Conversion tracked:', conversionType, value);
};

export const trackFormSubmission = (formName, formData = {}) => {
  const eventData = {
    event_category: 'form',
    event_label: formName,
    form_name: formName,
    timestamp: new Date().toISOString(),
    ...formData
  };

  // Track with SiteBehaviour
  trackEvent('form_submit', eventData);

  // Also track as a lead conversion
  trackConversion('lead_form_submission', 99.99, 'USD');

  console.log('📝 Form submission tracked:', formName);
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

  // Track with SiteBehaviour
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

  // Track with SiteBehaviour
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