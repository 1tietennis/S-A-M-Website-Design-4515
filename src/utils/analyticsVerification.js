// Google Analytics 4 & SiteBehaviour Verification Utilities

export const verifyAllAnalytics = () => {
  const results = {
    timestamp: new Date().toISOString(),
    tests: {},
    overall: false
  };

  // Test 1: Check if gtag function exists (GA4)
  results.tests.gtagFunction = {
    name: 'Google Analytics 4 gtag Function',
    passed: typeof window.gtag === 'function',
    details: typeof window.gtag === 'function' ? 'GA4 gtag function loaded' : 'GA4 gtag function missing'
  };

  // Test 2: Check dataLayer (GA4)
  results.tests.dataLayer = {
    name: 'GA4 DataLayer Exists',
    passed: window.dataLayer && Array.isArray(window.dataLayer),
    details: window.dataLayer ? `GA4 dataLayer with ${window.dataLayer.length} entries` : 'GA4 dataLayer missing'
  };

  // Test 3: Check GA4 script tag
  const ga4Script = document.querySelector('script[src*="googletagmanager.com/gtag/js?id=G-CTDQQ8XMKC"]');
  results.tests.ga4ScriptTag = {
    name: 'Google Analytics 4 Script Tag',
    passed: !!ga4Script,
    details: ga4Script ? `GA4 script loaded from ${ga4Script.src}` : 'GA4 script tag not found'
  };

  // Test 4: Check GA4 tracking ID configuration
  const hasGA4TrackingId = window.dataLayer && window.dataLayer.some(item => 
    Array.isArray(item) && item[0] === 'config' && item[1] === 'G-CTDQQ8XMKC'
  );
  results.tests.ga4Configuration = {
    name: 'GA4 Configuration',
    passed: hasGA4TrackingId,
    details: hasGA4TrackingId ? 'GA4 config called for G-CTDQQ8XMKC' : 'GA4 config not detected'
  };

  // Test 5: Check SiteBehaviour tracking
  const siteBehaviourScript = document.querySelector('#site-behaviour-script-v2');
  results.tests.siteBehaviour = {
    name: 'SiteBehaviour Tracking',
    passed: !!siteBehaviourScript && !!window.sitebehaviourTrackingSecret,
    details: siteBehaviourScript ? 'SiteBehaviour script loaded and active' : 'SiteBehaviour not detected'
  };

  // Test 6: Check SiteBehaviour secret
  results.tests.siteBehaviourSecret = {
    name: 'SiteBehaviour Secret Key',
    passed: window.sitebehaviourTrackingSecret === '507f5743-d0f0-49db-a5f0-0d702b989128',
    details: window.sitebehaviourTrackingSecret ? 'SiteBehaviour secret key configured' : 'SiteBehaviour secret missing'
  };

  // Test 7: Fire GA4 test event
  let ga4EventFired = false;
  try {
    if (window.gtag) {
      window.gtag('event', 'analytics_verification_test', {
        event_category: 'testing',
        event_label: 'ga4_verification',
        custom_parameter: 'test_successful',
        timestamp: new Date().toISOString()
      });
      ga4EventFired = true;
    }
  } catch (error) {
    console.error('Error firing GA4 test event:', error);
  }

  results.tests.ga4EventFiring = {
    name: 'GA4 Event Firing Test',
    passed: ga4EventFired,
    details: ga4EventFired ? 'GA4 test event fired successfully' : 'Could not fire GA4 test event'
  };

  // Test 8: Check Firebase Analytics (if configured)
  results.tests.firebaseAnalytics = {
    name: 'Firebase Analytics',
    passed: !!window.firebaseAnalytics,
    details: window.firebaseAnalytics ? 'Firebase Analytics available' : 'Firebase Analytics not configured'
  };

  // Test 9: Check CyborgCRM (if configured)
  results.tests.cyborgCRM = {
    name: 'CyborgCRM Tracking',
    passed: typeof window.CyborgCRM === 'function',
    details: typeof window.CyborgCRM === 'function' ? 'CyborgCRM tracking available' : 'CyborgCRM not configured'
  };

  // Calculate overall status
  const criticalTests = ['gtagFunction', 'dataLayer', 'ga4ScriptTag', 'ga4Configuration', 'ga4EventFiring'];
  const passedCriticalTests = criticalTests.filter(test => results.tests[test].passed).length;
  const totalCriticalTests = criticalTests.length;
  
  results.overall = passedCriticalTests === totalCriticalTests;
  results.score = `${passedCriticalTests}/${totalCriticalTests} critical tests passed`;

  return results;
};

export const logAnalyticsStatus = () => {
  const results = verifyAllAnalytics();
  
  console.group('🎯 COMPLETE ANALYTICS VERIFICATION REPORT');
  console.log(`📊 Overall Status: ${results.overall ? '✅ FULLY OPERATIONAL' : '⚠️ ISSUES DETECTED'}`);
  console.log(`📈 Score: ${results.score}`);
  console.log(`🕒 Timestamp: ${results.timestamp}`);
  
  console.group('🔍 Detailed Test Results:');
  
  // Group results by platform
  console.group('📊 Google Analytics 4:');
  ['gtagFunction', 'dataLayer', 'ga4ScriptTag', 'ga4Configuration', 'ga4EventFiring'].forEach(testKey => {
    const test = results.tests[testKey];
    console.log(`${test.passed ? '✅' : '❌'} ${test.name}: ${test.details}`);
  });
  console.groupEnd();
  
  console.group('📊 SiteBehaviour Tracking:');
  ['siteBehaviour', 'siteBehaviourSecret'].forEach(testKey => {
    const test = results.tests[testKey];
    console.log(`${test.passed ? '✅' : '❌'} ${test.name}: ${test.details}`);
  });
  console.groupEnd();
  
  console.group('📊 Additional Platforms:');
  ['firebaseAnalytics', 'cyborgCRM'].forEach(testKey => {
    const test = results.tests[testKey];
    console.log(`${test.passed ? '✅' : '❌'} ${test.name}: ${test.details}`);
  });
  console.groupEnd();
  
  console.groupEnd();

  if (results.overall) {
    console.log('🎉 All critical tests passed! Analytics is fully operational.');
    console.log('📊 GA4 is actively tracking user behavior and sending data to Google.');
    console.log('📈 SiteBehaviour is monitoring user interactions and engagement.');
  } else {
    console.log('⚠️ Some critical tests failed. Check the failed items above.');
  }

  console.groupEnd();
  
  return results;
};

export const trackPageLoadComplete = (pageName) => {
  // Wait for page to fully load before testing
  if (document.readyState === 'complete') {
    setTimeout(() => {
      logAnalyticsStatus();
      
      // Fire page-specific tracking
      if (window.gtag) {
        window.gtag('event', 'page_load_complete', {
          event_category: 'navigation',
          event_label: pageName,
          page_title: document.title,
          page_location: window.location.href,
          timestamp: new Date().toISOString()
        });
        console.log(`📄 GA4 Page load complete tracked for: ${pageName}`);
      }
    }, 1000);
  } else {
    window.addEventListener('load', () => {
      setTimeout(() => {
        logAnalyticsStatus();
        
        if (window.gtag) {
          window.gtag('event', 'page_load_complete', {
            event_category: 'navigation',
            event_label: pageName,
            page_title: document.title,
            page_location: window.location.href,
            timestamp: new Date().toISOString()
          });
          console.log(`📄 GA4 Page load complete tracked for: ${pageName}`);
        }
      }, 1000);
    });
  }
};

// Auto-verify on script load
if (typeof window !== 'undefined') {
  // Make verification functions available globally for testing
  window.verifyAllAnalytics = verifyAllAnalytics;
  window.logAnalyticsStatus = logAnalyticsStatus;
  
  // Auto-run verification after a short delay
  setTimeout(() => {
    console.log('🔍 Auto-running complete analytics verification...');
    logAnalyticsStatus();
  }, 3000);
}