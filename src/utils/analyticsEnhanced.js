// Enhanced Analytics with Meta Pixel Integration
import {initializeMetaPixel, trackMetaPageView, trackMetaLead, trackMetaContact, trackMetaPurchase, trackMetaCustomEvent, trackMetaInteraction} from './metaPixel';

// Initialize all analytics platforms including Meta Pixel
export const initializeEnhancedAnalytics = () => {
  if (typeof window !== 'undefined') {
    console.log('🚀 Initializing Enhanced Analytics with Meta Pixel...');
    
    // Initialize Google Analytics 4
    if (typeof window.gtag === 'function') {
      console.log('✅ Google Analytics 4 initialized');
    }
    
    // Initialize Meta Pixel
    const metaInitialized = initializeMetaPixel();
    if (metaInitialized) {
      console.log('✅ Meta Pixel initialized');
    }
    
    // Initialize SiteBehaviour (if available)
    if (window.sitebehaviourTrackingSecret) {
      console.log('✅ SiteBehaviour tracking active');
    }
    
    // Initialize Visitor Tracking (if available)
    if (typeof window.init_tracer === 'function') {
      try {
        window.init_tracer();
        console.log('✅ Visitor Tracking initialized');
      } catch (error) {
        console.error('❌ Error initializing Visitor Tracking:', error);
      }
    }
    
    console.log('🎯 All analytics platforms initialized');
  }
};

// Enhanced page view tracking across all platforms
export const trackEnhancedPageView = (pagePath, pageTitle) => {
  if (typeof window !== 'undefined') {
    console.log(`📊 Enhanced page view tracking: ${pagePath}`);
    
    // Google Analytics 4
    if (typeof window.gtag === 'function') {
      window.gtag('config', 'G-CTDQQ8XMKC', {
        page_path: pagePath,
        page_title: pageTitle,
        page_location: window.location.href,
        send_page_view: true
      });
    }
    
    // Meta Pixel
    trackMetaPageView(pageTitle, window.location.href);
    
    // SiteBehaviour
    document.dispatchEvent(new CustomEvent('sitebehaviour-pageview', {
      detail: {
        page_path: pagePath,
        page_title: pageTitle,
        page_location: window.location.href,
        referrer: document.referrer,
        timestamp: new Date().toISOString()
      }
    }));
    
    // Visitor Tracking
    if (typeof window.Tracer !== 'undefined' && typeof window.init_tracer === 'function') {
      try {
        // Make sure tracer is initialized
        window.init_tracer();
      } catch (error) {
        console.warn('⚠️ Visitor Tracking error:', error.message);
      }
    }
    
    // DataLayer for GTM
    if (window.dataLayer && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: 'enhanced_page_view',
        page_path: pagePath,
        page_title: pageTitle,
        page_location: window.location.href,
        timestamp: new Date().toISOString()
      });
    }
  }
};

// Enhanced event tracking across all platforms
export const trackEnhancedEvent = (eventName, parameters = {}) => {
  if (typeof window !== 'undefined') {
    console.log(`📈 Enhanced event tracking: ${eventName}`);
    
    // Google Analytics 4
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, {
        ...parameters,
        timestamp: new Date().toISOString(),
        measurement_id: 'G-CTDQQ8XMKC'
      });
    }
    
    // Meta Pixel - map GA4 events to Meta events
    const metaEventMapping = {
      'button_click': () => trackMetaInteraction('button_click', parameters.button_name, parameters),
      'form_submit': () => trackMetaContact(parameters),
      'conversion': () => trackMetaPurchase(parameters),
      'lead_generation': () => trackMetaLead(parameters),
      'user_engagement': () => trackMetaCustomEvent('UserEngagement', parameters)
    };
    
    if (metaEventMapping[eventName]) {
      metaEventMapping[eventName]();
    } else {
      trackMetaCustomEvent(eventName, parameters);
    }
    
    // SiteBehaviour
    document.dispatchEvent(new CustomEvent(`sitebehaviour-${eventName}`, {
      detail: {
        ...parameters,
        timestamp: new Date().toISOString()
      }
    }));
    
    // Visitor Tracking
    if (typeof window.Tracer !== 'undefined') {
      try {
        // Assuming Tracer has a trackEvent method or similar
        if (typeof window.tracer !== 'undefined' && typeof window.tracer.trackEvent === 'function') {
          window.tracer.trackEvent(eventName, parameters);
        }
      } catch (error) {
        console.warn('⚠️ Visitor Tracking event error:', error.message);
      }
    }
    
    // DataLayer
    if (window.dataLayer && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: `enhanced_${eventName}`,
        eventCategory: parameters.event_category || 'general',
        eventAction: eventName,
        eventLabel: parameters.event_label || '',
        ...parameters,
        timestamp: new Date().toISOString()
      });
    }
  }
};

// Enhanced conversion tracking
export const trackEnhancedConversion = (conversionType, value = 0, currency = 'USD', additionalData = {}) => {
  console.log(`💰 Enhanced conversion tracking: ${conversionType} - $${value}`);
  
  const conversionData = {
    event_category: 'conversion',
    event_label: conversionType,
    value: value,
    currency: currency,
    transaction_id: `${conversionType}_${Date.now()}`,
    ...additionalData
  };
  
  // Google Analytics 4 - E-commerce event
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'purchase', {
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
  }
  
  // Meta Pixel - Purchase event
  trackMetaPurchase({
    value: value,
    currency: currency,
    serviceId: conversionType,
    serviceName: additionalData.service_name || conversionType,
    ...additionalData
  });
  
  // Track as enhanced event
  trackEnhancedEvent('conversion', conversionData);
};

// Enhanced form submission tracking
export const trackEnhancedFormSubmission = (formName, formData = {}) => {
  console.log(`📝 Enhanced form submission: ${formName}`);
  
  const submissionData = {
    event_category: 'form_interaction',
    event_label: formName,
    form_name: formName,
    timestamp: new Date().toISOString(),
    ...formData
  };
  
  // Track as lead for Meta Pixel
  trackMetaLead({
    source: 'website_form',
    service: formData.service || 'general_inquiry',
    budget: formData.budget || 'not_specified',
    urgency: formData.urgency || 'standard',
    value: 99.99 // Estimated lead value
  });
  
  // Track contact for Meta Pixel
  trackMetaContact({
    formName: formName,
    page: window.location.pathname,
    fieldsCompleted: Object.keys(formData).length,
    userType: 'prospect'
  });
  
  // Track as enhanced event
  trackEnhancedEvent('form_submit', submissionData);
  
  // Also track as conversion
  trackEnhancedConversion('form_submission', 99.99, 'USD', submissionData);
};

// Enhanced button click tracking
export const trackEnhancedButtonClick = (buttonName, location = '', additionalData = {}) => {
  console.log(`🖱️ Enhanced button click: ${buttonName} at ${location}`);
  
  const clickData = {
    event_category: 'user_interaction',
    event_label: buttonName,
    button_name: buttonName,
    click_location: location,
    timestamp: new Date().toISOString(),
    ...additionalData
  };
  
  // Meta Pixel interaction tracking
  trackMetaInteraction('button_click', buttonName, {
    location: location,
    text: buttonName,
    isCTA: additionalData.is_cta || false,
    estimatedValue: additionalData.estimated_value || 25.00,
    ...additionalData
  });
  
  // Track as enhanced event
  trackEnhancedEvent('button_click', clickData);
};

// Comprehensive analytics verification
export const verifyEnhancedAnalytics = () => {
  console.log('🔍 VERIFYING ENHANCED ANALYTICS IMPLEMENTATION');
  console.log('==============================================');
  
  const results = {
    ga4: typeof window.gtag === 'function',
    metaPixel: !!window.fbq,
    siteBehaviour: !!window.sitebehaviourTrackingSecret,
    dataLayer: window.dataLayer && Array.isArray(window.dataLayer),
    visitorTracking: typeof window.Tracer !== 'undefined' || typeof window.init_tracer === 'function',
    timestamp: new Date().toISOString()
  };
  
  console.log('📊 Platform Status:');
  console.log(`${results.ga4 ? '✅' : '❌'} Google Analytics 4: ${results.ga4 ? 'ACTIVE' : 'INACTIVE'}`);
  console.log(`${results.metaPixel ? '✅' : '❌'} Meta Pixel: ${results.metaPixel ? 'ACTIVE' : 'INACTIVE'}`);
  console.log(`${results.siteBehaviour ? '✅' : '❌'} SiteBehaviour: ${results.siteBehaviour ? 'ACTIVE' : 'INACTIVE'}`);
  console.log(`${results.dataLayer ? '✅' : '❌'} DataLayer: ${results.dataLayer ? 'ACTIVE' : 'INACTIVE'}`);
  console.log(`${results.visitorTracking ? '✅' : '❌'} Visitor Tracking: ${results.visitorTracking ? 'ACTIVE' : 'INACTIVE'}`);
  
  const activeCount = Object.values(results).filter(val => val === true).length;
  const totalPlatforms = 5; // Count of tracking platforms we're checking
  
  console.log(`\n📈 Analytics Score: ${activeCount}/${totalPlatforms} platforms active`);
  
  // Test all platforms
  if (activeCount > 0) {
    console.log('\n🧪 Running cross-platform test...');
    trackEnhancedEvent('analytics_verification_test', {
      test_type: 'enhanced_verification',
      platforms_active: activeCount,
      timestamp: new Date().toISOString()
    });
    console.log('✅ Cross-platform test completed');
  }
  
  return results;
};

// Auto-initialize when module loads
if (typeof window !== 'undefined') {
  // Make functions globally available
  window.verifyEnhancedAnalytics = verifyEnhancedAnalytics;
  window.trackEnhancedEvent = trackEnhancedEvent;
  window.trackEnhancedConversion = trackEnhancedConversion;
  
  // Auto-initialize after DOM loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeEnhancedAnalytics);
  } else {
    initializeEnhancedAnalytics();
  }
}