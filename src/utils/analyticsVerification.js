// Google Analytics Verification Utilities

export const verifyGoogleAnalytics = () => {
  const results = {
    timestamp: new Date().toISOString(),
    tests: {},
    overall: false
  };

  // Test 1: Check if gtag function exists
  results.tests.gtagFunction = {
    name: 'gtag Function Available',
    passed: typeof window.gtag === 'function',
    details: typeof window.gtag === 'function' ? 'gtag function loaded' : 'gtag function missing'
  };

  // Test 2: Check dataLayer
  results.tests.dataLayer = {
    name: 'DataLayer Exists',
    passed: window.dataLayer && Array.isArray(window.dataLayer),
    details: window.dataLayer ? `dataLayer with ${window.dataLayer.length} entries` : 'dataLayer missing'
  };

  // Test 3: Check GA script tag
  const gaScript = document.querySelector('script[src*="googletagmanager.com/gtag/js"]');
  results.tests.scriptTag = {
    name: 'Google Analytics Script Tag',
    passed: !!gaScript,
    details: gaScript ? `Script loaded from ${gaScript.src}` : 'GA script tag not found'
  };

  // Test 4: Check tracking ID in page
  const hasTrackingId = document.documentElement.innerHTML.includes('G-CTDQQ8XMKC');
  results.tests.trackingId = {
    name: 'Tracking ID Present',
    passed: hasTrackingId,
    details: hasTrackingId ? 'G-CTDQQ8XMKC found in page' : 'Tracking ID not found'
  };

  // Test 5: Check if config was called
  const configCalled = window.dataLayer && window.dataLayer.some(item => 
    Array.isArray(item) && item[0] === 'config' && item[1] === 'G-CTDQQ8XMKC'
  );
  results.tests.configuration = {
    name: 'GA Configuration Called',
    passed: configCalled,
    details: configCalled ? 'gtag config called for G-CTDQQ8XMKC' : 'No config call detected'
  };

  // Test 6: Fire test event
  let eventFired = false;
  try {
    if (window.gtag) {
      window.gtag('event', 'analytics_verification', {
        event_category: 'testing',
        event_label: 'verification_test',
        custom_parameter: 'test_successful'
      });
      eventFired = true;
    }
  } catch (error) {
    console.error('Error firing test event:', error);
  }

  results.tests.eventFiring = {
    name: 'Event Firing Test',
    passed: eventFired,
    details: eventFired ? 'Test event fired successfully' : 'Could not fire test event'
  };

  // Calculate overall status
  const passedTests = Object.values(results.tests).filter(test => test.passed).length;
  const totalTests = Object.keys(results.tests).length;
  results.overall = passedTests === totalTests;
  results.score = `${passedTests}/${totalTests}`;

  return results;
};

export const logAnalyticsStatus = () => {
  const results = verifyGoogleAnalytics();
  
  console.group('🎯 Google Analytics Verification Report');
  console.log(`📊 Overall Status: ${results.overall ? '✅ OPERATIONAL' : '⚠️ ISSUES DETECTED'}`);
  console.log(`📈 Score: ${results.score}`);
  console.log(`🕒 Timestamp: ${results.timestamp}`);
  
  console.group('📋 Detailed Test Results:');
  Object.entries(results.tests).forEach(([key, test]) => {
    console.log(`${test.passed ? '✅' : '❌'} ${test.name}: ${test.details}`);
  });
  console.groupEnd();

  if (results.overall) {
    console.log('🎉 All tests passed! Google Analytics is fully operational.');
  } else {
    console.log('⚠️ Some tests failed. Check the failed items above.');
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
          page_location: window.location.href
        });
        console.log(`📄 Page load complete tracked for: ${pageName}`);
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
            page_location: window.location.href
          });
          console.log(`📄 Page load complete tracked for: ${pageName}`);
        }
      }, 1000);
    });
  }
};

// Auto-verify on script load
if (typeof window !== 'undefined') {
  // Make verification functions available globally for testing
  window.verifyGoogleAnalytics = verifyGoogleAnalytics;
  window.logAnalyticsStatus = logAnalyticsStatus;
  
  // Auto-run verification after a short delay
  setTimeout(() => {
    console.log('🔍 Auto-running Google Analytics verification...');
    logAnalyticsStatus();
  }, 2000);
}