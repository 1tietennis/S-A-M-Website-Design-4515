// Google Analytics 4 Utility Functions - Only using G-CTDQQ8XMKC

// Track page view
export const trackPageView = (pagePath, pageTitle) => {
  if (typeof window !== 'undefined') {
    // Track with Google Analytics 4 (G-CTDQQ8XMKC only)
    if (typeof window.gtag === 'function') {
      // Send page view event
      gtag('config', 'G-CTDQQ8XMKC', {
        page_path: pagePath,
        page_title: pageTitle,
        page_location: window.location.href,
        send_page_view: true
      });
      
      console.log('📄 GA4 Page view tracked:', pagePath, pageTitle);
    } else {
      console.warn('⚠️ gtag function not available for page view tracking');
    }
  }
};

// Track event
export const trackEvent = (eventName, parameters = {}) => {
  if (typeof window !== 'undefined') {
    // Track with Google Analytics 4 (G-CTDQQ8XMKC only)
    if (typeof window.gtag === 'function') {
      const enhancedParams = {
        ...parameters,
        timestamp: new Date().toISOString(),
        page_path: window.location.pathname,
        page_title: document.title
      };
      gtag('event', eventName, enhancedParams);
      console.log('📊 GA4 Event tracked:', eventName, parameters);
    } else {
      console.warn('⚠️ gtag function not available for event tracking');
    }
  }
};

// Track button click
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

// Track form submission
export const trackFormSubmission = (formName, formData = {}) => {
  const eventData = {
    event_category: 'form_interaction',
    event_label: formName,
    form_name: formName,
    timestamp: new Date().toISOString(),
    ...formData
  };

  trackEvent('form_submit', eventData);
  console.log('📝 Form submission tracked:', formName);
};

// Track user engagement
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

// Test Google Analytics tracking
export const testGATracking = () => {
  console.log('🧪 Testing Google Analytics 4 Tracking');
  console.log('======================================');

  if (typeof window.gtag === 'function') {
    // Send test event
    gtag('event', 'test_event', {
      event_category: 'testing',
      event_label: 'ga4_verification',
      test_timestamp: new Date().toISOString()
    });
    
    console.log('✅ Test event sent successfully to G-CTDQQ8XMKC');
    console.log('📈 Check GA4 Real-Time reports to verify');
    return true;
  } else {
    console.error('❌ gtag function not available');
    return false;
  }
};

// Make test function globally available
if (typeof window !== 'undefined') {
  window.testGATracking = testGATracking;
}