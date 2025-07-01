// Google Analytics & Firebase Analytics Helper Functions
export const trackEvent = (eventName, parameters = {}) => {
  // Track with Google Analytics 4
  if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
    window.gtag('event', eventName, parameters);
  }
  
  // Track with Firebase Analytics
  if (typeof window !== 'undefined' && window.firebaseAnalytics) {
    window.firebaseAnalytics.logEvent(eventName, parameters);
  }
  
  // Also track with CyborgCRM if available
  if (typeof window !== 'undefined' && window.CyborgCRM) {
    window.CyborgCRM('track', eventName, parameters);
  }
};

export const trackPageView = (pagePath, pageTitle) => {
  // Track with Google Analytics 4
  if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
    window.gtag('config', 'YOUR_TRACKING_ID', {
      page_path: pagePath,
      page_title: pageTitle
    });
  }
  
  // Track with Firebase Analytics
  if (typeof window !== 'undefined' && window.firebaseAnalytics) {
    window.firebaseAnalytics.logEvent('page_view', {
      page_path: pagePath,
      page_title: pageTitle
    });
  }
  
  // Also track with CyborgCRM if available
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
    currency: currency
  };
  
  // Track with Google Analytics 4
  if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
    window.gtag('event', 'conversion', conversionData);
  }
  
  // Track with Firebase Analytics
  if (typeof window !== 'undefined' && window.firebaseAnalytics) {
    window.firebaseAnalytics.logEvent('purchase', {
      currency: currency,
      value: value,
      transaction_id: `${conversionType}_${Date.now()}`
    });
  }
  
  // Also track with CyborgCRM if available
  if (typeof window !== 'undefined' && window.CyborgCRM) {
    window.CyborgCRM('track', 'conversion', conversionData);
  }
};

export const trackFormSubmission = (formName, formData = {}) => {
  const eventData = {
    event_category: 'form',
    event_label: formName,
    ...formData
  };
  
  trackEvent('form_submit', eventData);
};

export const trackButtonClick = (buttonName, location = '') => {
  const eventData = {
    event_category: 'button',
    event_label: buttonName,
    location: location
  };
  
  trackEvent('click', eventData);
};