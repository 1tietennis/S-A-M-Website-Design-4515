// Meta Pixel (Facebook Pixel) Implementation for Secret Agent Digital Marketing

// Meta Pixel Configuration
const META_PIXEL_ID = '1234567890123456'; // Replace with your actual Meta Pixel ID
const META_ACCESS_TOKEN = 'your_meta_access_token'; // Replace with your actual access token

// Initialize Meta Pixel
export const initializeMetaPixel = () => {
  if (typeof window !== 'undefined') {
    console.log('🎯 Initializing Meta Pixel...');
    
    // Facebook Pixel Base Code
    !function(f,b,e,v,n,t,s) {
      if(f.fbq) return;
      n=f.fbq=function() {
        n.callMethod ? n.callMethod.apply(n,arguments) : n.queue.push(arguments)
      };
      if(!f._fbq) f._fbq=n;
      n.push=n;
      n.loaded=!0;
      n.version='2.0';
      n.queue=[];
      t=b.createElement(e);
      t.async=!0;
      t.src=v;
      s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)
    }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    
    // Initialize the pixel
    window.fbq('init', META_PIXEL_ID);
    
    // Track initial page view
    window.fbq('track', 'PageView');
    
    // Enable first-party data collection
    window.fbq('dataProcessingOptions', []);
    
    console.log('✅ Meta Pixel initialized with ID:', META_PIXEL_ID);
    
    // Make fbq globally available for verification
    window.metaPixelLoaded = true;
    
    return true;
  }
  return false;
};

// Enhanced page view tracking for Meta
export const trackMetaPageView = (pageName, pageUrl) => {
  if (typeof window !== 'undefined' && window.fbq) {
    try {
      // Standard PageView event
      window.fbq('track', 'PageView', {
        page_title: document.title,
        page_url: pageUrl || window.location.href,
        page_name: pageName
      });
      
      // Custom event for page tracking
      window.fbq('trackCustom', 'PageVisit', {
        page_name: pageName,
        page_url: pageUrl || window.location.href,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent.substring(0, 100)
      });
      
      console.log('📊 Meta Pixel page view tracked:', pageName);
      return true;
    } catch (error) {
      console.error('❌ Meta Pixel page view tracking failed:', error);
      return false;
    }
  }
  return false;
};

// Lead generation tracking
export const trackMetaLead = (leadData = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    try {
      // Standard Lead event
      window.fbq('track', 'Lead', {
        content_name: leadData.service || 'Digital Marketing Service',
        content_category: 'lead_generation',
        value: leadData.value || 99.99,
        currency: 'USD',
        ...leadData
      });
      
      // Custom lead quality event
      window.fbq('trackCustom', 'QualifiedLead', {
        lead_source: leadData.source || 'website',
        service_interest: leadData.service || 'general',
        budget_range: leadData.budget || 'not_specified',
        urgency: leadData.urgency || 'standard',
        timestamp: new Date().toISOString()
      });
      
      console.log('🎯 Meta Pixel lead tracked:', leadData);
      return true;
    } catch (error) {
      console.error('❌ Meta Pixel lead tracking failed:', error);
      return false;
    }
  }
  return false;
};

// Contact form submission tracking
export const trackMetaContact = (formData = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    try {
      // Standard Contact event
      window.fbq('track', 'Contact', {
        content_name: 'Contact Form Submission',
        content_category: 'contact',
        value: 50.00, // Estimated lead value
        currency: 'USD'
      });
      
      // Custom form submission event
      window.fbq('trackCustom', 'FormSubmission', {
        form_name: formData.formName || 'contact_form',
        form_location: formData.page || window.location.pathname,
        fields_completed: formData.fieldsCompleted || 0,
        submission_time: new Date().toISOString(),
        user_type: formData.userType || 'prospect'
      });
      
      console.log('📝 Meta Pixel contact tracked:', formData);
      return true;
    } catch (error) {
      console.error('❌ Meta Pixel contact tracking failed:', error);
      return false;
    }
  }
  return false;
};

// Purchase/conversion tracking
export const trackMetaPurchase = (purchaseData = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    try {
      // Standard Purchase event
      window.fbq('track', 'Purchase', {
        value: purchaseData.value || 99.99,
        currency: purchaseData.currency || 'USD',
        content_type: 'service',
        content_ids: [purchaseData.serviceId || 'digital_marketing'],
        content_name: purchaseData.serviceName || 'Digital Marketing Service',
        num_items: 1
      });
      
      // Custom conversion event
      window.fbq('trackCustom', 'ServicePurchase', {
        service_type: purchaseData.serviceType || 'marketing',
        package_tier: purchaseData.packageTier || 'standard',
        contract_length: purchaseData.contractLength || '3_months',
        payment_method: purchaseData.paymentMethod || 'not_specified',
        timestamp: new Date().toISOString()
      });
      
      console.log('💰 Meta Pixel purchase tracked:', purchaseData);
      return true;
    } catch (error) {
      console.error('❌ Meta Pixel purchase tracking failed:', error);
      return false;
    }
  }
  return false;
};

// Custom event tracking
export const trackMetaCustomEvent = (eventName, eventData = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    try {
      window.fbq('trackCustom', eventName, {
        ...eventData,
        timestamp: new Date().toISOString(),
        page_url: window.location.href
      });
      
      console.log(`🎯 Meta Pixel custom event tracked: ${eventName}`, eventData);
      return true;
    } catch (error) {
      console.error(`❌ Meta Pixel custom event tracking failed for ${eventName}:`, error);
      return false;
    }
  }
  return false;
};

// Button/interaction tracking
export const trackMetaInteraction = (interactionType, elementName, elementData = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    try {
      // Track as custom event
      window.fbq('trackCustom', 'UserInteraction', {
        interaction_type: interactionType,
        element_name: elementName,
        element_location: elementData.location || window.location.pathname,
        element_text: elementData.text || '',
        timestamp: new Date().toISOString(),
        ...elementData
      });
      
      // Special tracking for CTA buttons
      if (interactionType === 'button_click' && elementData.isCTA) {
        window.fbq('track', 'InitiateCheckout', {
          content_name: elementName,
          content_category: 'cta_interaction',
          value: elementData.estimatedValue || 25.00,
          currency: 'USD'
        });
      }
      
      console.log(`🖱️ Meta Pixel interaction tracked: ${interactionType} - ${elementName}`);
      return true;
    } catch (error) {
      console.error('❌ Meta Pixel interaction tracking failed:', error);
      return false;
    }
  }
  return false;
};

// Video engagement tracking
export const trackMetaVideoEngagement = (videoData = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    try {
      window.fbq('trackCustom', 'VideoEngagement', {
        video_title: videoData.title || 'Marketing Video',
        video_duration: videoData.duration || 0,
        watch_time: videoData.watchTime || 0,
        completion_rate: videoData.completionRate || 0,
        video_type: videoData.type || 'promotional',
        timestamp: new Date().toISOString()
      });
      
      // Track significant video milestones
      if (videoData.completionRate >= 75) {
        window.fbq('track', 'ViewContent', {
          content_type: 'video',
          content_name: videoData.title || 'Marketing Video',
          value: 15.00,
          currency: 'USD'
        });
      }
      
      console.log('🎥 Meta Pixel video engagement tracked:', videoData);
      return true;
    } catch (error) {
      console.error('❌ Meta Pixel video tracking failed:', error);
      return false;
    }
  }
  return false;
};

// Advanced audience building data
export const trackMetaAudienceData = (audienceData = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    try {
      window.fbq('trackCustom', 'AudienceData', {
        business_size: audienceData.businessSize || 'unknown',
        industry: audienceData.industry || 'unknown',
        marketing_budget: audienceData.budget || 'unknown',
        pain_points: audienceData.painPoints || [],
        goals: audienceData.goals || [],
        current_tools: audienceData.currentTools || [],
        timestamp: new Date().toISOString()
      });
      
      console.log('👥 Meta Pixel audience data tracked:', audienceData);
      return true;
    } catch (error) {
      console.error('❌ Meta Pixel audience tracking failed:', error);
      return false;
    }
  }
  return false;
};

// Comprehensive Meta Pixel verification
export const verifyMetaPixel = () => {
  console.log('🔍 VERIFYING META PIXEL IMPLEMENTATION');
  console.log('====================================');
  
  const results = {
    pixelLoaded: !!window.fbq,
    pixelId: META_PIXEL_ID,
    eventsQueue: window.fbq ? window.fbq.queue : null,
    loadedFlag: window.metaPixelLoaded,
    timestamp: new Date().toISOString()
  };
  
  console.log('📊 Meta Pixel Status:');
  console.log(`${results.pixelLoaded ? '✅' : '❌'} Pixel Loaded: ${results.pixelLoaded ? 'YES' : 'NO'}`);
  console.log(`📍 Pixel ID: ${results.pixelId}`);
  console.log(`🔄 Events Queue: ${results.eventsQueue ? results.eventsQueue.length + ' events' : 'Not available'}`);
  console.log(`🎯 Loaded Flag: ${results.loadedFlag ? 'TRUE' : 'FALSE'}`);
  
  // Test event firing
  if (results.pixelLoaded) {
    try {
      window.fbq('trackCustom', 'PixelVerification', {
        test: true,
        verification_time: new Date().toISOString()
      });
      console.log('✅ Test event fired successfully');
      results.testEventFired = true;
    } catch (error) {
      console.log('❌ Test event failed:', error);
      results.testEventFired = false;
    }
  }
  
  const allPassed = results.pixelLoaded && results.loadedFlag && results.testEventFired;
  
  console.log(`\n🎯 Overall Status: ${allPassed ? '✅ FULLY OPERATIONAL' : '⚠️ ISSUES DETECTED'}`);
  
  if (allPassed) {
    console.log('🎉 Meta Pixel is working perfectly!');
    console.log('📊 Data is being sent to Facebook/Meta for advertising optimization');
  } else {
    console.log('⚠️ Meta Pixel needs attention - check implementation');
  }
  
  return results;
};

// Real-time Meta Pixel testing
export const testMetaPixelRealTime = () => {
  console.log('🧪 TESTING META PIXEL REAL-TIME TRACKING');
  console.log('========================================');
  
  if (typeof window.fbq === 'function') {
    const testEvents = [
      {
        type: 'standard',
        name: 'ViewContent',
        params: {
          content_type: 'test',
          value: 1,
          currency: 'USD'
        }
      },
      {
        type: 'custom',
        name: 'TestTracking',
        params: {
          test_type: 'real_time_verification'
        }
      },
      {
        type: 'custom',
        name: 'PixelHealthCheck',
        params: {
          status: 'testing',
          timestamp: Date.now()
        }
      }
    ];
    
    testEvents.forEach((event, index) => {
      setTimeout(() => {
        try {
          if (event.type === 'standard') {
            window.fbq('track', event.name, event.params);
          } else {
            window.fbq('trackCustom', event.name, event.params);
          }
          console.log(`📊 Test event ${index + 1} sent: ${event.name}`);
        } catch (error) {
          console.log(`❌ Test event ${index + 1} failed: ${error.message}`);
        }
      }, index * 1000);
    });
    
    console.log('✅ All test events queued for sending');
    console.log('📈 Check Meta Events Manager for real-time data');
  } else {
    console.error('❌ fbq function not available');
  }
};

// Make functions globally available for testing
if (typeof window !== 'undefined') {
  window.verifyMetaPixel = verifyMetaPixel;
  window.testMetaPixelRealTime = testMetaPixelRealTime;
  window.trackMetaCustomEvent = trackMetaCustomEvent;
}

export default {
  initializeMetaPixel,
  trackMetaPageView,
  trackMetaLead,
  trackMetaContact,
  trackMetaPurchase,
  trackMetaCustomEvent,
  trackMetaInteraction,
  trackMetaVideoEngagement,
  trackMetaAudienceData,
  verifyMetaPixel,
  testMetaPixelRealTime
};